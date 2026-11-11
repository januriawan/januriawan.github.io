"use strict";

(() => {
    const root = document.querySelector(".project-directory");
    const $ = (selector) => root.querySelector(selector);
    const dialog = document.querySelector("#project-dialog");
    const zoom = document.querySelector("#project-image-dialog");
    const supportsDialog = typeof dialog.showModal === "function";
    const search = $("#project-search");
    const gallery = $("#project-gallery");
    const groupsContainer = $("#project-groups");
    groupsContainer.append($("#additional-projects"));
    const normalize = (value) =>
        value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("id")
            .replace(/\s+/g, " ")
            .trim();
    const groups = [...root.querySelectorAll(".agency-group")];
    const records = groups.flatMap((group) =>
        [...group.querySelectorAll("[data-project], [data-extra-project]")].map((row, index) => {
            const heading = row.querySelector("h5");
            const record = {
                row,
                group,
                agency: group.dataset.agency,
                organization: group.querySelector("h4").textContent.trim(),
                id:
                    heading.dataset.projectId ||
                    heading.querySelector("[data-project-key]")?.dataset.projectKey ||
                    `${group.dataset.agency}-${index}`,
                title: heading.textContent.replace(/\s+/g, " ").trim(),
                description: row.querySelector("p").textContent.replace(/\s+/g, " ").trim(),
                kind: row.querySelector(".directory-kind").textContent.trim(),
                url: heading.dataset.url,
            };
            record.text = normalize(
                `${record.title} ${record.description} ${record.kind} ${record.organization} ${record.agency}`,
            );
            if (supportsDialog) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "project-title-button";
                button.textContent = record.title;
                button.addEventListener("click", () => openProject(record));
                heading.replaceChildren(button);
            }
            return record;
        }),
    );
    const previews = [...gallery.querySelectorAll("[data-showcase-for]")]
        .map((anchor) => {
            const record = records.find((item) => item.id === anchor.dataset.showcaseFor);
            if (!record) return null;
            const img = anchor.querySelector("img");
            record.preview = {
                src: img.getAttribute("src"),
                width: img.width,
                height: img.height,
                alt: img.alt,
            };
            const card = document.createElement("div");
            card.className = "portfolio-card";
            card.setAttribute("role", "listitem");
            const trigger = document.createElement(supportsDialog ? "button" : "a");
            trigger.className = "gallery-preview";
            if (supportsDialog) {
                trigger.type = "button";
                trigger.addEventListener("click", () => openProject(record));
            } else trigger.href = record.preview.src;
            trigger.setAttribute("aria-label", `Lihat detail: ${record.title}`);
            const label = document.createElement("span");
            label.className = "preview-label";
            label.textContent = "Lihat detail ↗";
            trigger.append(img, label);
            img.addEventListener("error", () => {
                img.hidden = true;
                label.textContent = "Gambar tidak tersedia · Lihat detail ↗";
            });
            const copy = document.createElement("div");
            copy.className = "portfolio-card-copy";
            const organization = document.createElement("p");
            organization.className = "gallery-agency";
            organization.textContent = record.organization;
            const title = document.createElement("h4");
            title.textContent = record.title;
            const description = document.createElement("p");
            description.textContent = record.description;
            copy.append(organization, title, description);
            card.append(trigger, copy);
            anchor.replaceWith(card);
            record.card = card;
            return record;
        })
        .filter(Boolean);
    let agency = "all";
    let mode = "preview";
    let visible = [];
    let activeIndex = 0;
    const filters = [...root.querySelectorAll("[data-agency-filter]")];
    const views = [...root.querySelectorAll("[data-project-view]")];
    function update() {
        const words = normalize(search.value).split(" ").filter(Boolean);
        const matches = records.filter(
            (record) =>
                (agency === "all" || record.agency === agency) &&
                words.every(
                    (word) =>
                        record.text.includes(word) || record.text.replace(/\s/g, "").includes(word),
                ),
        );
        const shownPreviews = previews.filter((record) => matches.includes(record));
        visible = mode === "preview" ? shownPreviews : matches;
        records.forEach((record) => {
            record.row.hidden = !matches.includes(record);
            if (record.card) record.card.hidden = !shownPreviews.includes(record);
        });
        groups.forEach((group) => {
            const count = matches.filter((record) => record.group === group).length;
            group.hidden = count === 0;
            group.querySelector("[data-agency-count]").textContent = `${count} proyek`;
        });
        filters.forEach((button) =>
            button.setAttribute("aria-pressed", String(button.dataset.agencyFilter === agency)),
        );
        views.forEach((button) =>
            button.setAttribute("aria-pressed", String(button.dataset.projectView === mode)),
        );
        $('[data-view-count="preview"]').textContent = shownPreviews.length;
        $('[data-view-count="all"]').textContent = matches.length;
        gallery.hidden = mode !== "preview";
        groupsContainer.hidden = mode !== "all";
        $("#project-results").textContent =
            `${visible.length} ${mode === "preview" ? "pratinjau" : "proyek"} ditampilkan · ${matches.length} dari ${records.length} proyek cocok.`;
        $(".directory-empty").hidden = visible.length > 0;
        $(".directory-empty h4").textContent = matches.length
            ? "Belum ada pratinjau yang sesuai."
            : "Tidak ada proyek yang sesuai.";
        $("#empty-project-message").textContent = matches.length
            ? `Ada ${matches.length} proyek yang cocok. Buka daftar untuk membaca detailnya.`
            : "Coba kata kunci lain atau reset pencarian.";
        $("#show-all-projects").hidden = !matches.length;
    }
    filters.forEach((button) =>
        button.addEventListener("click", () => {
            agency = button.dataset.agencyFilter;
            update();
        }),
    );
    views.forEach((button) =>
        button.addEventListener("click", () => {
            mode = button.dataset.projectView;
            update();
        }),
    );
    search.addEventListener("input", update);
    $("#show-all-projects").addEventListener("click", () => {
        mode = "all";
        update();
        $('[data-project-view="all"]').focus();
    });
    $("#reset-projects").addEventListener("click", () => {
        agency = "all";
        search.value = "";
        update();
        search.focus();
    });
    const expand = document.querySelector("#expand-project-image");
    function loadImage(img, status, preview, onResult = () => {}) {
        img.hidden = true;
        img.removeAttribute("src");
        status.hidden = false;
        status.textContent = "Memuat pratinjau…";
        img.onload = () => {
            img.hidden = false;
            status.hidden = true;
            onResult(true);
        };
        img.onerror = () => {
            img.hidden = true;
            status.hidden = false;
            status.textContent = "Pratinjau tidak dapat dimuat. Detail proyek tetap dapat dibaca.";
            onResult(false);
        };
        img.width = preview.width;
        img.height = preview.height;
        img.alt = preview.alt;
        img.src = preview.src;
    }
    function renderProject(record) {
        document.querySelector("#project-dialog-title").textContent = record.title;
        document.querySelector("#dialog-project-agency").textContent =
            `${record.organization} · ${record.kind}`;
        document.querySelector("#dialog-project-description").textContent = record.description;
        const link = document.querySelector("#dialog-project-link");
        link.hidden = !record.url;
        if (record.url) link.href = record.url;
        else link.removeAttribute("href");
        const notes = document.querySelector("#kemendag-notes");
        notes.hidden = record.id !== "kemendag";
        notes.open = false;
        document.querySelector("#dialog-media").hidden = !record.preview;
        dialog.classList.toggle("has-preview", Boolean(record.preview));
        expand.disabled = true;
        if (record.preview)
            loadImage(
                document.querySelector("#dialog-project-image"),
                document.querySelector("#project-preview-status"),
                record.preview,
                (success) => {
                    expand.disabled = !success;
                },
            );
        document.querySelector("#project-position").textContent =
            `${activeIndex + 1} dari ${visible.length}`;
        document.querySelector("#previous-project").disabled = activeIndex === 0;
        document.querySelector("#next-project").disabled = activeIndex === visible.length - 1;
        dialog.scrollTop = 0;
    }
    function openProject(record) {
        activeIndex = visible.indexOf(record);
        renderProject(record);
        dialog.showModal();
    }
    document
        .querySelector("#previous-project")
        .addEventListener("click", () => renderProject(visible[--activeIndex]));
    document
        .querySelector("#next-project")
        .addEventListener("click", () => renderProject(visible[++activeIndex]));
    expand.addEventListener("click", () => {
        const record = visible[activeIndex];
        document.querySelector("#full-image-title").textContent = record.title;
        loadImage(
            document.querySelector("#full-project-image"),
            document.querySelector("#full-preview-status"),
            record.preview,
        );
        zoom.showModal();
        zoom.querySelector(".full-image-scroll").scrollTop = 0;
    });
    [dialog, zoom].forEach((modal) => {
        modal.querySelector("[data-close-dialog]").addEventListener("click", () => modal.close());
        modal.addEventListener("click", (event) => {
            const bounds = modal.getBoundingClientRect();
            if (
                event.target === modal &&
                (event.clientX < bounds.left ||
                    event.clientX > bounds.right ||
                    event.clientY < bounds.top ||
                    event.clientY > bounds.bottom)
            )
                modal.close();
        });
    });
    update();
    $(".directory-tools").hidden = false;
})();
