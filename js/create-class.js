// ==========================================
// SixMultPhare Education
// Create Class
// ==========================================

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const form = document.getElementById("createClassForm");

let currentUser = null;

// Check Login
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

});

// Create Class
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const grade = document.getElementById("grade").value;

    const className = document.getElementById("className").value;

    const academicYear = document.getElementById("academicYear").value;

    try {

        await addDoc(collection(db, "classes"), {

            institutionId: currentUser.uid,

            grade: grade,

            className: className,

            academicYear: academicYear,

            createdAt: serverTimestamp()

        });

        alert("Class created successfully.");

        form.reset();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});