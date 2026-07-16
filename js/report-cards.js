// ==========================================
// SixMultPhare Education
// Report Cards
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const studentSelect = document.getElementById("studentSelect");
const reportForm = document.getElementById("reportForm");
const reportCard = document.getElementById("reportCard");

// Load Students
async function loadStudents() {

    const institutionId = auth.currentUser.uid;

    const q = query(
        collection(db, "students"),
        where("institutionId", "==", institutionId)
    );

    const snapshot = await getDocs(q);

    studentSelect.innerHTML =
        '<option value="">Select Student</option>';

    snapshot.forEach((student) => {

        const data = student.data();

        studentSelect.innerHTML += `

        <option value="${student.id}">

            ${data.fullName}

        </option>

        `;

    });

}

reportForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const studentId = studentSelect.value;
    const term = document.getElementById("term").value;
    const year = document.getElementById("year").value;

    const resultQuery = query(
        collection(db, "results"),
        where("studentId", "==", studentId)
    );

    const resultSnapshot = await getDocs(resultQuery);

    let total = 0;
    let count = 0;

    let html = `

    <h2>Student Report Card</h2>

    <table>

        <tr>

            <th>Subject</th>

            <th>Marks</th>

            <th>Grade</th>

            <th>Status</th>

        </tr>

    `;

    for (const result of resultSnapshot.docs) {

        const data = result.data();

        const examQuery = query(
            collection(db, "examinations"),
            where("examId", "==", data.examId)
        );

        const examSnapshot = await getDocs(examQuery);

        let subject = "Unknown";

        if (!examSnapshot.empty) {

            const exam = examSnapshot.docs[0].data();

            if (exam.term !== term || exam.year != year) {

                continue;

            }

            subject = exam.subject;

        }

        total += data.marks;
        count++;

        html += `

        <tr>

            <td>${subject}</td>

            <td>${data.marks}</td>

            <td>${data.grade}</td>

            <td>${data.status}</td>

        </tr>

        `;

    }

    html += `</table>`;

    const average = count > 0 ? (total / count).toFixed(2) : 0;

    html += `

    <div class="summary">

        <p><strong>Total Marks:</strong> ${total}</p>

        <p><strong>Subjects:</strong> ${count}</p>

        <p><strong>Average:</strong> ${average}%</p>

        <p><strong>Term:</strong> ${term}</p>

        <p><strong>Academic Year:</strong> ${year}</p>

    </div>

    <div class="signature">

        <div>

            ______________________

            <br>

            Class Teacher

        </div>

        <div>

            ______________________

            <br>

            Head Teacher

        </div>

    </div>

    <br>

    <button class="btn" onclick="window.print()">

        Print Report Card

    </button>

    `;

    reportCard.innerHTML = html;

});

loadStudents();