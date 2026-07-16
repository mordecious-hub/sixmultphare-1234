// ==========================================
// SixMultPhare Education
// Student Balances
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const balancesTable = document.getElementById("balancesTable");
const searchInput = document.getElementById("searchStudent");
const statusFilter = document.getElementById("statusFilter");
const searchBtn = document.getElementById("searchBtn");

async function loadBalances() {

    try {

        const studentsQuery = query(
            collection(db, "students"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const studentsSnapshot = await getDocs(studentsQuery);

        balancesTable.innerHTML = "";

        if (studentsSnapshot.empty) {

            balancesTable.innerHTML = `
                <tr>
                    <td colspan="7">No student records found.</td>
                </tr>
            `;

            return;

        }

        for (const student of studentsSnapshot.docs) {

            const studentData = student.data();

            if (
                searchInput.value &&
                !studentData.fullName
                    .toLowerCase()
                    .includes(searchInput.value.toLowerCase())
            ) {
                continue;
            }

            const feesQuery = query(
                collection(db, "studentFees"),
                where("studentId", "==", student.id)
            );

            const feesSnapshot = await getDocs(feesQuery);

            for (const fee of feesSnapshot.docs) {

                const feeData = fee.data();

                const totalFee = Number(feeData.amount);
                const balance = Number(feeData.balance);
                const paid = totalFee - balance;

                let status = "Outstanding";
                let statusClass = "status-outstanding";

                if (balance === 0) {

                    status = "Paid";
                    statusClass = "status-paid";

                } else if (paid > 0) {

                    status = "Partial";
                    statusClass = "status-partial";

                }

                if (
                    statusFilter.value &&
                    statusFilter.value !== status
                ) {
                    continue;
                }

                balancesTable.innerHTML += `

                <tr>

                    <td>${studentData.fullName}</td>

                    <td>${studentData.grade}</td>

                    <td>${feeData.feeCategory}</td>

                    <td>ZMW ${totalFee.toFixed(2)}</td>

                    <td>ZMW ${paid.toFixed(2)}</td>

                    <td>ZMW ${balance.toFixed(2)}</td>

                    <td>

                        <span class="status ${statusClass}">

                            ${status}

                        </span>

                    </td>

                </tr>

                `;

            }

        }

    } catch (error) {

        console.error(error);

        balancesTable.innerHTML = `
            <tr>
                <td colspan="7">${error.message}</td>
            </tr>
        `;

    }

}

searchBtn.addEventListener("click", loadBalances);

loadBalances();