// ==========================================
// SixMultPhare Education
// Assign Fees
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

const gradeSelect = document.getElementById("grade");
const feeCategory = document.getElementById("feeCategory");
const academicYear = document.getElementById("academicYear");
const loadStudentsBtn = document.getElementById("loadStudentsBtn");
const studentsContainer = document.getElementById("studentsContainer");
const assignFeesForm = document.getElementById("assignFeesForm");

// Load Grades
async function loadGrades() {

    const q = query(
        collection(db, "grades"),
        where("institutionId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const grade = doc.data();

        gradeSelect.innerHTML += `
            <option value="${grade.gradeName}">
                ${grade.gradeName}
            </option>
        `;

    });

}

// Load Students
loadStudentsBtn.addEventListener("click", async () => {

    studentsContainer.innerHTML = "";

    if (!gradeSelect.value) {

        alert("Select a grade.");

        return;

    }

    const q = query(
        collection(db, "students"),
        where("institutionId", "==", auth.currentUser.uid),
        where("grade", "==", gradeSelect.value)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        studentsContainer.innerHTML = "<p>No students found.</p>";

        return;

    }

    snapshot.forEach((student) => {

        const data = student.data();

        studentsContainer.innerHTML += `

        <div class="student-row">

            <input
                type="checkbox"
                class="studentCheck"
                value="${student.id}">

            <span class="student-name">

                ${data.fullName}

            </span>

        </div>

        `;

    });

});

// Assign Fees
assignFeesForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const feeQuery = query(
        collection(db, "feeStructures"),
        where("institutionId", "==", auth.currentUser.uid),
        where("grade", "==", gradeSelect.value),
        where("feeCategory", "==", feeCategory.value),
        where("academicYear", "==", academicYear.value)
    );

    const feeSnapshot = await getDocs(feeQuery);

    if (feeSnapshot.empty) {

        alert("Fee structure not found.");

        return;

    }

    const amount = feeSnapshot.docs[0].data().amount;

    const students = document.querySelectorAll(".studentCheck:checked");

    if (students.length === 0) {

        alert("Select at least one student.");

        return;

    }

    for (const student of students) {

        const duplicateQuery = query(
            collection(db, "studentFees"),
            where("studentId", "==", student.value),
            where("feeCategory", "==", feeCategory.value),
            where("academicYear", "==", academicYear.value)
        );

        const duplicate = await getDocs(duplicateQuery);

        if (!duplicate.empty) continue;

        await addDoc(collection(db, "studentFees"), {

            institutionId: auth.currentUser.uid,

            studentId: student.value,

            grade: gradeSelect.value,

            feeCategory: feeCategory.value,

            academicYear: academicYear.value,

            amount: amount,

            balance: amount,

            createdAt: serverTimestamp()

        });

    }

    alert("Fees assigned successfully.");

    assignFeesForm.reset();

    studentsContainer.innerHTML = "";

});

loadGrades();