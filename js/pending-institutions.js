// ==========================================
// SixMultPhare Education
// Pending Institutions
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ==========================================
// CHECK LOGIN
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    loadPendingInstitutions();

});

// ==========================================
// LOAD PENDING INSTITUTIONS
// ==========================================

async function loadPendingInstitutions() {

    const institutionList = document.getElementById("institutionList");

    institutionList.innerHTML = "";

    const q = query(

        collection(db, "institutions"),

        where("status", "==", "Pending")

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        institutionList.innerHTML = `

        <div class="dashboard-card">

            <ion-icon name="checkmark-circle-outline"></ion-icon>

            <h2>No Pending Institutions</h2>

            <p>Everything is approved.</p>

        </div>

        `;

        return;

    }

    snapshot.forEach((document) => {

        const data = document.data();

        institutionList.innerHTML += `

        <div class="dashboard-card">

            <ion-icon name="school-outline"></ion-icon>

            <h2>${data.institutionName}</h2>

            <p><strong>Type:</strong> ${data.type}</p>

            <p><strong>Email:</strong> ${data.email}</p>

            <p><strong>District:</strong> ${data.district}</p>

            <br>

            <button class="btn approveBtn"
            data-id="${document.id}">

                Approve

            </button>

            <br><br>

            <button class="btn rejectBtn"
            data-id="${document.id}">

                Reject

            </button>

        </div>

        `;

    });

    addButtonEvents();

}

// ==========================================
// APPROVE
// ==========================================

function addButtonEvents() {

    document.querySelectorAll(".approveBtn").forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            await updateDoc(doc(db, "institutions", id), {

                status: "Approved"

            });

            alert("Institution Approved");

            loadPendingInstitutions();

        });

    });

    document.querySelectorAll(".rejectBtn").forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            if (confirm("Reject this institution?")) {

                await deleteDoc(doc(db, "institutions", id));

                alert("Institution Rejected");

                loadPendingInstitutions();

            }

        });

    });

}

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        await signOut(auth);

        window.location.href = "login.html";

    });

}