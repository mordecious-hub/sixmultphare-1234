// ==========================================
// SixMultPhare Education
// School Payment Details
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

const form = document.getElementById("paymentDetailsForm");

let documentId = null;

// Load existing payment details
async function loadPaymentDetails() {

    try {

        const q = query(
            collection(db, "schoolPaymentDetails"),
            where("institutionId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {

            const paymentDoc = snapshot.docs[0];

            documentId = paymentDoc.id;

            const data = paymentDoc.data();

            document.getElementById("bankName").value = data.bankName || "";
            document.getElementById("accountName").value = data.accountName || "";
            document.getElementById("accountNumber").value = data.accountNumber || "";
            document.getElementById("mtnNumber").value = data.mtnNumber || "";
            document.getElementById("airtelNumber").value = data.airtelNumber || "";
            document.getElementById("zamtelNumber").value = data.zamtelNumber || "";
            document.getElementById("financeEmail").value = data.financeEmail || "";
            document.getElementById("financePhone").value = data.financePhone || "";

        }

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// Save or Update
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const paymentData = {

        institutionId: auth.currentUser.uid,

        bankName: document.getElementById("bankName").value.trim(),

        accountName: document.getElementById("accountName").value.trim(),

        accountNumber: document.getElementById("accountNumber").value.trim(),

        mtnNumber: document.getElementById("mtnNumber").value.trim(),

        airtelNumber: document.getElementById("airtelNumber").value.trim(),

        zamtelNumber: document.getElementById("zamtelNumber").value.trim(),

        financeEmail: document.getElementById("financeEmail").value.trim(),

        financePhone: document.getElementById("financePhone").value.trim(),

        updatedAt: serverTimestamp()

    };

    try {

        if (documentId) {

            await updateDoc(doc(db, "schoolPaymentDetails", documentId), paymentData);

            alert("Payment details updated successfully.");

        } else {

            paymentData.createdAt = serverTimestamp();

            await addDoc(collection(db, "schoolPaymentDetails"), paymentData);

            alert("Payment details saved successfully.");

        }

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

loadPaymentDetails();