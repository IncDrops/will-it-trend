
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: This is the corrected Firebase config for your project.
const firebaseConfig = {
  "apiKey": "AIzaSyB-...",
  "authDomain": "will-it-trend16.firebaseapp.com",
  "projectId": "will-it-trend16",
  "storageBucket": "will-it-trend16.appspot.com",
  "messagingSenderId": "1016836814476",
  "appId": "1:1016836814476:web:15e5c26b7f9a2b53a4e9b9",
  "measurementId": "G-L5E14Y852K"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth
