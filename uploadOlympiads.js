import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, where, addDoc, query } from "firebase/firestore";
import fs from "fs";

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
