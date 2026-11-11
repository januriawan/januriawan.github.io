"use strict";

const { t } = window.siteI18n;

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
        ? t("Motion reduced")
        : paused
          ? t("Play animation")
          : t("Pause animation");
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
const sidebar = document.querySelector(".sidebar");
const mobileNavbar = document.querySelector(".mobile-navbar");
const mobileProfile = document.querySelector(".sidebar .identity").cloneNode(true);
for (const element of mobileProfile.querySelectorAll("svg [id]")) {
    element.id = `mobile-${element.id}`;
}
for (const element of mobileProfile.querySelectorAll("svg [href], svg [stroke]")) {
    for (const attribute of ["href", "stroke"]) {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, value.replaceAll("avatar-work-", "mobile-avatar-work-"));
    }
}
mobileNavbar.querySelector(".mobile-navbar-profile").append(mobileProfile);
const sidebarAnchor = document.createComment("sidebar");
sidebar.before(sidebarAnchor);
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuBody = mobileMenu.querySelector(".mobile-menu-body");
const mobileMenuClose = mobileMenu.querySelector(".mobile-menu-close");
const mobileViewport = window.matchMedia("(max-width: 1049px)");
let menuCloseTimer;

function setMenuOpen(open, focusTarget = menuToggle) {
    clearTimeout(menuCloseTimer);
    open = open && mobileViewport.matches;
    menuToggle.setAttribute("aria-expanded", String(open));
    if (open) {
        document.documentElement.classList.add("mobile-menu-open");
        if (!mobileMenu.open) {
            mobileMenu.showModal();
            mobileMenuBody.scrollTop = 0;
        }
        mobileMenu.getBoundingClientRect();
        mobileMenu.classList.add("is-open");
        return;
    }
    mobileMenu.classList.remove("is-open");
    if (!mobileMenu.open) return;
    const finishClose = () => {
        mobileMenu.close();
        document.documentElement.classList.remove("mobile-menu-open");
        focusTarget.focus({ preventScroll: true });
    };
    if (reducedMotion.matches) finishClose();
    else menuCloseTimer = window.setTimeout(finishClose, 240);
}

function syncNavigation() {
    clearTimeout(menuCloseTimer);
    mobileMenu.classList.remove("is-open");
    if (mobileMenu.open) mobileMenu.close();
    document.documentElement.classList.remove("mobile-menu-open");
    if (mobileViewport.matches) mobileMenuBody.append(sidebar);
    else sidebarAnchor.after(sidebar);
    const preferences = document.querySelector(".site-preferences");
    const slot = document.querySelector(mobileViewport.matches ? ".mobile-preferences" : ".desktop-preferences");
    if (preferences.parentElement !== slot) slot.append(preferences);
    menu.hidden = false;
    mobileNavbar.hidden = !mobileViewport.matches;
    menuToggle.hidden = !mobileViewport.matches;
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
mobileMenuClose.addEventListener("click", () => setMenuOpen(false));
mobileMenu.addEventListener("cancel", (event) => {
    event.preventDefault();
    setMenuOpen(false);
});
mobileMenu.addEventListener("close", () => {
    document.documentElement.classList.remove("mobile-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
});
mobileMenu.addEventListener("click", (event) => {
    if (event.target !== mobileMenu) return;
    const bounds = mobileMenu.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) setMenuOpen(false);
});
sidebar.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !mobileViewport.matches) return;
    const section = document.querySelector(link.hash);
    section.tabIndex = -1;
    setMenuOpen(false, section);
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
        field.setCustomValidity(field.value.trim() ? "" : t("Please fill out this field."));
    }
    if (!contactForm.reportValidity()) return;
    const name = nameInput.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = messageInput.value.trim();
    const subject = t("Project enquiry from {name}", { name });
    const body = `${message}\n\n${t("From: {name}\nEmail: {email}", { name, email })}`;
    window.location.href = `mailto:januriawan@duck.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector("#form-status").textContent =
        t("Your email draft is ready to open. If your email app did not open, email januriawan@duck.com directly. Your message has not been sent yet.");
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
                    prevSlideMessage: t("Previous partner"),
                    nextSlideMessage: t("Next partner"),
                    slideLabelMessage: t("Partner {index} of {total}", { index: "{{index}}", total: "{{slidesLength}}" }),
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
    button.setAttribute("aria-label", t(paused ? "Play automatic slides" : "Pause automatic slides"));
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

document.addEventListener("languagechange", () => {
    syncSceneMotion();
    partnerSliders.forEach((slider) => {
        syncPartnerAutoplay(slider);
        const swiper = slider.swiper;
        if (!swiper) return;
        Object.assign(swiper.params.a11y, {
            prevSlideMessage: t("Previous partner"),
            nextSlideMessage: t("Next partner"),
            slideLabelMessage: t("Partner {index} of {total}", { index: "{{index}}", total: "{{slidesLength}}" }),
        });
        swiper.slides.forEach((slide) => {
            slide.setAttribute("aria-label", t("Partner {index} of {total}", {
                index: Number(slide.dataset.swiperSlideIndex) + 1,
                total: swiper.slides.length,
            }));
        });
    });
    for (const field of [contactForm.elements.name, contactForm.elements.body]) {
        if (field.validity.customError) field.setCustomValidity(t("Please fill out this field."));
    }
});
