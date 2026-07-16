// ==========================================
// SixMultPhare Education
// Create Fee Structure
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const feeStructureForm = document.getElementById("feeStructureForm");
const gradeSelect = document.getElementById("grade");

// Load Grades
async function loadGrades() {

    try {

        const q = query(
            collection(db, "grades"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        gradeSelect.innerHTML = `
            <option value="">Select Grade</option>
        `;

        snapshot.forEach((doc) => {

            const grade = doc.data();

            gradeSelect.innerHTML += `
                <option value="${grade.gradeName}">
                    ${grade.gradeName}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// Save Fee Structure
feeStructureForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const feeCategory = document.getElementById("feeCategory").value;
    const academicYear = document.getElementById("academicYear").value;
    const amount = Number(document.getElementById("amount").value);

    try {

        // Check for duplicate
        const duplicateQuery = query(
            collection(db, "feeStructures"),
            where("institutionId", "==", auth.currentUser.uid),
            where("grade", "==", gradeSelect.value),
            where("feeCategory", "==", feeCategory),
            where("academicYear", "==", academicYear)
        );

        const duplicateSnapshot = await getDocs(duplicateQuery);

        if (!duplicateSnapshot.empty) {

            alert("This fee structure already exists.");

            return;

        }

        await addDoc(collection(db, "feeStructures"), {

            institutionId: auth.currentUser.uid,

            feeCategory,

            grade: gradeSelect.value,

            academicYear,

            amount,

            createdAt: serverTimestamp()

        });

        alert("Fee structure created successfully.");

        feeStructureForm.reset();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

loadGrades();