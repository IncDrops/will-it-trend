
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace this with your actual Firebase config from the Firebase console
const firebaseConfig = {
  "apiKey": "AIzaSyDN4rO3FpQGqJAEfrQdYr3T4fAd1FpDFoM",
  "authDomain": "will-it-trend16.firebaseapp.com",
  "projectId": "will-it-trend16",
  "storageBucket": "will-it-trend16.appspot.com",
  "messagingSenderId": "1002442340537",
  "appId": "1:1002442340537:web:f8373a6a4c2813c909c259",
  "measurementId": "G-5Z3B6E8X6E"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth

