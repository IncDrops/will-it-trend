
'use server';
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {setGlobalOptions} from 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import express, {Request, Response, NextFunction} from 'express';
import {apiPredict} from '@/ai/flows/api-predict';
import {generateCaptions} from '@/ai/flows/generate-captions';
import {findHashtags} from '@/ai/flows/find-hashtags';
import {getBestTimeToPost} from '@/ai/flows/best-time-to-post';
import {trendForecast} from '@/ai/flows/trend-forecasting';
import {generateImage} from '@/ai/flows/generate-image';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import { db, auth } from './firebase-admin';
import { addCreditsToUser } from './services/users';
import { FieldValue } from 'firebase-admin/firestore';


// Set global options for functions
setGlobalOptions({maxInstances: 10});

// Initialize Stripe outside of the request handler
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const app = express();

// --- Stripe Webhook ---
// We need to use express.raw for the webhook endpoint so that the raw body is preserved.
// Stripe requires the raw body to verify the signature.
app.post('/v1/stripe-webhook', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!signature || !webhookSecret) {
        logger.error('Stripe signature or webhook secret is missing.');
        return res.status(400).send('Webhook Error: Missing signature or secret.');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
        logger.error('Stripe webhook signature verification failed.', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.client_reference_id;
        const priceId = session.line_items?.data[0]?.price?.id;

        if (!userId || !priceId) {
            logger.error('Missing userId or priceId in checkout session.', { session_id: session.id });
            return res.status(400).send('Webhook Error: Missing metadata.');
        }
        
        logger.info(`Processing successful payment for user ${userId}, price: ${priceId}`);

        const result = await addCreditsToUser(userId, priceId);
        
        if (!result.success) {
            return res.status(500).send({ error: result.error });
        }
    }

    res.status(200).send({ received: true });
});


// All other routes should use express.json()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


// Middleware to verify Firebase ID token
const authenticateFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).send({ error: 'Unauthorized: No token provided.' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        res.locals.user = decodedToken; // Add user to response locals
        return next();
    } catch (error) {
        logger.error('Firebase token verification failed:', error);
        return res.status(403).send({ error: 'Unauthorized: Invalid token.' });
    }
};

const checkUsageAndDecrementCredits = ({ toolType, cost }: { toolType: 'trend_forecast' | 'content_tool' | 'image_tool', cost: number }) => async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = res.locals.user;
  const userRef = db.collection('users').doc(uid);
  const FREE_LIMIT = 2;

  const dateField = `last_free_use_date_${toolType}`;
  const countField = `free_uses_today_${toolType}`;

  try {
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Check for free uses first
    const lastUseDate = userData[dateField];
    let freeUsesToday = userData[countField] || 0;

    if (lastUseDate !== todayStr) {
      // It's a new day, reset free uses for this tool type
      freeUsesToday = 0;
      await userRef.set({ [dateField]: todayStr, [countField]: 0 }, { merge: true });
    }

    if (freeUsesToday < FREE_LIMIT) {
      // User has free uses left
      await userRef.update({ [countField]: FieldValue.increment(1) });
      logger.info(`User ${uid} used a free ${toolType}. Uses today: ${freeUsesToday + 1}`);
      return next();
    }
    
    // If no free uses left, check for paid credits
    const credits = userData.ai_credits || 0;
    if (credits >= cost) {
      await userRef.update({ ai_credits: FieldValue.increment(-cost) });
      logger.info(`User ${uid} used ${cost} paid credits for ${toolType}. Credits remaining: ${credits - cost}`);
      return next();
    }

    // No free uses and not enough credits
    const errorMsg = `This action costs ${cost} credits, but you only have ${credits}. Please purchase more credits.`;
      
    return res.status(429).send({ success: false, error: errorMsg });

  } catch (error) {
    logger.error(`Error in usage middleware for ${uid} and ${toolType}:`, error);
    return res.status(500).send({ success: false, error: 'An internal error occurred while checking usage limits.' });
  }
};


