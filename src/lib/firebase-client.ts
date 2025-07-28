
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: To connect to your own Firebase backend,
// replace the values in this object with the configuration
// from your Firebase project's settings.
const firebaseConfig = {
  // Go to your Firebase project's settings.
  // Under the "General" tab, find the "Your apps" card.
  // In the "SDK setup and configuration" section, select "Config".
  // Copy the values from there and paste them here.
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_APP_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "measurementId": "YOUR_MEASUREMENT_ID",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth
