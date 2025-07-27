
'use server';

import * as admin from 'firebase-admin';
import 'dotenv/config';

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        console.warn('Firebase admin environment variables are not set. Skipping admin initialization. This is expected for client-side rendering.');
        return;
       }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
       console.error(`Firebase admin initialization error: ${error.message}`);
       throw error;
    }
  }
  
  db = admin.firestore();
  auth = admin.auth();
}

initializeFirebaseAdmin();


function getDb() {
  if (!db) {
    console.warn("Firestore is not initialized. Make sure admin credentials are set for backend operations.");
  }
  return db;
}

function getAuth() {
  if (!auth) {
    console.warn("Firebase Auth is not initialized. Make sure admin credentials are set for backend operations.");
  }
  return auth;
}


export { getDb, getAuth };
