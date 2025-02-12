// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);