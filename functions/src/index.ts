
'use server';

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {setGlobalOptions} from 'firebase-functions/v1';
import {onRequest} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import express from 'express';
import {generateCaptions} from '@/ai/flows/generate-captions';
import {findHashtags} from '@/ai/flows/find-hashtags';
import {getBestTimeToPost} from '@/ai/flows/best-time-to-post';
import {trendForecast} from '@/ai/flows/trend-forecasting'; 
import Stripe from 'stripe';
import {db, auth} from './firebase-admin';
import {addCreditsToUser} from './services/users';
import {FieldValue} from 'firebase-admin/firestore';
import cors from 'cors';

// Set global options for functions
setGlobalOptions({maxInstances: 10});

// Initialize Stripe outside of the request handler
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const app = express();

// Use CORS middleware
app.use(cors({origin: true}));

// --- Stripe Webhook ---
app.post(
  '/v1/stripe-webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const priceId = session.line_items?.data[0]?.price?.id;

      if (!userId || !priceId) {
        logger.error('Missing userId or priceId in checkout session.', {
          session_id: session.id,
        });
        return res.status(400).send('Webhook Error: Missing metadata.');
      }

      logger.info(
        `Processing successful payment for user ${userId}, price: ${priceId}`
      );
      const result = await addCreditsToUser(userId, priceId);

      if (!result.success) {
        logger.error(
          `Failed to add credits for user ${userId}: ${result.error}`
        );
        return res.status(500).send({error: result.error});
      }
      logger.info(`Credits successfully added for user ${userId}.`);
    } else {
      logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).send({received: true});
  }
);

// All other routes should use express.json()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Middleware to verify Firebase ID token
const authenticateFirebaseToken: express.Handler = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send({error: 'Unauthorized: No token provided.'});
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    res.locals.user = decodedToken;
    return next();
  } catch (error) {
    logger.error('Firebase token verification failed:', error);
    return res.status(403).send({error: 'Unauthorized: Invalid token.'});
  }
};

const checkUsageAndDecrementCredits =
  ({
    toolType,
    cost,
  }: {
    toolType: 'trend_forecast' | 'content_tool' | 'image_tool';
    cost: number;
  }): express.Handler =>
  async (req, res, next) => {
    const {uid} = res.locals.user;
    const userRef = db.collection('users').doc(uid);
    const FREE_LIMIT = 2;

    const dateField = `last_free_use_date_${toolType}`;
    const countField = `free_uses_today_${toolType}`;

    try {
      const userDoc = await userRef.get();
      const userData = userDoc.data() || {};
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const lastUseDate = userData[dateField];
      let freeUsesToday = userData[countField] || 0;

      if (lastUseDate !== todayStr) {
        freeUsesToday = 0;
        await userRef.set({[dateField]: todayStr, [countField]: 0}, {merge: true});
      }

      if (freeUsesToday < FREE_LIMIT) {
        await userRef.update({[countField]: FieldValue.increment(1)});
        logger.info(
          `User ${uid} used a free ${toolType}. Uses today: ${
            freeUsesToday + 1
          }`
        );
        return next();
      }

      const credits = userData.ai_credits || 0;
      if (credits >= cost) {
        await userRef.update({ai_credits: FieldValue.increment(-cost)});
        logger.info(
          `User ${uid} used ${cost} paid credits for ${toolType}. Credits remaining: ${
            credits - cost
          }`
        );
        return next();
      }

      const errorMsg = `This action costs ${cost} credits, but you only have ${credits}. Please purchase more credits.`;
      logger.warn(`User ${uid} failed to use ${toolType}: Not enough credits.`);
      return res.status(429).send({success: false, error: errorMsg});
    } catch (error) {
      logger.error(
        `Error in usage middleware for ${uid} and ${toolType}:`,
        error
      );
      return res.status(500).send({
        success: false,
        error: 'An internal error occurred while checking usage limits.',
      });
    }
  };

// --- API Endpoints ---

// POST /v1/create-checkout-session
app.post(
  '/v1/create-checkout-session',
  authenticateFirebaseToken,
  async (req, res) => {
    const {priceId, successUrl, cancelUrl} = req.body;
    const {uid} = res.locals.user;

    if (!priceId || !successUrl || !cancelUrl) {
      return res
        .status(400)
        .send({error: 'Missing required parameters.'});
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{price: priceId, quantity: 1}],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: uid,
      });
      logger.info(
        `Stripe checkout session created for user ${uid}, session ID: ${session.id}`
      );
      return res.status(200).send({sessionId: session.id, url: session.url});
    } catch (e: any) {
      logger.error('Stripe checkout session creation error:', e);
      return res
        .status(500)
        .send({error: 'Failed to create checkout session.', details: e.message});
    }
  }
);

// POST /v1/trend-forecast
app.post(
  '/v1/trend-forecast',
  authenticateFirebaseToken,
  checkUsageAndDecrementCredits({toolType: 'trend_forecast', cost: 5}),
  async (req, res) => {
    const {input, timeHorizon} = req.body;
    const {uid} = res.locals.user;

    if (!input || !timeHorizon) {
      return res
        .status(400)
        .send({error: 'Request must include "input" and "timeHorizon".'});
    }

    try {
      const result = await trendForecast({input, timeHorizon});
      return res.status(200).send({success: true, data: result});
    } catch (e: any) {
      logger.error(`Error in /v1/trend-forecast for user ${uid}:`, e);
      return res.status(500).send({
        success: false,
        error:
          e.message ||
          'An unexpected error occurred during trend forecasting.',
      });
    }
  }
);

// --- AI TOOLS ---
const contentToolMiddleware = [
  authenticateFirebaseToken,
  checkUsageAndDecrementCredits({toolType: 'content_tool', cost: 1}),
];

app.post(
  '/v1/generate-captions',
  contentToolMiddleware,
  async (req, res) => {
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
  }
);

app.post(
  '/v1/find-hashtags',
  contentToolMiddleware,
  async (req, res) => {
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
  }
);

app.post(
  '/v1/best-time-to-post',
  contentToolMiddleware,
  async (req, res) => {
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
  }
);

export const api = onRequest({timeoutSeconds: 60}, app);
