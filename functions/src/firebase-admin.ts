<<<<<<< HEAD
// functions/src/firebase-admin.ts

=======
// firebase-admin.ts
>>>>>>> 19c9e617f3d8acb0c1c5bafa285060f66a459448
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

<<<<<<< HEAD
export { db, auth };
=======
export {db, auth};
>>>>>>> 19c9e617f3d8acb0c1c5bafa285060f66a459448
