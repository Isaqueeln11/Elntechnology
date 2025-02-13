import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBaZtOQKvqaTYcknbtPzOWXcWVZx3AlSLQ',
  authDomain: 'elntechnology.firebaseapp.com',
  projectId: 'elntechnology',
  storageBucket: 'elntechnology.firebasestorage.app',
  messagingSenderId: '820255894849',
  appId: '1:820255894849:web:d70969902c700ab4ac05c0',
  measurementId: 'G-915QE2WGW8',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
