
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
import {apiPredict} from './ai/flows/api-predict';
import {generateCaptions} from './ai/flows/generate-captions';
import {findHashtags} from './ai/flows/find-hashtags';
import {getBestTimeToPost} from './ai/flows/best-time-to-post';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import {db} from './firebase-admin';


// Set global options for functions
setGlobalOptions({maxInstances: 10});

const app = express();
app.use(express.json());

// Middleware for API Key Authentication and Rate Limiting
const authenticateAndRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // bypass auth for checkout creation
  if (req.path.startsWith('/v1/create-checkout-session')) {
    return next();
  }
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

app.use(authenticateAndRateLimit);

// --- API Endpoints ---

// POST /v1/create-checkout-session
app.post(
  '/v1/create-checkout-session',
  async (req: Request, res: Response) => {
    const {priceId, successUrl, cancelUrl} = req.body;

    if (!priceId) {
      return res.status(400).send({error: 'Price ID is missing.'});
    }
    if (!successUrl || !cancelUrl) {
      return res
        .status(400)
        .send({error: 'Success and cancel URLs are required.'});
    }

    try {
      // Initialize Stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2024-06-20',
      });
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

// GET /v1/trends
app.get('/v1/trends', (req: Request, res: Response) => {
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

// POST /v1/predict
app.post('/v1/predict', async (req: Request, res: Response) => {
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

// POST /v1/generate-captions
app.post('/v1/generate-captions', async (req: Request, res: Response) => {
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
app.post('/v1/find-hashtags', async (req: Request, res: Response) => {
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
app.post('/v1/best-time-to-post', async (req: Request, res: Response) => {
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

// Export the Express app as an onRequest function
export const api = onRequest(app);
