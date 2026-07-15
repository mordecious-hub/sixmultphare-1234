// ==========================================
// SixMultPhare Education
// Add Student
// ==========================================

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const grade = document.getElementById("grade").value;
    const assignedClass = document.getElementById("assignedClass").value;
    const password = document.getElementById("password").value;

    try {

        // Save institution ID before creating student
        const institutionId = auth.currentUser.uid;

        // Create student account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const student = userCredential.user;

        // Save student profile
        await setDoc(doc(db, "students", student.uid), {

            institutionId: institutionId,

            uid: student.uid,

            fullName: fullName,

            email: email,

            phone: phone,

            dateOfBirth: dob,

            gender: gender,

            grade: grade,

            assignedClass: assignedClass,

            role: "student",

            status: "active",

            createdAt: serverTimestamp()

        });

        alert("Student registered successfully.");

        studentForm.reset();

        window.location.href = "view-students.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});