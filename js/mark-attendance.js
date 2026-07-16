// ==========================================
// SixMultPhare Education
// Mark Attendance
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const gradeSelect = document.getElementById("grade");
const classSelect = document.getElementById("assignedClass");
const studentsContainer = document.getElementById("studentsContainer");
const attendanceForm = document.getElementById("attendanceForm");

// Load students when class changes
classSelect.addEventListener("change", loadStudents);

async function loadStudents() {

    studentsContainer.innerHTML = "";

    if (!classSelect.value) return;

    try {

        const q = query(
            collection(db, "students"),
            where("institutionId", "==", auth.currentUser.uid),
            where("grade", "==", gradeSelect.value),
            where("assignedClass", "==", classSelect.value)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            studentsContainer.innerHTML =
                "<p style='color:white;'>No students found.</p>";

            return;

        }

        snapshot.forEach((student) => {

            const data = student.data();

            studentsContainer.innerHTML += `

            <div class="student-row">

                <span class="student-name">

                    ${data.fullName}

                </span>

                <select
                    class="status-select"
                    data-id="${student.id}">

                    <option value="Present">Present</option>

                    <option value="Absent">Absent</option>

                    <option value="Late">Late</option>

                </select>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// Save attendance
attendanceForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const date = document.getElementById("attendanceDate").value;

    const statuses = document.querySelectorAll(".status-select");

    try {

        for (const status of statuses) {

            const studentId = status.dataset.id;

            // Prevent duplicate attendance
            const checkQuery = query(
                collection(db, "attendance"),
                where("studentId", "==", studentId),
                where("date", "==", date)
            );

            const existing = await getDocs(checkQuery);

            if (!existing.empty) continue;

            const attendanceRef = doc(collection(db, "attendance"));

            await setDoc(attendanceRef, {

                attendanceId: attendanceRef.id,

                institutionId: auth.currentUser.uid,

                studentId: studentId,

                grade: gradeSelect.value,

                assignedClass: classSelect.value,

                date: date,

                status: status.value,

                createdAt: serverTimestamp()

            });

        }

        alert("Attendance saved successfully.");

        attendanceForm.reset();

        studentsContainer.innerHTML =
            "<p>Select a class to load students.</p>";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});