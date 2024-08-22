

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRDHTacwD1JM_cBXdrqsEoKAZQf8XfVDM",
  authDomain: "mini-project-c2395.firebaseapp.com",
  projectId: "mini-project-c2395",
  storageBucket: "mini-project-c2395.appspot.com",
  messagingSenderId: "71236178440",
  appId: "1:71236178440:web:f493465b7a575a3eb7b7bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export { auth,db };
