import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrSCYquCd_ib9-Jh8FkgTcPqved2ueKxI",
  authDomain: "eln-technology-b354d.firebaseapp.com",
  projectId: "eln-technology-b354d",
  storageBucket: "eln-technology-b354d.firebasestorage.app",
  messagingSenderId: "297345406057",
  appId: "1:297345406057:web:0d132589a527be1f743ef8",
  measurementId: "G-RE8KDD6LSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };