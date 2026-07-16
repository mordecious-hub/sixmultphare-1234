// ==========================================
// SixMultPhare Education
// Enter Results
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    doc,
    getDocs,
    setDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const examSelect = document.getElementById("examSelect");
const studentSelect = document.getElementById("studentSelect");
const resultsForm = document.getElementById("resultsForm");

// Load Exams
async function loadExams() {

    const institutionId = auth.currentUser.uid;

    const q = query(
        collection(db, "examinations"),
        where("institutionId", "==", institutionId)
    );

    const snapshot = await getDocs(q);

    examSelect.innerHTML =
        '<option value="">Select Examination</option>';

    snapshot.forEach((exam) => {

        const data = exam.data();

        examSelect.innerHTML += `

        <option value="${exam.id}">

            ${data.examName} -
            ${data.subject}

        </option>

        `;

    });

}

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

// Grade Calculator
function calculateGrade(mark){

    if(mark >= 80) return "A";

    if(mark >= 70) return "B";

    if(mark >= 60) return "C";

    if(mark >= 50) return "D";

    if(mark >= 40) return "E";

    return "F";

}

resultsForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    try{

        const examId = examSelect.value;

        const studentId = studentSelect.value;

        const marks = Number(document.getElementById("marks").value);

        const grade = calculateGrade(marks);

        const status = marks >= 40 ? "Pass" : "Fail";

        const resultRef = doc(collection(db,"results"));

        await setDoc(resultRef,{

            resultId: resultRef.id,

            institutionId: auth.currentUser.uid,

            examId,

            studentId,

            marks,

            grade,

            status,

            createdAt: serverTimestamp()

        });

        alert("Result saved successfully.");

        resultsForm.reset();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

});

loadExams();

loadStudents();