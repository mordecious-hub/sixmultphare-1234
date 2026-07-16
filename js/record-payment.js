// ==========================================
// SixMultPhare Education
// Record Payment
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const searchBtn = document.getElementById("searchStudentBtn");
const studentSearch = document.getElementById("studentSearch");
const studentDetails = document.getElementById("studentDetails");
const paymentForm = document.getElementById("paymentForm");

let selectedStudent = null;
let selectedFee = null;

// Search Student
searchBtn.addEventListener("click", async () => {

    const keyword = studentSearch.value.trim();

    if (!keyword) {

        alert("Enter student name or admission number.");

        return;

    }

    const q = query(
        collection(db, "students"),
        where("institutionId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    selectedStudent = null;

    snapshot.forEach((student) => {

        const data = student.data();

        if (
            data.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
            (data.admissionNumber &&
             data.admissionNumber.toLowerCase().includes(keyword.toLowerCase()))
        ) {

            selectedStudent = {
                id: student.id,
                ...data
            };

        }

    });

    if (!selectedStudent) {

        studentDetails.innerHTML = "<p>Student not found.</p>";

        return;

    }

    studentDetails.innerHTML = `
        <h3>${selectedStudent.fullName}</h3>
        <p>Grade: ${selectedStudent.grade}</p>
    `;

});

// Record Payment
paymentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!selectedStudent) {

        alert("Search and select a student first.");

        return;

    }

    const feeQuery = query(
        collection(db, "studentFees"),
        where("studentId", "==", selectedStudent.id),
        where("feeCategory", "==", document.getElementById("feeCategory").value)
    );

    const feeSnapshot = await getDocs(feeQuery);

    if (feeSnapshot.empty) {

        alert("No assigned fee found.");

        return;

    }

    selectedFee = feeSnapshot.docs[0];

    const feeData = selectedFee.data();

    const amountPaid = Number(document.getElementById("amountPaid").value);

    if (amountPaid > feeData.balance) {

        alert("Amount exceeds outstanding balance.");

        return;

    }

    const newBalance = feeData.balance - amountPaid;

    await updateDoc(doc(db, "studentFees", selectedFee.id), {

        balance: newBalance

    });

    await addDoc(collection(db, "payments"), {

        institutionId: auth.currentUser.uid,

        studentId: selectedStudent.id,

        studentName: selectedStudent.fullName,

        feeCategory: feeData.feeCategory,

        amountPaid,

        paymentMethod: document.getElementById("paymentMethod").value,

        balanceAfterPayment: newBalance,

        paymentDate: serverTimestamp()

    });

    await addDoc(collection(db, "receipts"), {

        institutionId: auth.currentUser.uid,

        studentId: selectedStudent.id,

        studentName: selectedStudent.fullName,

        feeCategory: feeData.feeCategory,

        amountPaid,

        paymentMethod: document.getElementById("paymentMethod").value,

        balanceAfterPayment: newBalance,

        receiptDate: serverTimestamp()

    });

    alert("Payment recorded successfully.");

    paymentForm.reset();

    studentDetails.innerHTML = "<p>No student selected.</p>";

    selectedStudent = null;
    selectedFee = null;

});