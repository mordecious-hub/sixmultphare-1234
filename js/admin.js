// ==========================================
// SixMultPhare Education
// Admin Panel
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ===============================
// CHECK ADMIN LOGIN
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User record not found.");

            window.location.href = "login.html";

            return;

        }

        const userData = userSnap.data();

        if (userData.role !== "admin") {

            alert("Access Denied!");

            window.location.href = "dashboard.html";

            return;

        }

        loadPendingInstitutions();

    } catch (error) {

        console.error(error);

    }

});

// ===============================
// LOAD PENDING INSTITUTIONS
// ===============================

async function loadPendingInstitutions() {

    try {

        const querySnapshot = await getDocs(collection(db, "institutions"));

        console.log("Institutions Found:", querySnapshot.size);

        querySnapshot.forEach((doc) => {

            console.log(doc.id, doc.data());

        });

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// LOGOUT
// ===============================

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