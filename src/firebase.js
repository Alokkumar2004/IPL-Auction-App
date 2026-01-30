// firebase.js — optional helper
// Replace with your config and then export initialized services.
// This file is a stub; do not include credentials in public repos.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// add your config here:
const firebaseConfig = {
    apiKey: "AIzaSyB81MOk5f1MaGvOre7f9Yq5gBBPHsNfuUg",
  authDomain: "player-auction-f59d6.firebaseapp.com",
  projectId: "player-auction-f59d6",
  storageBucket: "player-auction-f59d6.firebasestorage.app",
  messagingSenderId: "5208862966",
  appId: "1:5208862966:web:ba9180e9fe17e2b6fd3cd7",
  measurementId: "G-J6J35ZH64N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);