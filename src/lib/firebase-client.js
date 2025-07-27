import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Web app config (different from admin config!)
const firebaseConfig = {
    apiKey: "AIzaSyCku4ln9Wsd0sSLftcXR_XIAytB6n9bAeE",
    authDomain: "second-opinion-2l8nk.firebaseapp.com",
    projectId: "second-opinion-2l8nk",
    storageBucket: "second-opinion-2l8nk.firebasestorage.app",
    messagingSenderId: "616547980506",
    appId: "1:616547980506:web:1a345f2408ff1c036a41e3"
  };

// Initialize once
const app = initializeApp(firebaseConfig);
export const dbClient = getFirestore(app); // For frontend use