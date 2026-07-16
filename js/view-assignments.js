// ==========================================
// SixMultPhare Education
// View Assignments
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

const assignmentsTable = document.getElementById("assignmentsTable");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchAssignment");

async function loadAssignments() {

    assignmentsTable.innerHTML = `
        <tr>
            <td colspan="6">Loading assignments...</td>
        </tr>
    `;

    try {

        const q = query(
            collection(db, "assignments"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        assignmentsTable.innerHTML = "";

        if (snapshot.empty) {

            assignmentsTable.innerHTML = `
                <tr>
                    <td colspan="6">No assignments found.</td>
                </tr>
            `;

            return;

        }

        const keyword = searchInput.value.toLowerCase();

        snapshot.forEach((assignment) => {

            const data = assignment.data();

            if (
                keyword &&
                !data.title.toLowerCase().includes(keyword) &&
                !data.subject.toLowerCase().includes(keyword)
            ) {
                return;
            }

            assignmentsTable.innerHTML += `

            <tr>

                <td>${data.title}</td>

                <td>${data.subject}</td>

                <td>${data.grade}</td>

                <td>${data.assignedClass}</td>

                <td>${data.dueDate}</td>

                <td>

                    <a href="student-submissions.html?id=${assignment.id}" class="btn">

                        View

                    </a>

                    <button
                        class="btn delete"
                        onclick="deleteAssignment('${assignment.id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        assignmentsTable.innerHTML = `
            <tr>
                <td colspan="6">${error.message}</td>
            </tr>
        `;

    }

}

window.deleteAssignment = async (id) => {

    if (!confirm("Delete this assignment?")) return;

    try {

        await deleteDoc(doc(db, "assignments", id));

        alert("Assignment deleted successfully.");

        loadAssignments();

    } catch (error) {

        alert(error.message);

    }

};

searchBtn.addEventListener("click", loadAssignments);

loadAssignments();