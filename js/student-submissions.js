// ==========================================
// SixMultPhare Education
// Student Submissions
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const submissionsTable = document.getElementById("submissionsTable");

async function loadSubmissions() {

    try {

        const assignmentId = new URLSearchParams(window.location.search).get("id");

        const q = query(
            collection(db, "submissions"),
            where("assignmentId", "==", assignmentId),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        submissionsTable.innerHTML = "";

        if (snapshot.empty) {

            submissionsTable.innerHTML = `
                <tr>
                    <td colspan="6">No submissions found.</td>
                </tr>
            `;

            return;

        }

        for (const submission of snapshot.docs) {

            const data = submission.data();

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

            submissionsTable.innerHTML += `

            <tr>

                <td>${studentName}</td>

                <td>${data.assignmentTitle}</td>

                <td>${data.submittedAt}</td>

                <td>${data.status}</td>

                <td>${data.grade || "-"}</td>

                <td>

                    <a
                        href="${data.fileUrl}"
                        target="_blank"
                        class="btn">

                        View

                    </a>

                    <button
                        class="btn grade"
                        onclick="gradeSubmission('${submission.id}')">

                        Grade

                    </button>

                </td>

            </tr>

            `;

        }

    } catch (error) {

        console.error(error);

        submissionsTable.innerHTML = `
            <tr>
                <td colspan="6">${error.message}</td>
            </tr>
        `;

    }

}

window.gradeSubmission = async (id) => {

    const grade = prompt("Enter Grade");

    if (!grade) return;

    const feedback = prompt("Teacher Feedback");

    try {

        await updateDoc(doc(db, "submissions", id), {

            grade: grade,

            feedback: feedback || ""

        });

        alert("Submission graded successfully.");

        loadSubmissions();

    } catch (error) {

        alert(error.message);

    }

};

loadSubmissions();