
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-5f87b.firebaseapp.com",
  projectId: "chatapp-5f87b",
  storageBucket: "chatapp-5f87b.appspot.com",
  messagingSenderId: "340971683535",
  appId: "1:340971683535:web:3e5a4cad2d3f86faa541ba",
  measurementId: "G-BDY7SQDS81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()