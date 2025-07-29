"use strict";
// functions/src/index.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const express_1 = __importDefault(require("express"));
const api_predict_1 = require("@/ai/flows/api-predict");
const generate_captions_1 = require("@/ai/flows/generate-captions");
const find_hashtags_1 = require("@/ai/flows/find-hashtags");
const best_time_to_post_1 = require("@/ai/flows/best-time-to-post");
const trend_forecasting_1 = require("@/ai/flows/trend-forecasting");
const crypto = __importStar(require("crypto"));
const stripe_1 = __importDefault(require("stripe"));
const firebase_admin_1 = require("./firebase-admin"); // Correctly import db and auth from firebase-admin.ts
const users_1 = require("./services/users");
const firestore_1 = require("firebase-admin/firestore");
// Set global options for functions
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
// Initialize Stripe outside of the request handler
// Ensure STRIPE_SECRET_KEY is set in your Firebase Functions environment variables
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});
const app = (0, express_1.default)();
// --- Stripe Webhook ---
// We need to use express.raw for the webhook endpoint so that the raw body is preserved.
// Stripe requires the raw body to verify the signature.
app.post('/v1/stripe-webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    // Ensure STRIPE_WEBHOOK_SECRET is set in your Firebase Functions environment variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
        logger.error('Stripe signature or webhook secret is missing.');
        return res.status(400).send('Webhook Error: Missing signature or secret.');
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (err) {
        logger.error('Stripe webhook signature verification failed.', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const priceId = session.line_items?.data[0]?.price?.id;
        if (!userId || !priceId) {
            logger.error('Missing userId or priceId in checkout session.', { session_id: session.id });
            return res.status(400).send('Webhook Error: Missing metadata.');
        }
        logger.info(`Processing successful payment for user ${userId}, price: ${priceId}`);
        const result = await (0, users_1.addCreditsToUser)(userId, priceId);
        if (!result.success) {
            logger.error(`Failed to add credits for user ${userId}: ${result.error}`);
            return res.status(500).send({ error: result.error });
        }
        logger.info(`Credits successfully added for user ${userId}.`);
    }
    else {
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }
    return res.status(200).send({ received: true }); // Ensure return here
});
// All other routes should use express.json()
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Middleware to verify Firebase ID token
const authenticateFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        logger.warn('Unauthorized: No token provided.');
        return res.status(401).send({ error: 'Unauthorized: No token provided.' });
    }
    try {
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
        res.locals.user = decodedToken; // Add user to response locals
        logger.info(`Firebase token authenticated for user: ${decodedToken.uid}`);
        return next();
    }
    catch (error) {
        logger.error('Firebase token verification failed:', error);
        return res.status(403).send({ error: 'Unauthorized: Invalid token.' });
    }
};
const checkUsageAndDecrementCredits = ({ toolType, cost }) => async (req, res, next) => {
    const { uid } = res.locals.user;
    const userRef = firebase_admin_1.db.collection('users').doc(uid);
    const FREE_LIMIT = 2; // Allow 2 free uses per tool per day
    const dateField = `last_free_use_date_${toolType}`;
    const countField = `free_uses_today_${toolType}`;
    try {
        const userDoc = await userRef.get();
        const userData = userDoc.data() || {};
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        // Check for free uses first
        const lastUseDate = userData[dateField];
        let freeUsesToday = userData[countField] || 0;
        if (lastUseDate !== todayStr) {
            // It's a new day, reset free uses for this tool type
            freeUsesToday = 0;
            // Use set with merge to create the user doc if it doesn't exist, or update it
            await userRef.set({ [dateField]: todayStr, [countField]: 0 }, { merge: true });
            logger.info(`User ${uid}: New day, resetting free uses for ${toolType}.`);
        }
        if (freeUsesToday < FREE_LIMIT) {
            // User has free uses left
            await userRef.update({ [countField]: firestore_1.FieldValue.increment(1) });
            logger.info(`User ${uid} used a free ${toolType}. Uses today: ${freeUsesToday + 1}`);
            return next();
        }
        // If no free uses left, check for paid credits
        const credits = userData.ai_credits || 0;
        if (credits >= cost) {
            await userRef.update({ ai_credits: firestore_1.FieldValue.increment(-cost) });
            logger.info(`User ${uid} used ${cost} paid credits for ${toolType}. Credits remaining: ${credits - cost}`);
            return next();
        }
        // No free uses and not enough credits
        const errorMsg = `This action costs ${cost} credits, but you only have ${credits}. Please purchase more credits.`;
        logger.warn(`User ${uid} failed to use ${toolType}: Not enough credits.`);
        return res.status(429).send({ success: false, error: errorMsg });
    }
    catch (error) {
        logger.error(`Error in usage middleware for ${uid} and ${toolType}:`, error);
        return res.status(500).send({ success: false, error: 'An internal error occurred while checking usage limits.' });
    }
};
// Middleware for API Key Authentication and Rate Limiting
const authenticateAndRateLimit = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        logger.warn('API Key Middleware: API key is missing.');
        return res.status(401).send({ error: 'API key is missing.' });
    }
    try {
        const apiKeyDocRef = firebase_admin_1.db.collection('api_keys').doc(apiKey);
        const apiKeyDoc = await apiKeyDocRef.get();
        if (!apiKeyDoc.exists || !apiKeyDoc.data()?.active) {
            logger.warn(`API Key Middleware: Invalid or inactive API key: ${apiKey}`);
            return res.status(403).send({ error: 'Invalid or inactive API key.' });
        }
        const keyData = apiKeyDoc.data();
        const { tier, request_count = 0, last_request_timestamp } = keyData;
        // Define Tier Limits (requests per hour)
        const tiers = {
            starter: { limit: 10 },
            pro: { limit: 100 },
            enterprise: { limit: Infinity },
        };
        const tierLimit = tiers[tier]?.limit;
        if (!tierLimit) {
            logger.error(`API Key Middleware: Invalid API tier '${tier}' for key: ${apiKey}`);
            return res.status(403).send({ error: 'Invalid API tier.' });
        }
        // Check if usage is for the current hour
        const now = new Date();
        // Convert Firestore Timestamp to Date object if it's not already
        const lastRequestDate = last_request_timestamp ? (last_request_timestamp instanceof Date ? last_request_timestamp : last_request_timestamp.toDate()) : null;
        // Determine if an hour has passed since the last request or if it's the very first request
        const isNewHour = !lastRequestDate || (now.getTime() - lastRequestDate.getTime() > 3600 * 1000);
        let currentRequestCount = request_count;
        // Reset count if it's a new hour
        if (isNewHour) {
            currentRequestCount = 0;
        }
        if (currentRequestCount >= tierLimit) {
            logger.warn(`API Key Middleware: API Key ${apiKey} exceeded hourly limit for tier ${tier}.`);
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
        logger.info(`API Key Middleware: Key ${apiKey} used. Request count: ${newCount}/${tierLimit}`);
        // Store key data in response locals for endpoint use
        res.locals.keyData = keyData;
        // Asynchronously log usage (fire and forget for performance)
        apiKeyDocRef.collection('usage_logs').add({
            timestamp: now,
            path: req.path,
            method: req.method,
            status: 'pending', // Status will be updated on response if needed, or assume success
            apiKeyId: apiKey, // Include apiKeyId for easier querying
        }).catch(logError => logger.error('Failed to log API key usage:', logError));
        return next(); // Ensure return here
    }
    catch (error) {
        logger.error('API Key Middleware Error:', error);
        return res.status(500).send({ error: 'Internal server error during API key validation.' });
    }
};
// --- API Endpoints ---
// POST /v1/create-checkout-session - Requires Firebase Auth Token
app.post('/v1/create-checkout-session', authenticateFirebaseToken, // Only Firebase Auth for this
async (req, res) => {
    const { priceId, successUrl, cancelUrl } = req.body;
    const { uid } = res.locals.user; // uid from authenticated Firebase user
    if (!priceId) {
        logger.warn(`User ${uid}: Price ID is missing for checkout session.`);
        return res.status(400).send({ error: 'Price ID is missing.' });
    }
    if (!successUrl || !cancelUrl) {
        logger.warn(`User ${uid}: Success and cancel URLs are required for checkout session.`);
        return res
            .status(400)
            .send({ error: 'Success and cancel URLs are required.' });
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
            client_reference_id: uid, // Important: Link Stripe session to Firebase User ID
        });
        logger.info(`Stripe checkout session created for user ${uid}, session ID: ${session.id}`);
        return res.status(200).send({ sessionId: session.id, url: session.url });
    }
    catch (e) {
        logger.error('Stripe checkout session creation error:', e);
        return res
            .status(500)
            .send({ error: 'Failed to create checkout session.', details: e.message });
    }
});
// POST /v1/trend-forecast - Requires Firebase Auth Token & Usage Check
app.post('/v1/trend-forecast', authenticateFirebaseToken, checkUsageAndDecrementCredits({ toolType: 'trend_forecast', cost: 5 }), // Cost per use
async (req, res) => {
    const { input, timeHorizon } = req.body;
    const { uid } = res.locals.user; // User ID from Firebase Auth
    if (!input || !timeHorizon) {
        logger.warn(`User ${uid}: Missing input or timeHorizon for trend forecast.`);
        return res.status(400).send({ error: 'Request must include "input" and "timeHorizon".' });
    }
    logger.info(`User ${uid}: Attempting trend forecast for input: "${input}", timeHorizon: "${timeHorizon}"`);
    try {
        // Call the Genkit AI flow
        const result = await (0, trend_forecasting_1.trendForecast)({ input, timeHorizon });
        logger.info(`User ${uid}: Trend forecast successful.`);
        return res.status(200).send({ success: true, data: result });
    }
    catch (e) {
        logger.error(`Error in /v1/trend-forecast for user ${uid}:`, e);
        // Provide a more user-friendly error if the AI flow fails
        return res.status(500).send({
            success: false,
            error: e.message || 'An unexpected error occurred during trend forecasting. Please try again.',
        });
    }
});
// GET /v1/trends - Requires API Key Auth & Rate Limiting
app.get('/v1/trends', authenticateAndRateLimit, (req, res) => {
    // Placeholder for fetching real-time trends
    // You can apply tier-based result limiting here using res.locals.keyData
    const tier = res.locals.keyData.tier;
    let limit = 10; // Default for starter
    if (tier === 'pro')
        limit = 50;
    if (tier === 'enterprise')
        limit = 100; // Or some other high number
    logger.info(`API Key user (tier: ${tier}) requested trends. Limiting to ${limit} results.`);
    return res.status(200).send({
        message: 'Trends endpoint hit successfully. (Placeholder data)',
        data: [{ trend: '#SampleTrend', score: 95 }, { trend: '#AnotherTrend', score: 88 }, { trend: '#AIRevolution', score: 99 }, { trend: '#FutureTech', score: 92 }].slice(0, limit),
    });
});
// POST /v1/predict - Requires API Key Auth & Rate Limiting
app.post('/v1/predict', authenticateAndRateLimit, async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        logger.warn('Prediction "topic" is missing.');
        return res.status(400).send({ error: 'Prediction "topic" is missing.' });
    }
    const cacheKey = crypto.createHash('md5').update(topic).digest('hex');
    const cacheRef = firebase_admin_1.db.collection('predictions_cache').doc(cacheKey);
    try {
        // Check cache first
        const cachedDoc = await cacheRef.get();
        if (cachedDoc.exists) {
            const data = cachedDoc.data();
            const now = new Date().getTime();
            const cacheTime = data?.timestamp && typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate().getTime() : 0; // Handle potential undefined timestamp
            // Cache valid for 1 hour (3600 * 1000 milliseconds)
            if (now - cacheTime < 3600 * 1000) {
                logger.info(`Returning cached prediction for topic: ${topic}`);
                return res.status(200).send({
                    message: 'Prediction successful from cache.',
                    prediction: data?.prediction,
                });
            }
        }
        // If not in cache or expired, call AI
        logger.info(`Calling AI for prediction topic: ${topic}`);
        const prediction = await (0, api_predict_1.apiPredict)({ topic }); // Assumes apiPredict is a Genkit flow
        // Save to cache
        await cacheRef.set({
            prediction,
            timestamp: new Date(),
        });
        logger.info(`Prediction for topic: ${topic} saved to cache.`);
        return res.status(200).send({
            message: 'Predict endpoint hit successfully.',
            prediction,
        });
    }
    catch (e) {
        logger.error('Error in /v1/predict:', e);
        return res
            .status(500)
            .send({ error: 'Failed to get prediction from AI.', details: e.message });
    }
});
// --- AI TOOLS - Firebase Auth & Usage Check (cost: 1 credit) ---
// These routes use Firebase Authentication and credit checks
const contentToolMiddleware = [authenticateFirebaseToken, checkUsageAndDecrementCredits({ toolType: 'content_tool', cost: 1 })];
// POST /v1/generate-captions
app.post('/v1/generate-captions', contentToolMiddleware, async (req, res) => {
    const { topic, tone } = req.body;
    const { uid } = res.locals.user;
    if (!topic || !tone) {
        logger.warn(`User ${uid}: Missing topic or tone for caption generation.`);
        return res
            .status(400)
            .send({ error: 'Request body must include "topic" and "tone".' });
    }
    logger.info(`User ${uid}: Generating captions for topic "${topic}" with tone "${tone}".`);
    try {
        const result = await (0, generate_captions_1.generateCaptions)({ topic, tone }); // Assumes generateCaptions is a Genkit flow
        logger.info(`User ${uid}: Captions generated successfully.`);
        return res.status(200).send(result);
    }
    catch (e) {
        logger.error(`Error in /v1/generate-captions for user ${uid}:`, e);
        return res
            .status(500)
            .send({ error: 'Failed to generate captions.', details: e.message });
    }
});
// POST /v1/find-hashtags
app.post('/v1/find-hashtags', contentToolMiddleware, async (req, res) => {
    const { topic } = req.body;
    const { uid } = res.locals.user;
    if (!topic) {
        logger.warn(`User ${uid}: Missing topic for hashtag finding.`);
        return res.status(400).send({ error: 'Request body must include "topic".' });
    }
    logger.info(`User ${uid}: Finding hashtags for topic "${topic}".`);
    try {
        const result = await (0, find_hashtags_1.findHashtags)({ topic }); // Assumes findHashtags is a Genkit flow
        logger.info(`User ${uid}: Hashtags found successfully.`);
        return res.status(200).send(result);
    }
    catch (e) {
        logger.error(`Error in /v1/find-hashtags for user ${uid}:`, e);
        return res
            .status(500)
            .send({ error: 'Failed to find hashtags.', details: e.message });
    }
});
// POST /v1/best-time-to-post
app.post('/v1/best-time-to-post', contentToolMiddleware, async (req, res) => {
    const { industry, platform } = req.body;
    const { uid } = res.locals.user;
    if (!industry || !platform) {
        logger.warn(`User ${uid}: Missing industry or platform for best time to post.`);
        return res
            .status(400)
            .send({ error: 'Request body must include "industry" and "platform".' });
    }
    logger.info(`User ${uid}: Getting best time to post for industry "${industry}" on platform "${platform}".`);
    try {
        const result = await (0, best_time_to_post_1.getBestTimeToPost)({ industry, platform }); // Assumes getBestTimeToPost is a Genkit flow
        logger.info(`User ${uid}: Best time to post retrieved successfully.`);
        return res.status(200).send(result);
    }
    catch (e) {
        logger.error(`Error in /v1/best-time-to-post for user ${uid}:`, e);
        return res
            .status(500)
            .send({ error: 'Failed to get best time to post.', details: e.message });
    }
});
// Export the Express app as an onRequest function
// Added timeoutSeconds to give AI functions more time to respond
exports.api = (0, https_1.onRequest)({ timeoutSeconds: 60 }, app);
//# sourceMappingURL=index.js.map