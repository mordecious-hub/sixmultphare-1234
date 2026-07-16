// ==========================================
// SixMultPhare Education
// Create Examination
// ==========================================

import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const examForm = document.getElementById("examForm");

examForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const institutionId = auth.currentUser.uid;

        const examRef = doc(collection(db, "examinations"));

        await setDoc(examRef, {

            examId: examRef.id,

            institutionId: institutionId,

            examName: document.getElementById("examName").value,

            subject: document.getElementById("subject").value,

            grade: document.getElementById("grade").value,

            assignedClass: document.getElementById("assignedClass").value,

            term: document.getElementById("term").value,

            year: document.getElementById("year").value,

            examDate: document.getElementById("examDate").value,

            totalMarks: Number(document.getElementById("totalMarks").value),

            status: "Active",

            createdAt: serverTimestamp()

        });

        alert("Examination created successfully.");

        examForm.reset();

        window.location.href = "enter-results.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});