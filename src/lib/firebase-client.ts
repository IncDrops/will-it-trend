
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: To connect to your own Firebase backend,
// replace the values in this object with the configuration
// from your Firebase project's settings.
const firebaseConfig = {
  apiKey: "AIzaSyAhHU9N7V5sIy3hFbiaNs7iaicibDp_WIE",
  authDomain: "launch16304.firebaseapp.com",
  projectId: "launch16304",
  storageBucket: "launch16304.firebasestorage.app",
  messagingSenderId: "451925187787",
  appId: "1:451925187787:web:70e0acb65cba356f8fcf4e"
};
// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth
