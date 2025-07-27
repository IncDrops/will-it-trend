
'use server';

import { getDb } from '../firebase-admin';
import * as logger from 'firebase-functions/logger';

const creditsMap: { [key: string]: number } = {
  price_1RpMQpHK4G9ZDA0F4OJxhrD6: 50, // Starter Pack
  price_1RpMgKHK4G9ZDA0FawwsKgsK: 500, // Pro AI Pack
};

/**
 * Adds AI credits to a user's account in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {string} priceId - The Stripe price ID of the purchased product.
 */
export async function addCreditsToUser(userId: string, priceId: string): Promise<{success: boolean, error?: string}> {
  if (!userId || !priceId) {
    logger.error('User ID or Price ID is missing.', { userId, priceId });
    return { success: false, error: 'User ID or Price ID is missing.' };
  }
  
  const creditsToAdd = creditsMap[priceId];
  if (!creditsToAdd) {
    logger.warn(`No credits configured for priceId: ${priceId}`);
    return { success: false, error: `No credits configured for priceId: ${priceId}`};
  }

  const db = getDb();
  const userRef = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        // If user doesn't exist, create them
        transaction.set(userRef, {
          ai_credits: creditsToAdd,
          createdAt: new Date(),
        });
        logger.info(`New user document created for ${userId} with ${creditsToAdd} credits.`);
      } else {
        // If user exists, increment their credits
        const currentCredits = userDoc.data()?.ai_credits || 0;
        transaction.update(userRef, {
          ai_credits: currentCredits + creditsToAdd,
        });
         logger.info(`Added ${creditsToAdd} credits to user ${userId}. New balance: ${currentCredits + creditsToAdd}`);
      }
    });
    return { success: true };
  } catch (error) {
    logger.error(`Failed to add credits to user ${userId}:`, error);
    return { success: false, error: `Transaction failed: ${error}`};
  }
}
