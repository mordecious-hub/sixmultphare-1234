// ==========================================
// SixMultPhare Education
// View Results
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const resultsTable = document.getElementById("resultsTable");

async function loadResults() {

    try {

        const institutionId = auth.currentUser.uid;

        const q = query(
            collection(db, "results"),
            where("institutionId", "==", institutionId)
        );

        const snapshot = await getDocs(q);

        resultsTable.innerHTML = "";

        if (snapshot.empty) {

            resultsTable.innerHTML = `
                <tr>
                    <td colspan="7">No examination results found.</td>
                </tr>
            `;

            return;

        }

        for (const result of snapshot.docs) {

            const data = result.data();

            let studentName = "Unknown Student";
            let examName = "Unknown Exam";
            let subject = "-";

            // Load Student
            const studentSnap = await getDocs(
                query(
                    collection(db, "students"),
                    where("uid", "==", data.studentId)
                )
            );

            if (!studentSnap.empty) {
                studentName = studentSnap.docs[0].data().fullName;
            }

            // Load Examination
            const examSnap = await getDocs(
                query(
                    collection(db, "examinations"),
                    where("examId", "==", data.examId)
                )
            );

            if (!examSnap.empty) {

                examName = examSnap.docs[0].data().examName;

                subject = examSnap.docs[0].data().subject;

            }

            resultsTable.innerHTML += `

            <tr>

                <td>${studentName}</td>

                <td>${examName}</td>

                <td>${subject}</td>

                <td>${data.marks}</td>

                <td>${data.grade}</td>

                <td>${data.status}</td>

                <td>

                    <a href="edit-result.html?id=${result.id}" class="btn">

                        Edit

                    </a>

                    <button
                        class="btn delete"
                        onclick="deleteResult('${result.id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        }

    } catch (error) {

        console.error(error);

        resultsTable.innerHTML = `
            <tr>
                <td colspan="7">${error.message}</td>
            </tr>
        `;

    }

}

window.deleteResult = async (id) => {

    if (!confirm("Delete this result?")) return;

    try {

        await deleteDoc(doc(db, "results", id));

        alert("Result deleted successfully.");

        loadResults();

    } catch (error) {

        alert(error.message);

    }

};

loadResults();