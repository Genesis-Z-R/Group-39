import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }; 