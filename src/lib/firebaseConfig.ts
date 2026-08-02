// Firebase configuration - Client side only
// This file must only be imported in client components

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase only on client side
let firebaseApp: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (typeof window !== "undefined") {
  // Check if all required Firebase env vars are present
  const hasFirebaseConfig = 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (hasFirebaseConfig) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    try {
      firebaseApp = initializeApp(firebaseConfig);
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
      googleProvider = new GoogleAuthProvider();
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  } else {
    console.warn("Firebase configuration missing. Using mock auth for development.");
    // Create mock auth object to prevent crashes
    auth = {
      onAuthStateChanged: (callback: any) => {
        // Immediately call callback with null user and return unsubscribe function
        callback(null);
        return () => {};
      },
      signInWithPopup: async () => ({ user: null }),
      signOut: async () => {},
    };
    db = {};
    googleProvider = {};
  }
}

export { auth, db, googleProvider };
// Force redeploy
