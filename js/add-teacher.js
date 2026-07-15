// ==========================================
// SixMultPhare Education
// Add Teacher
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

const teacherForm = document.getElementById("teacherForm");

teacherForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const subject = document.getElementById("subject").value;

    const assignedClass = document.getElementById("class").value;

    const password = document.getElementById("password").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );

        const teacher = userCredential.user;

        await setDoc(doc(db, "teachers", teacher.uid), {

            uid: teacher.uid,

            fullName: fullName,

            email: email,

            phone: phone,

            subject: subject,

            assignedClass: assignedClass,

            role: "teacher",

            status: "active",

            createdAt: serverTimestamp()

        });

        alert("Teacher account created successfully.");

        teacherForm.reset();

        window.location.href = "view-teachers.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});