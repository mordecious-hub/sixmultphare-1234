// ==========================================
// SixMultPhare Education
// View Attendance
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const attendanceTable = document.getElementById("attendanceTable");
const searchBtn = document.getElementById("searchBtn");

async function loadAttendance() {

    attendanceTable.innerHTML = `
        <tr>
            <td colspan="6">Loading attendance...</td>
        </tr>
    `;

    try {

        let attendanceQuery = query(
            collection(db, "attendance"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(attendanceQuery);

        attendanceTable.innerHTML = "";

        if (snapshot.empty) {

            attendanceTable.innerHTML = `
                <tr>
                    <td colspan="6">No attendance records found.</td>
                </tr>
            `;

            return;

        }

        const filterDate = document.getElementById("filterDate").value;
        const filterGrade = document.getElementById("filterGrade").value;
        const filterClass = document.getElementById("filterClass").value;

        for (const record of snapshot.docs) {

            const data = record.data();

            if (filterDate && data.date !== filterDate) continue;
            if (filterGrade && data.grade !== filterGrade) continue;
            if (filterClass && data.assignedClass !== filterClass) continue;

            let studentName = "Unknown Student";

            const studentQuery = query(
                collection(db, "students"),
                where("institutionId", "==", auth.currentUser.uid)
            );

            const students = await getDocs(studentQuery);

            students.forEach((student) => {

                if (student.id === data.studentId) {

                    studentName = student.data().fullName;

                }

            });

            attendanceTable.innerHTML += `

            <tr>

                <td>${studentName}</td>

                <td>${data.grade}</td>

                <td>${data.assignedClass}</td>

                <td>${data.date}</td>

                <td>${data.status}</td>

                <td>

                    <button
                        class="btn delete"
                        onclick="deleteAttendance('${record.id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        }

    } catch (error) {

        console.error(error);

        attendanceTable.innerHTML = `
            <tr>
                <td colspan="6">${error.message}</td>
            </tr>
        `;

    }

}

window.deleteAttendance = async (id) => {

    if (!confirm("Delete this attendance record?")) return;

    try {

        await deleteDoc(doc(db, "attendance", id));

        alert("Attendance deleted successfully.");

        loadAttendance();

    } catch (error) {

        alert(error.message);

    }

};

searchBtn.addEventListener("click", loadAttendance);

loadAttendance();