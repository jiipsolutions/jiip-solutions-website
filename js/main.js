/* ========================================
   MOBILE FOOTER ACCORDION
======================================== */


document.addEventListener("click", (event) => {
  const title = event.target.closest(".footer-accordion-title");

  if (!title || window.innerWidth > 768) return;

  const column = title.closest(".footer-column");
  if (!column) return;

  document.querySelectorAll(".footer-column").forEach((item) => {
    if (item !== column) {
      item.classList.remove("active");
    }
  });

  column.classList.toggle("active");
});

/* ========================================
   MOBILE MENU
======================================== */


/* ========================================
   MOBILE MENU
======================================== */

document.addEventListener("click", (event) => {
    const menuButton = event.target.closest(".menu-button");

    if (!menuButton) return;

    const header = menuButton.closest(".site-header");
    if (!header) return;

    const desktopNav = header.querySelector(".desktop-nav");
    if (!desktopNav) return;

    const isOpen = desktopNav.classList.toggle("mobile-open");

    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

/* ========================================
   SERVICES PAGE - VIEW DETAILS
======================================== */

document.querySelectorAll(".service-details-button").forEach((button) => {
    button.addEventListener("click", () => {
        const details = button.nextElementSibling;

        if (!details || !details.classList.contains("service-extra-details")) {
            return;
        }

        details.classList.toggle("active");

        const icon = button.querySelector("span");

        if (details.classList.contains("active")) {
            button.childNodes[0].textContent = "Hide Details ";
            icon.textContent = "−";
        } else {
            button.childNodes[0].textContent = "View Details ";
            icon.textContent = "+";
        }
    });
});
/* ========================================
   HOME SERVICE CARDS - MOBILE TAP
======================================== */

document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            document.querySelectorAll(".service-card").forEach((item) => {
                if (item !== card) {
                    item.classList.remove("mobile-active");
                }
            });

            card.classList.toggle("mobile-active");
        }

    });
});
/* =========================================
   SERVICES PAGE - AUTO OPEN LINKED SERVICE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const serviceId = window.location.hash.substring(1);

    if (!serviceId) return;

    const service = document.getElementById(serviceId);

    if (!service || !service.classList.contains("service-row")) return;

    const detailsButton = service.querySelector(".service-details-button");
    const detailsPanel = service.querySelector(".service-extra-details");

    if (!detailsButton || !detailsPanel) return;

    // Use the existing button functionality to expand details
    if (getComputedStyle(detailsPanel).display === "none") {
        detailsButton.click();
    }

    // Scroll to the selected service
    requestAnimationFrame(function () {
        service.scrollIntoView({
            behavior: "instant",
            block: "start"
        });
    });

});

/* Load shared footer */
async function loadSharedFooter() {
  const footerContainer = document.getElementById("shared-footer");

  if (!footerContainer) return;

  try {
    const response = await fetch("footer.html");

    if (!response.ok) {
      throw new Error("Footer could not be loaded");
    }

    footerContainer.innerHTML = await response.text();

    // Let other scripts know the footer is ready
    document.dispatchEvent(new Event("footerLoaded"));
  } catch (error) {
    console.error("Shared footer error:", error);
  }
}

loadSharedFooter();

/* ========================================
   LOAD SHARED HEADER
======================================== */

async function loadSharedHeader() {
    const headerContainer = document.getElementById("shared-header");

    if (!headerContainer) return;

    try {
        const response = await fetch("header.html");

        if (!response.ok) {
            throw new Error("Header could not be loaded");
        }

        headerContainer.innerHTML = await response.text();

        // Highlight the current page in navigation
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        headerContainer.querySelectorAll(".desktop-nav a").forEach((link) => {
            const linkPage = link.getAttribute("href");

            link.classList.toggle("active", linkPage === currentPage);

            if (linkPage === currentPage) {
                link.setAttribute("aria-current", "page");
            }
        });

    } catch (error) {
        console.error("Shared header error:", error);
    }
}

loadSharedHeader();

/* ========================================
   HOME HERO IMAGE SLIDESHOW
======================================== */



const heroSlides = document.querySelectorAll(".hero-image .hero-slide");
const heroSocials = document.querySelector(".hero-socials");

if (heroSlides.length > 1) {
  let currentHeroSlide = 0;

  function changeHeroSlide() {
    heroSlides[currentHeroSlide].classList.remove("active");

    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;

    heroSlides[currentHeroSlide].classList.add("active");
    if (heroSocials) {
  heroSocials.style.opacity = currentHeroSlide === 0 ? "1" : "0";
  heroSocials.style.visibility = currentHeroSlide === 0 ? "visible" : "hidden";
}

    // All subsequent slides display for 6 seconds.
    setTimeout(changeHeroSlide, 6000);
  }

  // Only the very first image displays for 4 seconds.
  setTimeout(changeHeroSlide, 4000);
}



/* JIIP SOLUTIONS — CONTACT FORM SUBMISSION */

const jiipForm = document.getElementById("jiip-contact-form");

if (jiipForm) {
  const submitButton = jiipForm.querySelector('button[type="submit"]');

  const formStatus = document.createElement("p");
  formStatus.setAttribute("role", "status");
  formStatus.setAttribute("aria-live", "polite");
  formStatus.style.marginTop = "16px";
  formStatus.style.fontSize = "14px";
  formStatus.style.lineHeight = "1.6";

  submitButton.insertAdjacentElement("afterend", formStatus);

  jiipForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!jiipForm.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";

    try {
      const formData = new FormData(jiipForm);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      
formStatus.className = "jiip-form-success";
formStatus.textContent =
  "✓ Thank you! Your enquiry has been received successfully. Our team will review your requirements and get back to you soon.";
formStatus.scrollIntoView({
  behavior: "smooth",
  block: "nearest"
});


      jiipForm.reset();

    } catch (error) {
      formStatus.style.color = "#b42318";
      formStatus.textContent =
        "Sorry, we couldn't submit your enquiry. Please try again or contact us through WhatsApp.";

      console.error("JIIP contact form error:", error);

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Enquiry";
    }
  });
}
/* JIIP — MOBILE SERVICE CARD TAP */

if (window.matchMedia("(max-width: 768px)").matches) {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    const overlay = card.querySelector(".service-card-overlay");

    if (!overlay) return;

    overlay.addEventListener("click", (event) => {
     if (!card.classList.contains("is-open")) {
        event.preventDefault();

        serviceCards.forEach((otherCard) => {
          otherCard.classList.remove("is-open");
        });

        card.classList.add("is-open");
      }
    });
  });
}