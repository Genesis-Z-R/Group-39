// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdE0DrlPCp1kLEbmwOo-xYe5k2WNAGph8",
  authDomain: "vesterapp-46245.firebaseapp.com",
  projectId: "vesterapp-46245",
  storageBucket: "vesterapp-46245.firebasestorage.app",
  messagingSenderId: "157448495564",
  appId: "1:157448495564:web:37f4e52418f1f9d71cbd69",
  measurementId: "G-ME6ZSFDF5Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
