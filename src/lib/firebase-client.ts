
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: This is the corrected Firebase config for your project.
const firebaseConfig = {
  "projectId": "trendcast-ai-65ycx",
  "appId": "1:716031577191:web:fbc52a62a18a3c224e18c2",
  "storageBucket": "trendcast-ai-65ycx.firebasestorage.app",
  "apiKey": "AIzaSyBdIPIJmkK3SFfgZq6j1A7eeCW0CnrMrIQ",
  "authDomain": "trendcast-ai-65ycx.firebaseapp.com",
  "measurementId": "G-L5E14Y852K",
  "messagingSenderId": "716031577191"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth
