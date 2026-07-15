// ==========================================
// SixMultPhare Education
// Institution Registration
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const institutionForm = document.getElementById("institutionForm");

if (institutionForm) {

    institutionForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const institutionName = document.getElementById("institutionName").value.trim();

        const email = document.getElementById("email").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const type = document.getElementById("type").value;

        const country = document.getElementById("country").value.trim();

        const province = document.getElementById("province").value.trim();

        const district = document.getElementById("district").value.trim();

        try {

            await addDoc(collection(db, "institutions"), {

                institutionName,

                email,

                phone,

                type,

                country,

                province,

                district,

                status: "Pending",

                createdAt: serverTimestamp()

            });

            alert("Institution submitted successfully. Waiting for approval.");

            institutionForm.reset();

        } catch (error) {

            console.error(error);

            alert("Registration failed: " + error.message);

        }

    });

}