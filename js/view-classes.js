// ==========================================
// SixMultPhare Education
// View Classes
// ==========================================

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const classList = document.getElementById("classList");

// Load institution classes
onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    try {

        const q = query(
            collection(db, "classes"),
            where("institutionId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        classList.innerHTML = "";

        if (snapshot.empty) {

            classList.innerHTML = `
                <div class="dashboard-card">
                    <ion-icon name="school-outline"></ion-icon>
                    <h2>No Classes Found</h2>
                    <p>Create your first class.</p>
                </div>
            `;

            return;

        }

        snapshot.forEach((doc) => {

            const data = doc.data();

            classList.innerHTML += `

                <div class="dashboard-card">

                    <ion-icon name="school-outline"></ion-icon>

                    <h2>${data.className}</h2>

                    <p><strong>Grade:</strong> ${data.grade}</p>

                    <p><strong>Academic Year:</strong> ${data.academicYear}</p>

                    <a href="assign-teacher.html?class=${doc.id}" class="btn">
                        Assign Teacher
                    </a>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        classList.innerHTML = `
            <div class="dashboard-card">
                <ion-icon name="warning-outline"></ion-icon>
                <h2>Error</h2>
                <p>Unable to load classes.</p>
            </div>
        `;

    }

});