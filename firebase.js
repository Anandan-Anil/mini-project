import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRDHTacwD1JM_cBXdrqsEoKAZQf8XfVDM",
  authDomain: "mini-project-c2395.firebaseapp.com",
  projectId: "mini-project-c2395",
  storageBucket: "mini-project-c2395.appspot.com", // Firebase Storage Bucket
  messagingSenderId: "71236178440",
  appId: "1:71236178440:web:f493465b7a575a3eb7b7bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);       // Firestore Database
const auth = getAuth(app);          // Firebase Authentication
const storage = getStorage(app);    // Firebase Storage

export { auth, db, storage };