// Middleware for API Key Authentication and Rate Limiting
const authenticateAndRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).send({error: 'API key is missing.'});
  }

  try {
    const apiKeyDocRef = db.collection('api_keys').doc(apiKey);
    const apiKeyDoc = await apiKeyDocRef.get();

    if (!apiKeyDoc.exists || !apiKeyDoc.data()?.active) {
      return res.status(403).send({error: 'Invalid or inactive API key.'});
    }

    const keyData = apiKeyDoc.data()!;
    const {tier, request_count = 0, last_request_timestamp} = keyData;

    // Define Tier Limits (requests per hour)
    const tiers: {[key: string]: {limit: number}} = {
      starter: {limit: 10},
      pro: {limit: 100},
      enterprise: {limit: Infinity},
    };

    const tierLimit = tiers[tier]?.limit;

    if (!tierLimit) {
      return res.status(403).send({error: 'Invalid API tier.'});
    }

    // Check if usage is for the current hour
    const now = new Date();
    const isNewHour = last_request_timestamp
      ? now.getTime() - last_request_timestamp.toDate().getTime() > 3600 * 1000
      : true;

    let currentRequestCount = request_count;

    // Reset count if it's a new hour
    if (isNewHour) {
      currentRequestCount = 0;
    }

    if (currentRequestCount >= tierLimit) {
      return res.status(429).send({
        error: 'Hourly request limit exceeded. Please upgrade your plan.',
      });
    }

    // Log the request and update the count
    const newCount = currentRequestCount + 1;
    await apiKeyDocRef.update({
      request_count: newCount,
      last_request_timestamp: now,
    });

    // Store key data in response locals for endpoint use
    res.locals.keyData = keyData;

    // Asynchronously log usage
    apiKeyDocRef.collection('usage_logs').add({
      timestamp: now,
      path: req.path,
      method: req.method,
      status: res.statusCode,
    });

    return next();
  } catch (error) {
    logger.error('API Key Middleware Error:', error);
    return res.status(500).send({error: 'Internal server error.'});
  }
};

// --- API Endpoints ---

// POST /v1/create-checkout-session
app.post(
  '/v1/create-checkout-session',
  authenticateFirebaseToken,
  async (req: Request, res: Response) => {
    const {priceId, successUrl, cancelUrl} = req.body;
    const { uid } = res.locals.user;


    if (!priceId) {
      return res.status(400).send({error: 'Price ID is missing.'});
    }
    if (!successUrl || !cancelUrl) {
      return res
        .status(400)
        .send({error: 'Success and cancel URLs are required.'});
    }
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: uid,
      });

      return res.status(200).send({sessionId: session.id, url: session.url});
    } catch (e: any) {
      logger.error('Stripe checkout session error:', e);
      return res
        .status(500)
        .send({error: 'Failed to create checkout session.', details: e.message});
    }
  }
);


// POST /v1/trend-forecast - Firebase Auth
app.post('/v1/trend-forecast', 
    authenticateFirebaseToken, 
    checkUsageAndDecrementCredits({ toolType: 'trend_forecast', cost: 5 }), 
    async (req: Request, res: Response) => {
    const { input, timeHorizon } = req.body;
  
    if (!input || !timeHorizon) {
      return res.status(400).send({ error: 'Request must include "input" and "timeHorizon".' });
    }
  
    try {
      const result = await trendForecast({ input, timeHorizon });
      return res.status(200).send({ success: true, data: result });
    } catch (e: any) {
      logger.error('Error in /v1/trend-forecast:', e);
      return res.status(500).send({ success: false, error: e.message || 'An unexpected error occurred.' });
    }
  });

// GET /v1/trends - API Key Auth
app.get('/v1/trends', authenticateAndRateLimit, (req: Request, res: Response) => {
  // Placeholder for fetching real-time trends
  // You can apply tier-based result limiting here using res.locals.keyData
  const tier = res.locals.keyData.tier;
  let limit = 10; // Default for starter
  if (tier === 'pro') limit = 50;
  if (tier === 'enterprise') limit = 100; // Or some other high number

  return res.status(200).send({
    message: 'Trends endpoint hit successfully.',
    data: [{trend: '#SampleTrend', score: 95}].slice(0, limit),
  });
});

