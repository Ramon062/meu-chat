import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRB7lMANOqAAv2RutbLtU0eKvvVO3cTG0",
  authDomain: "chat-firebase-testee.firebaseapp.com",
  projectId: "chat-firebase-testee",
  storageBucket: "chat-firebase-testee.firebasestorage.app",
  messagingSenderId: "547942218476",
  appId: "1:547942218476:web:0dea154591722d5e3903c9",
  measurementId: "G-QKS0LVHZXD"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

export const auth = getAuth(app);
export { db };
