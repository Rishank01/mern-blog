// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-a3b3e.firebaseapp.com",
  projectId: "mern-blog-a3b3e",
  storageBucket: "mern-blog-a3b3e.appspot.com",
  messagingSenderId: "584386375961",
  appId: "1:584386375961:web:5082e7495238c5d43e9588"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);