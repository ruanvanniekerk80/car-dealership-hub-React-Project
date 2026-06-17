import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZKYHzc4aXmKIy1KRCdfO7Ls4rNH5ZzFE",
  authDomain: "cardealership-76d00.firebaseapp.com",
  projectId: "cardealership-76d00",
  storageBucket: "cardealership-76d00.firebasestorage.app",
  messagingSenderId: "1026367200892",
  appId: "1:1026367200892:web:928d19ae75442ef466f3f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👇 MAKE SURE THIS EXACT LINE IS PRESENT AND HAS THE "export" KEYWORD
export const db = getFirestore(app);

// 👇 Ensure storage is also exported for when we upload images later
export const storage = getStorage(app);