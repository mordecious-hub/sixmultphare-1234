// ==========================================
// SixMultPhare Education
// Authentication
// ==========================================

import {
    auth,
    db
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ==============================
// REGISTER
// ==============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        try {

            const userCredential = await createUserWithEmailAndPassword(

                auth,

                email,

                password

            );

            await setDoc(doc(db, "users", userCredential.user.uid), {

                fullName,

                email,

                role: "student",

                createdAt: new Date().toISOString()

            });

            alert("Registration successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);

        }

    });

}

// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        try {

            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);

        }

    });

}