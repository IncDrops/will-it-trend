
'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace this with your actual Firebase config from the Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyCku4ln9Wsd0sSLftcXR_XIAytB6n9bAeE",
    authDomain: "second-opinion-2l8nk.firebaseapp.com",
    projectId: "second-opinion-2l8nk",
    storageBucket: "second-opinion-2l8nk.firebasestorage.app",
    messagingSenderId: "616547980506",
    appId: "1:616547980506:web:1a345f2408ff1c036a41e3"
  };

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use
export const auth = getAuth(app); // For client-side auth
