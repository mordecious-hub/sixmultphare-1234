// ==========================================
// SixMultPhare Education
// Homepage JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("SixMultPhare Education Loaded Successfully");

    // ==========================
    // Navigation Active Link
    // ==========================

    const links = document.querySelectorAll(".navbar a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            links.forEach(item => {

                item.classList.remove("active");

            });

            link.classList.add("active");

        });

    });

    // ==========================
    // Smooth Scroll
    // ==========================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

    // ==========================
    // Future Firebase Check
    // ==========================

    console.log("Ready for Firebase Integration");

});