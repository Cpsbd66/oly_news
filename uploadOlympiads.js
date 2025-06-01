import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, where, addDoc, query } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const olympiadData = JSON.parse(fs.readFileSync("./olympiad.json", "utf-8"));

const uploadData = async () => {
  for (const entry of olympiadData) {
    try {
      const q = query(
        collection(db, "olympiads"),
        where("name", "==", entry.name)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log("Skipped duplicate:", entry.name);
        continue;
      }

      await addDoc(collection(db, "olympiads"), entry);
      console.log("Uploaded:", entry.name);
    } catch (err) {
      console.error("Error uploading", entry.name, err);
    }
  }
};

uploadData();
