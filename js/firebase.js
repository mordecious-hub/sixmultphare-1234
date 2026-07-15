// ==========================================
// SixMultPhare Education
// Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyB5J97fiK5F7bKhkQWZcg_KB6uOjH9Qjd8",

    authDomain: "sixmultphare.firebaseapp.com",

    projectId: "sixmultphare",

    storageBucket: "sixmultphare.firebasestorage.app",

    messagingSenderId: "1084185079245",

    appId: "1:1084185079245:web:59b5cb52ae18957a88a884",

    measurementId: "G-CR9RBQX5D9"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };