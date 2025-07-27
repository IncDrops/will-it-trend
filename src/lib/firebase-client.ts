
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace this with your actual Firebase config from the Firebase console
const firebaseConfig = {
  "apiKey": "AIzaSyAhHU9N7V5sIy3hFbiaNs7iaicibDp_WIE",
  "authDomain": "launch16304.firebaseapp.com",
  "projectId": "launch16304launch16304.firebasestorage.app",
  "storageBucket": "launch16304.firebasestorage.app",
  "messagingSenderId": "451925187787",
  "appId": "1:451925187787:web:70e0acb65cba356f8fcf4e",
  "measurementId": ""
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth

