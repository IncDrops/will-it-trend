'use server';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCreditsToUser = addCreditsToUser;
const firebase_admin_1 = require("../firebase-admin");
const logger = __importStar(require("firebase-functions/logger"));
const firestore_1 = require("firebase-admin/firestore");
const creditsMap = {
    price_1RpMQpHK4G9ZDA0F4OJxhrD6: 100, // Starter Pack
    price_1RpMgKHK4G9ZDA0FawwsKgsK: 500, // Pro AI Pack
};
/**
 * Adds AI credits to a user's account in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {string} priceId - The Stripe price ID of the purchased product.
 */
async function addCreditsToUser(userId, priceId) {
    if (!userId || !priceId) {
        logger.error('User ID or Price ID is missing.', { userId, priceId });
        return { success: false, error: 'User ID or Price ID is missing.' };
    }
    const creditsToAdd = creditsMap[priceId];
    if (!creditsToAdd) {
        logger.warn(`No credits configured for priceId: ${priceId}`);
        return {
            success: false,
            error: `No credits configured for priceId: ${priceId}`,
        };
    }
    const userRef = firebase_admin_1.db.collection('users').doc(userId);
    try {
        await firebase_admin_1.db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                // If user doesn't exist, create them
                transaction.set(userRef, {
                    ai_credits: creditsToAdd,
                    createdAt: firestore_1.FieldValue.serverTimestamp(),
                });
                logger.info(`New user document created for ${userId} with ${creditsToAdd} credits.`);
            }
            else {
                // If user exists, increment their credits
                transaction.update(userRef, {
                    ai_credits: firestore_1.FieldValue.increment(creditsToAdd),
                });
                const currentCredits = userDoc.data()?.ai_credits || 0;
                logger.info(`Added ${creditsToAdd} credits to user ${userId}. New balance: ${currentCredits + creditsToAdd}`);
            }
        });
        return { success: true };
    }
    catch (error) {
        logger.error(`Failed to add credits to user ${userId}:`, error);
        return { success: false, error: `Transaction failed: ${error}` };
    }
}
//# sourceMappingURL=users.js.map