import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDWBulE-srC3cJcQ50IaISMAZEISh8MmeU",
  authDomain: "loan-balance-app.firebaseapp.com",
  projectId: "loan-balance-app",
  storageBucket: "loan-balance-app.firebasestorage.app",
  messagingSenderId: "1061180274954",
  appId: "1:1061180274954:web:fb7fa0aa5b98acfb1222f3"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);