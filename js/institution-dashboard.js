// ==========================================
// SixMultPhare Education
// Institution Dashboard
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ==========================================
// CHECK LOGIN
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User account not found.");

            window.location.href = "login.html";
            return;

        }

        const userData = userSnap.data();

        // Only institutions can access
        if (userData.role !== "institution") {

            alert("Access denied.");

            window.location.href = "dashboard.html";
            return;

        }

        console.log("Institution:", userData);

        // Update dashboard title if available
        const title = document.querySelector(".dashboard h1");

        if (title && userData.institutionName) {

            title.textContent = userData.institutionName;

        }

    } catch (error) {

        console.error(error);
        alert(error.message);

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

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}