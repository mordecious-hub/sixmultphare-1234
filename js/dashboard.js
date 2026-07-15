// ==========================================
// SixMultPhare Education
// Dashboard
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ==========================================
// CHECK LOGIN
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();

            const title = document.querySelector(".dashboard h1");

            if (title) {

                title.textContent = `Welcome, ${data.fullName}`;

            }

        }

    } catch (error) {

        console.error(error);

    }

});

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        try {

            await signOut(auth);

            alert("Logged out successfully.");

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}