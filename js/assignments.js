// ==========================================
// SixMultPhare Education
// Assignment Submission
// ==========================================

import { auth, db, storage } from "./firebase.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const assignmentForm = document.getElementById("assignmentForm");

if (assignmentForm) {

    assignmentForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const file = document.getElementById("assignmentFile").files[0];

        if (!file) {

            alert("Please select a file.");

            return;

        }

        try {

            const user = auth.currentUser;

            if (!user) {

                alert("Please login first.");

                return;

            }

            const storageRef = ref(
                storage,
                `assignments/${user.uid}/${Date.now()}_${file.name}`
            );

            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, "assignments"), {

                studentId: user.uid,

                fileName: file.name,

                fileUrl: downloadURL,

                submittedAt: serverTimestamp(),

                status: "Submitted"

            });

            alert("Assignment submitted successfully.");

            assignmentForm.reset();

        } catch (error) {

            console.error(error);

            alert("Submission failed: " + error.message);

        }

    });

}