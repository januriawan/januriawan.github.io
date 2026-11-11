"use strict";

(() => {
    const dialog = document.querySelector("#cv-dialog");
    const trigger = document.querySelector(".cv-trigger");
    const frame = dialog.querySelector("iframe");
    const languages = [...dialog.querySelectorAll("[data-cv-language]")];

    function showPdf(language) {
        const file = `assets/pdf/fajar-januriawan-cv-${language}.pdf`;
        frame.src = `${file}#view=FitH`;
        frame.title = `${window.siteI18n.t("CV PDF preview")} / ${language === "id" ? "Bahasa Indonesia" : "English"}`;
        dialog.querySelector(".cv-download").href = file;
        dialog.querySelector(".cv-download").download = `fajar-januriawan-cv-${language}.pdf`;
        dialog.querySelector(".cv-open").href = file;
        for (const button of languages) {
            button.setAttribute("aria-pressed", String(button.dataset.cvLanguage === language));
        }
    }

    trigger.addEventListener("click", () => {
        showPdf(window.siteI18n.language);
        dialog.showModal();
    });
    for (const button of languages) {
        button.addEventListener("click", () => showPdf(button.dataset.cvLanguage));
    }
    dialog.querySelector(".cv-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => frame.removeAttribute("src"));
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
})();