// POST /v1/predict - API Key Auth
app.post('/v1/predict', authenticateAndRateLimit, async (req: Request, res: Response) => {
  const {topic} = req.body;
  if (!topic) {
    return res.status(400).send({error: 'Prediction "topic" is missing.'});
  }

  const cacheKey = crypto.createHash('md5').update(topic).digest('hex');
  const cacheRef = db.collection('predictions_cache').doc(cacheKey);

  try {
    // Check cache first
    const cachedDoc = await cacheRef.get();
    if (cachedDoc.exists) {
      const data = cachedDoc.data();
      const now = new Date().getTime();
      const cacheTime = data?.timestamp.toDate().getTime();
      // Cache valid for 1 hour
      if (now - cacheTime < 3600 * 1000) {
        logger.info(`Returning cached result for topic: ${topic}`);
        return res.status(200).send({
          message: 'Prediction successful from cache.',
          prediction: data?.prediction,
        });
      }
    }

    // If not in cache or expired, call AI
    logger.info(`Calling AI for topic: ${topic}`);
    const prediction = await apiPredict({topic});

    // Save to cache
    await cacheRef.set({
      prediction,
      timestamp: new Date(),
    });

    return res.status(200).send({
      message: 'Predict endpoint hit successfully.',
      prediction,
    });
  } catch (e: any) {
    logger.error('Error in /v1/predict:', e);
    return res
      .status(500)
      .send({error: 'Failed to get prediction from AI.', details: e.message});
  }
});

// --- AI TOOLS - Firebase Auth ---

const contentToolMiddleware = [authenticateFirebaseToken, checkUsageAndDecrementCredits({ toolType: 'content_tool', cost: 1 })];

// POST /v1/generate-captions
app.post('/v1/generate-captions', contentToolMiddleware, async (req: Request, res: Response) => {
  const {topic, tone} = req.body;
  if (!topic || !tone) {
    return res
      .status(400)
      .send({error: 'Request body must include "topic" and "tone".'});
  }
  try {
    const result = await generateCaptions({topic, tone});
    return res.status(200).send(result);
  } catch (e: any) {
    logger.error('Error in /v1/generate-captions:', e);
    return res
      .status(500)
      .send({error: 'Failed to generate captions.', details: e.message});
  }
});

// POST /v1/find-hashtags
app.post('/v1/find-hashtags', contentToolMiddleware, async (req: Request, res: Response) => {
  const {topic} = req.body;
  if (!topic) {
    return res.status(400).send({error: 'Request body must include "topic".'});
  }
  try {
    const result = await findHashtags({topic});
    return res.status(200).send(result);
  } catch (e: any) {
    logger.error('Error in /v1/find-hashtags:', e);
    return res
      .status(500)
      .send({error: 'Failed to find hashtags.', details: e.message});
  }
});

// POST /v1/best-time-to-post
app.post('/v1/best-time-to-post', contentToolMiddleware, async (req: Request, res: Response) => {
  const {industry, platform} = req.body;
  if (!industry || !platform) {
    return res
      .status(400)
      .send({error: 'Request body must include "industry" and "platform".'});
  }
  try {
    const result = await getBestTimeToPost({industry, platform});
    return res.status(200).send(result);
  } catch (e: any) {
    logger.error('Error in /v1/best-time-to-post:', e);
    return res
      .status(500)
      .send({error: 'Failed to get best time to post.', details: e.message});
  }
});

// POST /v1/generate-image - Firebase Auth
app.post(
  '/v1/generate-image',
  authenticateFirebaseToken,
  checkUsageAndDecrementCredits({toolType: 'image_tool', cost: 10}),
  async (req, res) => {
    const {prompt} = req.body;

    if (!prompt) {
      return res.status(400).send({error: 'A "prompt" is required.'});
    }

    try {
      const result = await generateImage({prompt});
      return res.status(200).send({success: true, data: result});
    } catch (e: any) {
      logger.error('Error in /v1/generate-image:', e);
      return res
        .status(500)
        .send({success: false, error: e.message || 'An unexpected error occurred.'});
    }
  }
);


// Export the Express app as an onRequest function
export const api = onRequest(app);
