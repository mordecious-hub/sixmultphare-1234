// ==========================================
// SixMultPhare Education
// Financial Reports
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const totalIncome = document.getElementById("totalIncome");
const outstandingBalance = document.getElementById("outstandingBalance");
const studentsPaid = document.getElementById("studentsPaid");
const studentsOwing = document.getElementById("studentsOwing");
const reportsTable = document.getElementById("reportsTable");

async function loadFinancialReports() {

    try {

        const paymentsQuery = query(
            collection(db, "payments"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const feesQuery = query(
            collection(db, "studentFees"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);
        const feesSnapshot = await getDocs(feesQuery);

        let income = 0;
        let outstanding = 0;
        let paidCount = 0;
        let owingCount = 0;

        const summary = {};

        paymentsSnapshot.forEach((payment) => {

            const data = payment.data();

            income += Number(data.amountPaid);

            if (!summary[data.feeCategory]) {

                summary[data.feeCategory] = {
                    collected: 0,
                    outstanding: 0
                };

            }

            summary[data.feeCategory].collected += Number(data.amountPaid);

        });

        feesSnapshot.forEach((fee) => {

            const data = fee.data();

            outstanding += Number(data.balance);

            if (Number(data.balance) === 0) {

                paidCount++;

            } else {

                owingCount++;

            }

            if (!summary[data.feeCategory]) {

                summary[data.feeCategory] = {
                    collected: 0,
                    outstanding: 0
                };

            }

            summary[data.feeCategory].outstanding += Number(data.balance);

        });

        totalIncome.textContent = `ZMW ${income.toFixed(2)}`;
        outstandingBalance.textContent = `ZMW ${outstanding.toFixed(2)}`;
        studentsPaid.textContent = paidCount;
        studentsOwing.textContent = owingCount;

        reportsTable.innerHTML = "";

        Object.keys(summary).forEach((category) => {

            reportsTable.innerHTML += `

            <tr>

                <td>${category}</td>

                <td>ZMW ${summary[category].collected.toFixed(2)}</td>

                <td>ZMW ${summary[category].outstanding.toFixed(2)}</td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        reportsTable.innerHTML = `
            <tr>
                <td colspan="3">${error.message}</td>
            </tr>
        `;

    }

}

loadFinancialReports();