import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7Ld7a8hZ4BgxzctWFstjBoQgv-U0zIFU",
  authDomain: "olynews-447a3.firebaseapp.com",
  projectId: "olynews-447a3",
  storageBucket: "olynews-447a3.firebasestorage.app",
  messagingSenderId: "1020630728766",
  appId: "1:1020630728766:web:914ccf8aef6149380ad16f",
  measurementId: "G-CXBB4ML1M9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db };