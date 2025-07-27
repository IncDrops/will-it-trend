
'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  try {
    // Initialize without credentials in the emulator,
    // and with default credentials in the cloud.
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.stack);
  }
}

db = admin.firestore();

export { db };
