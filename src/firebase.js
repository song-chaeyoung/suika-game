import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCekMCVmNYCMSACIL6AmCr8QfERrBm6NVY",
  authDomain: "gamedb-ee2c0.firebaseapp.com",
  projectId: "gamedb-ee2c0",
  storageBucket: "gamedb-ee2c0.firebasestorage.app",
  messagingSenderId: "335542640038",
  appId: "1:335542640038:web:15eb218c74063a4a2e8367",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
