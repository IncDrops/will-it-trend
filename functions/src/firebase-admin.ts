
'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.stack);
  }
}

db = admin.firestore();

export { db };
