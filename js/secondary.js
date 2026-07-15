// ==========================================
// SixMultPhare Education
// Secondary Schools
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const institutionList = document.getElementById("institutionList");

// Load approved secondary schools
async function loadSchools() {

    try {

        const q = query(
            collection(db, "institutions"),
            where("type", "==", "Secondary School"),
            where("status", "==", "Approved")
        );

        const snapshot = await getDocs(q);

        institutionList.innerHTML = "";

        if (snapshot.empty) {

            institutionList.innerHTML = `
                <div class="dashboard-card">
                    <ion-icon name="school-outline"></ion-icon>
                    <h2>No Schools Found</h2>
                    <p>No approved secondary schools are available yet.</p>
                </div>
            `;

            return;
        }

        snapshot.forEach((document) => {

            const school = document.data();

            institutionList.innerHTML += `

                <div class="dashboard-card">

                    <ion-icon name="school-outline"></ion-icon>

                    <h2>${school.institutionName}</h2>

                    <p><strong>District:</strong> ${school.district}</p>

                    <p><strong>Province:</strong> ${school.province}</p>

                    <button class="btn"
                        onclick="location.href='grades.html?school=${document.id}'">

                        Open School

                    </button>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        institutionList.innerHTML = `
            <div class="dashboard-card">
                <ion-icon name="warning-outline"></ion-icon>
                <h2>Error</h2>
                <p>Failed to load schools.</p>
            </div>
        `;

    }

}

loadSchools();