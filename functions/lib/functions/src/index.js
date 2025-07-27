"use strict";
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.db = void 0;
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv/config"); // Make sure this is at the top
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const express = __importStar(require("express"));
const api_predict_1 = require("../../src/ai/flows/api-predict");
const generate_captions_1 = require("../../src/ai/flows/generate-captions");
const find_hashtags_1 = require("../../src/ai/flows/find-hashtags");
const best_time_to_post_1 = require("../../src/ai/flows/best-time-to-post");
const crypto = __importStar(require("crypto"));
const stripe_1 = __importDefault(require("stripe"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }
    catch (error) {
        console.error('Firebase admin initialization error:', error.stack);
    }
}
exports.db = admin.firestore();
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});
// Set global options for functions
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
const app = express();
app.use(express.json());
// Middleware for API Key Authentication and Rate Limiting
const authenticateAndRateLimit = async (req, res, next) => {
    var _a, _b;
    // bypass auth for checkout creation
    if (req.path.startsWith('/v1/create-checkout-session')) {
        return next();
    }
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).send({ error: 'API key is missing.' });
    }
    try {
        const apiKeyDocRef = exports.db.collection('api_keys').doc(apiKey);
        const apiKeyDoc = await apiKeyDocRef.get();
        if (!apiKeyDoc.exists || !((_a = apiKeyDoc.data()) === null || _a === void 0 ? void 0 : _a.active)) {
            return res.status(403).send({ error: 'Invalid or inactive API key.' });
        }
        const keyData = apiKeyDoc.data();
        const { tier, request_count = 0, last_request_timestamp } = keyData;
        // Define Tier Limits (requests per hour)
        const tiers = {
            'starter': { limit: 10 },
            'pro': { limit: 100 },
            'enterprise': { limit: Infinity }
        };
        const tierLimit = (_b = tiers[tier]) === null || _b === void 0 ? void 0 : _b.limit;
        if (!tierLimit) {
            return res.status(403).send({ error: 'Invalid API tier.' });
        }
        // Check if usage is for the current hour
        const now = new Date();
        const isNewHour = last_request_timestamp ? now.getTime() - last_request_timestamp.toDate().getTime() > 3600 * 1000 : true;
        let currentRequestCount = request_count;
        // Reset count if it's a new hour
        if (isNewHour) {
            currentRequestCount = 0;
        }
        if (currentRequestCount >= tierLimit) {
            return res.status(429).send({ error: 'Hourly request limit exceeded. Please upgrade your plan.' });
        }
        // Log the request and update the count
        const newCount = currentRequestCount + 1;
        await apiKeyDocRef.update({
            request_count: newCount,
            last_request_timestamp: now
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
        next();
    }
    catch (error) {
        logger.error("API Key Middleware Error:", error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
};
app.use(authenticateAndRateLimit);
// --- API Endpoints ---
// POST /v1/create-checkout-session
app.post('/v1/create-checkout-session', async (req, res) => {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) {
        return res.status(400).send({ error: 'Price ID is missing.' });
    }
    if (!successUrl || !cancelUrl) {
        return res.status(400).send({ error: 'Success and cancel URLs are required.' });
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        res.status(200).send({ sessionId: session.id, url: session.url });
    }
    catch (e) {
        logger.error('Stripe checkout session error:', e);
        res.status(500).send({ error: 'Failed to create checkout session.', details: e.message });
    }
});
// GET /v1/trends
app.get('/v1/trends', (req, res) => {
    // Placeholder for fetching real-time trends
    // You can apply tier-based result limiting here using res.locals.keyData
    const tier = res.locals.keyData.tier;
    let limit = 10; // Default for starter
    if (tier === 'pro')
        limit = 50;
    if (tier === 'enterprise')
        limit = 100; // Or some other high number
    res.status(200).send({
        message: 'Trends endpoint hit successfully.',
        data: [{ trend: '#SampleTrend', score: 95 }].slice(0, limit)
    });
});
// POST /v1/predict
app.post('/v1/predict', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).send({ error: 'Prediction "topic" is missing.' });
    }
    const cacheKey = crypto.createHash('md5').update(topic).digest('hex');
    const cacheRef = exports.db.collection('predictions_cache').doc(cacheKey);
    try {
        // Check cache first
        const cachedDoc = await cacheRef.get();
        if (cachedDoc.exists) {
            const data = cachedDoc.data();
            const now = new Date().getTime();
            const cacheTime = data === null || data === void 0 ? void 0 : data.timestamp.toDate().getTime();
            // Cache valid for 1 hour
            if (now - cacheTime < 3600 * 1000) {
                logger.info(`Returning cached result for topic: ${topic}`);
                return res.status(200).send({
                    message: 'Prediction successful from cache.',
                    prediction: data === null || data === void 0 ? void 0 : data.prediction
                });
            }
        }
        // If not in cache or expired, call AI
        logger.info(`Calling AI for topic: ${topic}`);
        const prediction = await (0, api_predict_1.apiPredict)({ topic });
        // Save to cache
        await cacheRef.set({
            prediction,
            timestamp: new Date()
        });
        res.status(200).send({
            message: 'Predict endpoint hit successfully.',
            prediction
        });
    }
    catch (e) {
        logger.error('Error in /v1/predict:', e);
        res.status(500).send({ error: 'Failed to get prediction from AI.', details: e.message });
    }
});
// POST /v1/generate-captions
app.post('/v1/generate-captions', async (req, res) => {
    const { topic, tone } = req.body;
    if (!topic || !tone) {
        return res.status(400).send({ error: 'Request body must include "topic" and "tone".' });
    }
    try {
        const result = await (0, generate_captions_1.generateCaptions)({ topic, tone });
        res.status(200).send(result);
    }
    catch (e) {
        logger.error('Error in /v1/generate-captions:', e);
        res.status(500).send({ error: 'Failed to generate captions.', details: e.message });
    }
});
// POST /v1/find-hashtags
app.post('/v1/find-hashtags', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).send({ error: 'Request body must include "topic".' });
    }
    try {
        const result = await (0, find_hashtags_1.findHashtags)({ topic });
        res.status(200).send(result);
    }
    catch (e) {
        logger.error('Error in /v1/find-hashtags:', e);
        res.status(500).send({ error: 'Failed to find hashtags.', details: e.message });
    }
});
// POST /v1/best-time-to-post
app.post('/v1/best-time-to-post', async (req, res) => {
    const { industry, platform } = req.body;
    if (!industry || !platform) {
        return res.status(400).send({ error: 'Request body must include "industry" and "platform".' });
    }
    try {
        const result = await (0, best_time_to_post_1.getBestTimeToPost)({ industry, platform });
        res.status(200).send(result);
    }
    catch (e) {
        logger.error('Error in /v1/best-time-to-post:', e);
        res.status(500).send({ error: 'Failed to get best time to post.', details: e.message });
    }
});
// Export the Express app as an onRequest function
exports.api = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map