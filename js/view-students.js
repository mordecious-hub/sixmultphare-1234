// ==========================================
// SixMultPhare Education
// View Students
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const studentList = document.getElementById("studentList");

// Check login
onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    loadStudents(user.uid);

});

async function loadStudents(institutionId) {

    studentList.innerHTML = "";

    try {

        const q = query(
            collection(db, "students"),
            where("institutionId", "==", institutionId)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            studentList.innerHTML = `

            <div class="dashboard-card">

                <ion-icon name="school-outline"></ion-icon>

                <h2>No Students Found</h2>

                <p>No students have been registered yet.</p>

            </div>

            `;

            return;

        }

        snapshot.forEach((student) => {

            const data = student.data();

            studentList.innerHTML += `

            <div class="dashboard-card">

                <ion-icon name="person-circle-outline"></ion-icon>

                <h2>${data.fullName}</h2>

                <p><strong>Email:</strong> ${data.email}</p>

                <p><strong>Phone:</strong> ${data.phone}</p>

                <p><strong>Grade:</strong> ${data.grade}</p>

                <p><strong>Class:</strong> ${data.assignedClass}</p>

                <p><strong>Status:</strong> ${data.status}</p>

                <div class="actions">

                    <a href="edit-student.html?id=${student.id}" class="btn">

                        Edit

                    </a>

                    <button
                        class="btn delete"
                        onclick="deleteStudent('${student.id}')">

                        Delete

                    </button>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        studentList.innerHTML = `

        <div class="dashboard-card">

            <ion-icon name="warning-outline"></ion-icon>

            <h2>Error</h2>

            <p>${error.message}</p>

        </div>

        `;

    }

}

window.deleteStudent = async (id) => {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) return;

    try {

        await deleteDoc(doc(db, "students", id));

        alert("Student deleted successfully.");

        location.reload();

    } catch (error) {

        alert(error.message);

    }

};