"use strict";

const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(dark) {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeToggle.setAttribute("aria-checked", String(dark));
    themeToggle.querySelector("i").className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

applyTheme(document.documentElement.dataset.theme === "dark");
themeToggle.hidden = false;
themeToggle.addEventListener("click", () => {
    applyTheme(themeToggle.getAttribute("aria-checked") !== "true");
    try {
        localStorage.setItem("theme", document.documentElement.dataset.theme);
    } catch {}
});

const scene = document.querySelector(".hero-scene");
const heroTitle = document.querySelector("#hero-title");
const motionToggle = document.querySelector(".motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scenePaused = false;

function syncSceneMotion() {
    const paused = scenePaused || reducedMotion.matches;
    scene.dataset.motion = paused ? "paused" : "playing";
    heroTitle.dataset.motion = paused ? "paused" : "playing";
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.querySelector(".motion-symbol i").className = reducedMotion.matches
        ? "fa-solid fa-circle-pause"
        : paused
          ? "fa-solid fa-play"
          : "fa-solid fa-pause";
    motionToggle.querySelector(".motion-label").textContent = reducedMotion.matches
        ? "Motion reduced"
        : paused
          ? "Play animation"
          : "Pause animation";
}

motionToggle.hidden = false;
motionToggle.addEventListener("click", () => {
    scenePaused = !scenePaused;
    syncSceneMotion();
});
reducedMotion.addEventListener("change", syncSceneMotion);
syncSceneMotion();

const menu = document.querySelector("#main-navigation");
const menuToggle = document.querySelector(".menu-toggle");
const mobileViewport = window.matchMedia("(max-width: 1049px)");

function setMenuOpen(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    menu.hidden = mobileViewport.matches && !open;
}

function syncNavigation() {
    menuToggle.hidden = !mobileViewport.matches;
    setMenuOpen(false);
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    setMenuOpen(false);
    if (mobileViewport.matches) {
        const section = document.querySelector(link.hash);
        section.tabIndex = -1;
        section.focus({ preventScroll: true });
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuToggle.focus();
    }
});
mobileViewport.addEventListener("change", syncNavigation);
syncNavigation();

const navigationLinks = [...menu.querySelectorAll("a")];
const sections = navigationLinks.map((link) => document.querySelector(link.hash));
function updateCurrentSection() {
    let current = sections[0];
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section;
    }
    for (const link of navigationLinks) {
        if (link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    }
}
let scrollPending = false;
window.addEventListener(
    "scroll",
    () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => {
            updateCurrentSection();
            scrollPending = false;
        });
    },
    { passive: true },
);
updateCurrentSection();

for (const year of document.querySelectorAll("[data-year]")) {
    year.textContent = new Date().getFullYear();
}

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = contactForm.elements.name;
    const messageInput = contactForm.elements.body;
    for (const field of [nameInput, messageInput]) {
        field.setCustomValidity(field.value.trim() ? "" : "Please fill out this field.");
    }
    if (!contactForm.reportValidity()) return;
    const name = nameInput.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = messageInput.value.trim();
    const subject = `Project enquiry from ${name}`;
    const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
    window.location.href = `mailto:januriawan@duck.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector("#form-status").textContent =
        "Your email draft is ready to open. If your email app did not open, email januriawan@duck.com directly. Your message has not been sent yet.";
});
contactForm.addEventListener("input", (event) => {
    event.target.setCustomValidity("");
    document.querySelector("#form-status").textContent = "";
});

const partnerSliders = document.querySelectorAll(".partner-slider");
const mobilePartners = window.matchMedia("(max-width: 719px)");

function syncPartnerSliders() {
    partnerSliders.forEach((slider) => {
        const list = slider.querySelector(".client-logos");
        if (mobilePartners.matches && !slider.swiper && typeof Swiper !== "undefined") {
            slider.classList.add("swiper");
            list.classList.add("swiper-wrapper");
            Array.from(list.children).forEach((slide) => slide.classList.add("swiper-slide"));
            new Swiper(slider, {
                slidesPerView: 1.3,
                spaceBetween: 12,
                loop: true,
                autoplay: {
                    enabled: !reducedMotion.matches,
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                speed: reducedMotion.matches ? 0 : 300,
                grabCursor: true,
                watchOverflow: true,
                pagination: {
                    el: slider.querySelector(".partner-pagination"),
                    type: "fraction",
                },
                navigation: {
                    prevEl: slider.querySelector(".partner-prev"),
                    nextEl: slider.querySelector(".partner-next"),
                },
                a11y: {
                    prevSlideMessage: "Partner sebelumnya",
                    nextSlideMessage: "Partner berikutnya",
                    slideLabelMessage: "Partner {{index}} dari {{slidesLength}}",
                    slideRole: "listitem",
                },
            });
            syncPartnerAutoplay(slider);
        } else if (!mobilePartners.matches && slider.swiper) {
            slider.swiper.destroy(true, true);
            slider.classList.remove("swiper");
            list.classList.remove("swiper-wrapper");
            Array.from(list.children).forEach((slide) => slide.classList.remove("swiper-slide"));
        }
    });
}

function syncPartnerAutoplay(slider) {
    const swiper = slider.swiper;
    if (!swiper) return;
    const paused = reducedMotion.matches || slider.dataset.autoplayPaused === "true";
    swiper.params.speed = reducedMotion.matches ? 0 : 300;
    if (paused) {
        swiper.autoplay.stop();
    } else if (!swiper.autoplay.running) {
        swiper.autoplay.start();
    }
    const button = slider.querySelector(".partner-autoplay");
    button.disabled = reducedMotion.matches;
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", paused ? "Putar slide otomatis" : "Jeda slide otomatis");
    button.querySelector("i").className = paused ? "fa-solid fa-play" : "fa-solid fa-pause";
}

partnerSliders.forEach((slider) => {
    slider.querySelector(".partner-autoplay").addEventListener("click", () => {
        slider.dataset.autoplayPaused = String(slider.dataset.autoplayPaused !== "true");
        syncPartnerAutoplay(slider);
    });
});

syncPartnerSliders();
mobilePartners.addEventListener("change", syncPartnerSliders);
reducedMotion.addEventListener("change", () => {
    partnerSliders.forEach(syncPartnerAutoplay);
});
