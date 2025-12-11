// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcNsHMsgFJZw6rJbSWh7IvIK5ew9r5VeE",
  authDomain: "complaint-sys-6b305.firebaseapp.com",
  projectId: "complaint-sys-6b305",
  storageBucket: "complaint-sys-6b305.firebasestorage.app",
  messagingSenderId: "861944235522",
  appId: "1:861944235522:web:5d194a829743de6c49091b",
  measurementId: "G-5GNYR09X4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export default db;