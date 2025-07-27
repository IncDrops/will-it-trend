
'use server';

import * as admin from 'firebase-admin';
import 'dotenv/config';

let db: admin.firestore.Firestore;

function getDb() {
  if (db) {
    return db;
  }

  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } catch (error: any) {
       if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Firebase environment variables are not set. Please check your .env file.');
       }
       throw new Error(`Firebase admin initialization error: ${error.message}`);
    }
  }
  
  db = admin.firestore();
  return db;
}


export { getDb };
