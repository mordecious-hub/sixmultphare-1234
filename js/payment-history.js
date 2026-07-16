// ==========================================
// SixMultPhare Education
// Payment History
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const paymentsTable = document.getElementById("paymentsTable");
const searchInput = document.getElementById("searchPayment");
const paymentMethod = document.getElementById("paymentMethod");
const searchBtn = document.getElementById("searchBtn");

async function loadPayments() {

    try {

        const q = query(
            collection(db, "payments"),
            where("institutionId", "==", auth.currentUser.uid),
            orderBy("paymentDate", "desc")
        );

        const snapshot = await getDocs(q);

        paymentsTable.innerHTML = "";

        if (snapshot.empty) {

            paymentsTable.innerHTML = `
                <tr>
                    <td colspan="7">No payment records found.</td>
                </tr>
            `;

            return;

        }

        let receiptNo = 100001;

        snapshot.forEach((payment) => {

            const data = payment.data();

            const keyword = searchInput.value.toLowerCase();

            if (
                keyword &&
                !data.studentName.toLowerCase().includes(keyword)
            ) {
                return;
            }

            if (
                paymentMethod.value &&
                data.paymentMethod !== paymentMethod.value
            ) {
                return;
            }

            let paymentDate = "-";

            if (data.paymentDate?.toDate) {

                paymentDate =
                    data.paymentDate
                        .toDate()
                        .toLocaleDateString();

            }

            paymentsTable.innerHTML += `

            <tr>

                <td>RCP-${receiptNo++}</td>

                <td>${data.studentName}</td>

                <td>${data.feeCategory}</td>

                <td>ZMW ${Number(data.amountPaid).toFixed(2)}</td>

                <td>${data.paymentMethod}</td>

                <td>${paymentDate}</td>

                <td>ZMW ${Number(data.balanceAfterPayment).toFixed(2)}</td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        paymentsTable.innerHTML = `
            <tr>
                <td colspan="7">${error.message}</td>
            </tr>
        `;

    }

}

searchBtn.addEventListener("click", loadPayments);

loadPayments();