import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT3opF2KF8hlUIKAK3hwVi4bi6fwy6H8E",
  authDomain: "rokate-catering.firebaseapp.com",
  projectId: "rokate-catering",
  storageBucket: "rokate-catering.firebasestorage.app",
  messagingSenderId: "442513361721",
  appId: "1:442513361721:web:b8528280b87ab929f0b6e8",
  measurementId: "G-RQ23CJ7VXM",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
