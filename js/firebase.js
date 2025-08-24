import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfUNJg_WdGXuUGLEoFFu2c49nAmfex3b4",
  authDomain: "surveyflow-nps-saas.firebaseapp.com",
  projectId: "surveyflow-nps-saas",
  storageBucket: "surveyflow-nps-saas.firebasestorage.app",
  messagingSenderId: "151787390698",
  appId: "1:151787390698:web:cadb338008f4ea36cbf993",
  measurementId: "G-1PS843NGGE"
  // Add other config values as needed
};

const app = initializeApp(firebaseConfig);


// Initialize Firebase Auth and Firestore and export
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
