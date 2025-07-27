/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as express from "express";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Set global options for functions
setGlobalOptions({ maxInstances: 10 });

const app = express();

// Middleware for API Key Authentication and Rate Limiting
const authenticateAndRateLimit = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        return res.status(401).send({ error: 'API key is missing.' });
    }

    try {
        const apiKeyDocRef = db.collection('api_keys').doc(apiKey);
        const apiKeyDoc = await apiKeyDocRef.get();

        if (!apiKeyDoc.exists || !apiKeyDoc.data()?.active) {
            return res.status(403).send({ error: 'Invalid or inactive API key.' });
        }

        const keyData = apiKeyDoc.data()!;
        const { tier, request_count, last_request_timestamp } = keyData;
        
        // Define Tier Limits
        const tiers: { [key: string]: { limit: number } } = {
            'starter': { limit: 1000 },
            'pro': { limit: 10000 },
            'enterprise': { limit: Infinity }
        };

        const tierLimit = tiers[tier]?.limit;

        if (!tierLimit) {
            return res.status(403).send({ error: 'Invalid API tier.' });
        }
        
        // Check if usage is for the current month
        const now = admin.firestore.Timestamp.now();
        const currentMonth = now.toDate().getMonth();
        const lastRequestMonth = last_request_timestamp?.toDate().getMonth();

        let currentRequestCount = request_count;

        // Reset count if it's a new month
        if (lastRequestMonth !== currentMonth) {
            currentRequestCount = 0;
        }

        if (currentRequestCount >= tierLimit) {
            return res.status(429).send({ error: 'Monthly request limit exceeded. Please upgrade your plan.' });
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
            method: req.method
        });

        next();

    } catch (error) {
        logger.error("API Key Middleware Error:", error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
};

app.use(authenticateAndRateLimit);

// --- API Endpoints ---

// GET /v1/trends
app.get('/v1/trends', (req, res) => {
    // Placeholder for fetching real-time trends
    // You can apply tier-based result limiting here using res.locals.keyData
    res.status(200).send({
        message: 'Trends endpoint hit successfully.',
        data: [{ trend: '#SampleTrend', score: 95 }]
    });
});

// POST /v1/predict
app.post('/v1/predict', (req, res) => {
    // Placeholder for calling Vertex AI
     const { input } = req.body;
    if (!input) {
        return res.status(400).send({ error: 'Prediction input is missing.' });
    }
    res.status(200).send({
        message: 'Predict endpoint hit successfully.',
        prediction: {
            input: input,
            trendScore: 88,
            rationale: "AI-powered prediction based on your input."
        }
    });
});

// Export the Express app as an onRequest function
export const api = onRequest(app);
