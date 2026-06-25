import dotenv from "dotenv";
dotenv.config();

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log("Firebase config:", { ...firebaseConfig, apiKey: "REDACTED" });

(async () => {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log("Firestore initialized. Trying to read a test document 'users/test-uid'...");
    
    const docRef = doc(db, "users", "test-uid");
    const docSnap = await getDoc(docRef);
    
    console.log("Success! Document exists:", docSnap.exists());
    if (docSnap.exists()) {
      console.log("Data:", docSnap.data());
    }
  } catch (error) {
    console.error("Firestore error:", error);
  }
})();
