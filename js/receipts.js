// ==========================================
// SixMultPhare Education
// Receipts
// ==========================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const receiptsTable = document.getElementById("receiptsTable");
const searchInput = document.getElementById("searchReceipt");
const searchBtn = document.getElementById("searchBtn");

async function loadReceipts() {

    try {

        const q = query(
            collection(db, "receipts"),
            where("institutionId", "==", auth.currentUser.uid),
            orderBy("receiptDate", "desc")
        );

        const snapshot = await getDocs(q);

        receiptsTable.innerHTML = "";

        if (snapshot.empty) {

            receiptsTable.innerHTML = `
                <tr>
                    <td colspan="7">No receipts found.</td>
                </tr>
            `;

            return;

        }

        let receiptNumber = 100001;

        snapshot.forEach((receipt) => {

            const data = receipt.data();

            if (
                searchInput.value &&
                !data.studentName
                    .toLowerCase()
                    .includes(searchInput.value.toLowerCase())
            ) {
                return;
            }

            let receiptDate = "-";

            if (data.receiptDate?.toDate) {

                receiptDate = data.receiptDate
                    .toDate()
                    .toLocaleDateString();

            }

            receiptsTable.innerHTML += `

            <tr>

                <td>RCP-${receiptNumber++}</td>

                <td>${data.studentName}</td>

                <td>${data.feeCategory}</td>

                <td>ZMW ${Number(data.amountPaid).toFixed(2)}</td>

                <td>${data.paymentMethod}</td>

                <td>${receiptDate}</td>

                <td>

                    <button
                        class="btn print-btn"
                        onclick="printReceipt()">

                        Print

                    </button>

                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        receiptsTable.innerHTML = `
            <tr>
                <td colspan="7">${error.message}</td>
            </tr>
        `;

    }

}

window.printReceipt = () => {

    window.print();

};

searchBtn.addEventListener("click", loadReceipts);

loadReceipts();