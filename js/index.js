// ==========================================
// SIXMULTPHARE PUBLIC HOME PAGE
// ==========================================

import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
where,
limit,
orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ==========================================
// ELEMENTS
// ==========================================
const institutionCount = document.getElementById("institutionCount");
const studentCount = document.getElementById("studentCount");
const teacherCount = document.getElementById("teacherCount");
const parentCount = document.getElementById("parentCount");
const publicPosts = document.getElementById("publicPosts");
const contactForm = document.getElementById("contactForm");
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

// ==========================================
// LOAD PLATFORM STATISTICS
// ==========================================
async function loadStatistics(){
    try{
        const [institutions, students, teachers, parents] = await Promise.all([
            getDocs(collection(db,"institutions")),
            getDocs(collection(db,"students")),
            getDocs(collection(db,"teachers")),
            getDocs(collection(db,"parents"))
        ]);

        if(institutionCount) institutionCount.textContent = institutions.size;
        if(studentCount) studentCount.textContent = students.size;
        if(teacherCount) teacherCount.textContent = teachers.size;
        if(parentCount) parentCount.textContent = parents.size;

    }catch(error){
        console.error("Error loading stats:", error);
    }
}

// ==========================================
// LOAD PUBLIC POSTS
// ==========================================
async function loadPublicPosts(){
    if(!publicPosts) return;

    try{
        const postsQuery = query(
            collection(db,"posts"),
            where("visibility","==","public"),
            orderBy("createdAt","desc"),
            limit(10)
        );

        const snapshot = await getDocs(postsQuery);
        publicPosts.innerHTML="";

        if(snapshot.empty){
            publicPosts.innerHTML=`
            <div class="empty-posts">
                <h3>No public posts yet</h3>
                <p>Be the first institution to share an update.</p>
            </div>
            `;
            return;
        }

        snapshot.forEach((doc)=>{
            const post = doc.data();
            const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Today";

            publicPosts.innerHTML += `
            <div class="post-card">
                <div class="post-header">
                    <h3>${post.authorName || "SixMultPhare"}</h3>
                    <span>${date}</span>
                </div>
                <p>${post.content}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image">` : ""}
                <div class="post-actions">
                    <a href="signup.html" class="primary-btn">Sign up to interact</a>
                </div>
            </div>
            `;
        });

    }catch(error){
        console.error("Error loading posts:", error);
        if(publicPosts) publicPosts.innerHTML = `<p>Failed to load posts.</p>`;
    }
}

// ==========================================
// LOAD PUBLIC ANNOUNCEMENTS
// ==========================================
async function loadAnnouncements(){
    try{
        const announcementQuery = query(
            collection(db,"announcements"),
            where("visibility","==","public"),
            orderBy("createdAt","desc"),
            limit(5)
        );

        await getDocs(announcementQuery);
        // Announcements will be displayed on the homepage in the next update.
        
    }catch(error){
        console.error("Error loading announcements:", error);
    }
}

// ==========================================
// CONTACT FORM
// ==========================================
if(contactForm){
    contactForm.addEventListener("submit", async(e)=>{
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        // For now just show alert. Later we can save to Firestore
        alert(`Thank you ${fullName} for contacting SixMultPhare. We have received your message.`);

        contactForm.reset();
    });
}

// ==========================================
// MOBILE MENU
// ==========================================
if(menuToggle && navbar){
    menuToggle.addEventListener("click", ()=>{
        navbar.classList.toggle("active");
    });
}

// ==========================================
// INITIALIZE
// ==========================================
async function initializeHome(){
    await loadStatistics();
    await loadPublicPosts();
    await loadAnnouncements();
}

document.addEventListener("DOMContentLoaded", initializeHome);