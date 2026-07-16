// ==========================================
// SixMultPhare Education
// Create Assignment
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const assignmentForm = document.getElementById("assignmentForm");
const subjectSelect = document.getElementById("subject");
const gradeSelect = document.getElementById("grade");
const classSelect = document.getElementById("assignedClass");

// Load Subjects
async function loadSubjects() {

    const q = query(
        collection(db, "subjects"),
        where("institutionId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    subjectSelect.innerHTML =
        `<option value="">Select Subject</option>`;

    snapshot.forEach((doc) => {

        const subject = doc.data();

        subjectSelect.innerHTML += `
            <option value="${subject.subjectName}">
                ${subject.subjectName}
            </option>
        `;

    });

}

// Load Grades
async function loadGrades() {

    const q = query(
        collection(db, "grades"),
        where("institutionId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    gradeSelect.innerHTML =
        `<option value="">Select Grade</option>`;

    snapshot.forEach((doc) => {

        const grade = doc.data();

        gradeSelect.innerHTML += `
            <option value="${grade.gradeName}">
                ${grade.gradeName}
            </option>
        `;

    });

}

// Load Classes
async function loadClasses() {

    const q = query(
        collection(db, "classes"),
        where("institutionId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    classSelect.innerHTML =
        `<option value="">Select Class</option>`;

    snapshot.forEach((doc) => {

        const classroom = doc.data();

        classSelect.innerHTML += `
            <option value="${classroom.className}">
                ${classroom.className}
            </option>
        `;

    });

}

// Save Assignment
assignmentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "assignments"), {

            institutionId: auth.currentUser.uid,

            title: document.getElementById("title").value,

            subject: subjectSelect.value,

            grade: gradeSelect.value,

            assignedClass: classSelect.value,

            instructions: document.getElementById("instructions").value,

            dueDate: document.getElementById("dueDate").value,

            createdAt: serverTimestamp()

        });

        alert("Assignment created successfully.");

        assignmentForm.reset();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

loadSubjects();
loadGrades();
loadClasses();