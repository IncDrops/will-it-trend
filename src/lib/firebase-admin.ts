
import * as admin from 'firebase-admin';
import 'dotenv/config';

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
    db = admin.firestore();
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Throw a more specific error to aid in debugging.
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Firebase environment variables are not set. Please check your .env file.');
    }
    throw new Error(`Firebase admin initialization error: ${error.message}`);
  }
} else {
  // If the app is already initialized, just get the firestore instance.
  db = admin.app().firestore();
}

export { db };
