
'use server';

import * as admin from 'firebase-admin';

// This file is intended for use within Firebase Functions, 
// where the environment is already configured.

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

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
auth = admin.auth();

export function getDb() {
    if (!db) {
        // This case should ideally not be hit in a standard Functions environment
        console.error("Firestore is not initialized. Re-initializing...");
        admin.initializeApp();
        db = admin.firestore();
    }
    return db;
}

export function getAuth() {
    if (!auth) {
        console.error("Auth is not initialized. Re-initializing...");
        admin.initializeApp();
        auth = admin.auth();
    }
    return auth;
}
