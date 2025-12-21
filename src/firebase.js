import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrcnPr3WFeWqqVH9KhnFKZq3ZdqpqJ1xo",
  authDomain: "digi-mobile-repair-56765-e8cd9.firebaseapp.com",
  projectId: "digi-mobile-repair-56765-e8cd9",
  storageBucket: "digi-mobile-repair-56765-e8cd9.firebasestorage.app",
  messagingSenderId: "1015897186342",
  appId: "1:1015897186342:web:292fb64e0b4187d6abc6e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
