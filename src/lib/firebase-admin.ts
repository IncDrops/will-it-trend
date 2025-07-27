// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.stack);
      // We re-throw the error to make it clear that initialization failed.
      throw new Error(`Firebase admin initialization error: ${error.message}`);
    }
  }
  return admin;
}

// Export a function that returns the firestore instance
export function getFirestoreInstance() {
  const adminInstance = initializeFirebaseAdmin();
  return adminInstance.firestore();
}
