const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const chunks = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));
const icon = (classes) => `<i class="${esc(classes)} cv-icon" aria-hidden="true"></i>`;

const labels = {
    en: {
        document: "Curriculum vitae & portfolio", role: "Web designer & developer",
        profile: "Profile", experience: "Work experience", skills: "Skills & tools",
        skillsIntro: "Technologies and tools I use for development, AI, infrastructure, and design.",
        social: "Find me online", selected: "Project previews", directory: "Project directory",
        selectedIntro: "A selection of interfaces and websites from my portfolio.",
        directoryIntro: "The complete project list, including projects shown in the previews.",
        contact: "Contact us", contactTitle: "Let's talk.", contactIntro: "Have a project in mind? Get in touch to discuss your website, application, or design needs.",
        email: "Email", location: "Based in", site: "Portfolio", page: "Page", preview: "Preview", project: "Project",
        noLink: "Project details available on my portfolio.", continued: "continued", language: "English",
    },
    id: {
        document: "Curriculum vitae & portofolio", role: "Desainer & pengembang web",
        profile: "Profil", experience: "Riwayat kerja", skills: "Keahlian & perangkat",
        skillsIntro: "Teknologi dan perangkat yang saya gunakan untuk pengembangan, AI, infrastruktur, dan desain.",
        social: "Temukan saya", selected: "Pratinjau proyek", directory: "Daftar proyek",
        selectedIntro: "Pilihan antarmuka dan website dari portofolio saya.",
        directoryIntro: "Daftar proyek lengkap, termasuk proyek yang ditampilkan dalam pratinjau.",
        contact: "Hubungi kami", contactTitle: "Mari berdiskusi.", contactIntro: "Ada proyek yang ingin dikerjakan? Hubungi saya untuk membahas kebutuhan website, aplikasi, atau desain Anda.",
        email: "Email", location: "Lokasi", site: "Portofolio", page: "Halaman", preview: "Pratinjau", project: "Proyek",
        noLink: "Detail proyek tersedia di portofolio saya.", continued: "lanjutan", language: "Bahasa Indonesia",
    },
};

const css = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Arial, sans-serif; color: #142333; font-size: 12px; line-height: 1.6; }
h1,h2,h3,p,ul,ol { margin: 0; } a { color: #023aef; text-decoration: none; overflow-wrap: anywhere; }
.sheet { width: 210mm; height: 297mm; padding: 16mm 16mm 22mm; position: relative; break-after: page; overflow: hidden; }
.sheet:last-child { break-after: auto; }
.masthead { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dce3ed; padding-bottom: 12px; margin-bottom: 28px; font-size: 10px; }
.masthead strong { font-size: 13px; letter-spacing: -.3px; } .muted { color: #536173; }
.section-label { color: #023aef; font-size: 10px; font-weight: 700; margin-bottom: 9px; }
h1 { font-size: 49px; line-height: 1.05; letter-spacing: -2px; font-weight: 800; }
h2 { font-size: 31px; line-height: 1.15; letter-spacing: -1px; margin-bottom: 12px; }
h3 { font-size: 16px; line-height: 1.35; } .intro { color: #536173; max-width: 580px; }
.page-heading { margin-bottom: 28px; }
.cv-icon { display: inline-block; width: 1.25em; margin-right: 5px; text-align: center; }
h2 .cv-icon { color: #023aef; font-size: .65em; vertical-align: .08em; }
.contact-panel h2 .cv-icon { color: white; }
.skill h3 .cv-icon { color: #023aef; }
.tag .cv-icon { font-size: 10px; }
.profile-hero { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: 1fr 116px; gap: 30px; align-items: center; padding: 25px; background: linear-gradient(110deg, #f1f5fb 55%, #e5edff); border-radius: 18px; margin-bottom: 24px; }
.profile-hero > * { position: relative; z-index: 1; }
.profile-hero::before { content: ''; position: absolute; width: 240px; height: 240px; right: -67px; top: -87px; border: 1px solid rgb(2 58 239 / .13); border-radius: 50%; background: rgb(2 58 239 / .04); box-shadow: 0 0 0 24px rgb(2 58 239 / .04), 0 0 0 48px rgb(2 58 239 / .025); }
.profile-hero::after { content: ''; position: absolute; width: 180px; height: 74px; right: 0; bottom: 0; background: repeating-linear-gradient(135deg, transparent 0 12px, rgb(2 58 239 / .09) 12px 13px); mask-image: linear-gradient(110deg, transparent, #000); }
.profile-hero img { width: 116px; height: 116px; object-fit: cover; border-radius: 50%; border: 5px solid white; }
.role { color: #023aef; font-size: 17px; font-weight: 700; margin-top: 12px; }
.profile-copy { display: grid; grid-template-columns: 1.7fr 1fr; gap: 32px; margin-bottom: 28px; }
.profile-copy p + p { margin-top: 9px; } .facts { padding-left: 20px; border-left: 1px solid #dce3ed; font-size: 11px; }
.facts small { display: block; color: #536173; font-size: 10px; } .facts div + div { margin-top: 12px; }
.experience h2 { font-size: 24px; margin-bottom: 14px; }
.job { display: grid; grid-template-columns: 105px 1fr; gap: 18px; padding: 13px 0; border-top: 1px solid #e2e8f0; }
.date { font-size: 10px; color: #023aef; font-weight: 700; } .job h3 { font-size: 14px; } .company { font-weight: 700; font-size: 11px; color: #536173; margin: 2px 0 3px; } .job p:last-child { font-size: 11px; color: #536173; }
.social-row { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; padding-top: 16px; margin-top: 13px; border-top: 1px solid #dce3ed; font-size: 11px; }
.skill { display: grid; grid-template-columns: 180px 1fr; gap: 24px; padding: 21px 0; border-bottom: 1px solid #e2e8f0; }
.skill h3 { font-size: 14px; } .tags { display: flex; flex-wrap: wrap; gap: 6px; } .tag { font-size: 11px; background: #f1f5fb; padding: 4px 9px; border-radius: 5px; }
.preview-grid { display: grid; gap: 22px; } .preview-card { border: 1px solid #dce3ed; border-radius: 0; overflow: hidden; break-inside: avoid; }
.preview-card img { display: block; width: 100%; height: 220px; object-fit: cover; object-position: top; background: #f1f5fb; border-bottom: 1px solid #e2e8f0; }
.preview-copy { padding: 17px 20px; } .eyebrow { color: #536173; font-size: 9px; margin-bottom: 5px; }
.preview-card h3 { font-size: 17px; margin-bottom: 6px; } .preview-card p { font-size: 11px; color: #536173; } .preview-card a { display: inline-block; font-size: 10px; margin-top: 7px; }
.catalog { list-style: none; padding: 0; } .catalog li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; padding: 14px 0; border-top: 1px solid #e2e8f0; }
.catalog .number { color: #023aef; font-weight: 700; font-size: 11px; } .catalog h3 { font-size: 14px; margin-bottom: 4px; } .catalog p { color: #536173; font-size: 11px; line-height: 1.5; } .catalog a { font-size: 10px; } .catalog .eyebrow { margin-bottom: 3px; }
.contact-panel { position: relative; overflow: hidden; background: #023aef; color: white; border-radius: 22px; padding: 44px 36px; margin-top: 65px; min-height: 285px; }
.contact-panel::after { content: ''; position: absolute; width: 270px; height: 270px; border: 1px solid #ffffff33; border-radius: 50%; right: -120px; bottom: -170px; box-shadow: 0 0 0 32px #ffffff10, 0 0 0 64px #ffffff0a; }
.contact-panel h2 { font-size: 44px; max-width: 450px; position: relative; z-index: 1; } .contact-panel p { max-width: 430px; font-size: 14px; margin: 18px 0; } .contact-panel a { color: white; font-size: 20px; font-weight: 700; position: relative; z-index: 1; }
.contact-list { margin-top: 35px; } .contact-list div { display: grid; grid-template-columns: 140px 1fr; padding: 15px 0; border-bottom: 1px solid #e2e8f0; } .contact-list span { color: #536173; }
.footer { position: absolute; bottom: 12mm; left: 16mm; right: 16mm; border-top: 1px solid #dce3ed; padding-top: 10px; display: flex; justify-content: space-between; gap: 18px; font-size: 9px; color: #536173; }
.footer a { color: #536173; }
`;

async function extract(page, source, lang) {
    await page.locator(`[data-language="${lang}"]`).evaluate((button) => button.click());
    return page.evaluate((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const clean = (node) => node?.textContent.replace(/\s+/g, " ").trim() || "";
        const text = (node) => window.siteI18n.t(clean(node));
        const projects = [...doc.querySelectorAll(".agency-group")].flatMap((group) =>
            [...group.querySelectorAll("[data-project], [data-extra-project]")].map((row, index) => {
                const h = row.querySelector("h5");
                return { id: h.dataset.projectId || h.querySelector("[data-project-key]")?.dataset.projectKey || `${group.dataset.agency}-${index}`,
                    title: text(h), description: text(row.querySelector("p")), agency: text(group.querySelector("h4")),
                    kind: text(row.querySelector(".directory-kind")), url: h.dataset.url || "" };
            }));
        const previews = [...doc.querySelectorAll("[data-showcase-for]")].map((anchor) => {
            const project = projects.find((item) => item.id === anchor.dataset.showcaseFor);
            if (!project) throw new Error(`Missing project: ${anchor.dataset.showcaseFor}`);
            return { ...project, image: anchor.querySelector("img").getAttribute("src") };
        });
        return {
            profile: [...doc.querySelectorAll(".about-copy > p")].map(text),
            jobs: [...doc.querySelectorAll(".experience-list > li")].map((row) => ({
                date: text(row.querySelector(".experience-date")), role: text(row.querySelector("h4")),
                company: text(row.querySelector(".company")), description: text(row.querySelector("div > p:last-child")),
            })),
            skills: [...doc.querySelectorAll(".skill-group")].map((group) => ({
                name: text(group.querySelector("h3")), icon: group.querySelector("h3 i").className,
                items: [...group.querySelectorAll("li span")].map(text),
                itemIcons: [...group.querySelectorAll("li i")].map((i) => i.className),
            })),
            social: [...doc.querySelectorAll(".sidebar-bottom .social-links a")].map((a) => ({ name: a.getAttribute("aria-label"), url: a.href, icon: a.querySelector("i").className })),
            projects, previews,
        };
    }, source);
}

function documentHtml(data, lang, images) {
    const l = labels[lang];
    const pages = [];
    const sectionIcons = { "02": "fa-solid fa-laptop-code", "03": "fa-solid fa-images", "04": "fa-solid fa-list-check" };
    const heading = (number, title, intro = "") => `<div class="page-heading"><p class="section-label">${number} / ${esc(l.document)}</p><h2>${icon(sectionIcons[number])}${esc(title)}</h2>${intro ? `<p class="intro">${esc(intro)}</p>` : ""}</div>`;
    const social = data.social.map((s) => `<a href="${esc(s.url)}">${icon(s.icon)}${esc(s.name)} / @januriawan</a>`).join("");
    pages.push({ section: l.profile, body: `
        <div class="profile-hero"><div><p class="section-label">${esc(l.document)}</p><h1>Fajar<br>Januriawan<span style="color:#023aef">.</span></h1><p class="role">${esc(l.role)}</p></div><img src="${pathToFileURL(path.join(root, "img/about/1.png"))}" alt="Fajar Januriawan"></div>
        <div class="profile-copy"><div>${data.profile.map((p) => `<p>${esc(p)}</p>`).join("")}</div><div class="facts"><div><small>${icon("fa-solid fa-location-dot")}${l.location}</small>Jakarta, Indonesia</div><div><small>${icon("fa-solid fa-envelope")}${l.email}</small><a href="mailto:januriawan@duck.com">januriawan@duck.com</a></div><div><small>${icon("fa-solid fa-globe")}${l.site}</small><a href="https://januriawan.my.id/">januriawan.my.id</a></div></div></div>
        <div class="experience"><h2>${icon("fa-solid fa-briefcase")}${l.experience}</h2>${data.jobs.map((j) => `<div class="job"><span class="date">${esc(j.date)}</span><div><h3>${esc(j.role)}</h3><p class="company">${esc(j.company)}</p><p>${esc(j.description)}</p></div></div>`).join("")}</div>
        <div class="social-row"><strong>${l.social}</strong>${social}</div>` });
    pages.push({ section: l.skills, body: heading("02", l.skills, l.skillsIntro) + data.skills.map((s) => `<div class="skill"><h3>${icon(s.icon)}${esc(s.name)}</h3><div class="tags">${s.items.map((item, index) => `<span class="tag">${icon(s.itemIcons[index])}${esc(item)}</span>`).join("")}</div></div>`).join("") });
    for (const [index, group] of chunks(data.previews, 2).entries()) {
        pages.push({ section: l.selected, body: heading("03", l.selected, `${l.selectedIntro} ${index * 2 + 1}–${index * 2 + group.length} / ${data.previews.length}`) + `<div class="preview-grid">${group.map((p) => `<article class="preview-card"><img src="${images.get(p.id)}" alt="${esc(p.title)}"><div class="preview-copy"><div class="eyebrow">${esc(p.agency)} · ${esc(p.kind)}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.url ? `<a href="${esc(p.url)}">${esc(p.url)}</a>` : ""}</div></article>`).join("")}</div>` });
    }
    const catalogPageSize = 6;
    for (const [index, group] of chunks(data.projects, catalogPageSize).entries()) {
        const offset = index * catalogPageSize;
        pages.push({ section: l.directory, body: heading("04", l.directory, `${l.directoryIntro} ${offset + 1}–${offset + group.length} / ${data.projects.length}`) + `<ol class="catalog">${group.map((p, i) => `<li><span class="number">${String(offset + i + 1).padStart(2, "0")}</span><div><div class="eyebrow">${esc(p.agency)} · ${esc(p.kind)}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.url ? `<a href="${esc(p.url)}">${esc(p.url)}</a>` : `<p>${l.noLink}</p>`}</div></li>`).join("")}</ol>` });
    }
    pages.push({ section: l.contact, body: `<p class="section-label">05 / ${l.contact}</p><div class="contact-panel"><h2>${l.contactTitle}</h2><p>${l.contactIntro}</p><a href="mailto:januriawan@duck.com">${icon("fa-solid fa-envelope")}januriawan@duck.com</a></div><div class="contact-list"><div><span>${icon("fa-solid fa-location-dot")}${l.location}</span><strong>Jakarta, Indonesia</strong></div><div><span>${icon("fa-solid fa-globe")}${l.site}</span><a href="https://januriawan.my.id/">januriawan.my.id</a></div>${data.social.map((s) => `<div><span>${icon(s.icon)}${esc(s.name)}</span><a href="${esc(s.url)}">${esc(s.url.replace(/^https:\/\//, ""))}</a></div>`).join("")}</div>` });
    const iconStyles = ["fontawesome", "solid", "brands"].map((name) => `<link rel="stylesheet" href="${pathToFileURL(path.join(root, `css/vendor/fontawesome/css/${name}.min.css`))}">`).join("");
    return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>Fajar Januriawan · CV · ${l.language}</title>${iconStyles}<style>${css}</style></head><body>${pages.map((p, i) => `<section class="sheet"><header class="masthead"><strong>Fajar Januriawan<span style="color:#023aef">.</span></strong><span class="muted">${esc(p.section)} / ${l.language}</span></header>${p.body}<footer class="footer"><span>© ${new Date().getUTCFullYear()} Fajar Januriawan · <a href="https://januriawan.my.id/">januriawan.my.id</a></span><span>${l.page} ${String(i + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}</span></footer></section>`).join("")}</body></html>`;
}

(async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), "januriawan-cv-"));
    const output = path.join(root, "assets/pdf");
    await fs.mkdir(output, { recursive: true });
    const source = await fs.readFile(path.join(root, "index.html"), "utf8");
    const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        await page.goto(pathToFileURL(path.join(root, "index.html")).href);
        const en = await extract(page, source, "en");
        const id = await extract(page, source, "id");
        if (en.projects.length !== 43 || en.previews.length !== 12 || en.skills.length !== 7 || en.jobs.length !== 4) throw new Error("Unexpected source content count; review the CV layout before updating.");
        const images = new Map();
        const cropPage = await browser.newPage({ viewport: { width: 680, height: 230 }, deviceScaleFactor: 1.5 });
        for (const preview of en.previews) {
            const cropPath = path.join(temp, `crop-${preview.id}.html`);
            await fs.writeFile(cropPath, `<style>body{margin:0}img{display:block;width:680px;height:230px;object-fit:cover;object-position:top}</style><img alt="" src="${pathToFileURL(path.join(root, preview.image))}">`);
            await cropPage.goto(pathToFileURL(cropPath).href);
            await cropPage.locator("img").evaluate((img) => img.decode());
            const imagePath = path.join(temp, `${preview.id}.jpg`);
            await cropPage.screenshot({ path: imagePath, type: "jpeg", quality: 86 });
            images.set(preview.id, pathToFileURL(imagePath).href);
        }
        for (const [lang, data] of [["en", en], ["id", id]]) {
            const htmlPath = path.join(temp, `cv-${lang}.html`);
            await fs.writeFile(htmlPath, documentHtml(data, lang, images));
            await page.goto(pathToFileURL(htmlPath).href);
            await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode())));
            await page.evaluate(() => document.fonts.ready);
            const overflow = await page.locator(".sheet").evaluateAll((sheets) => sheets.flatMap((sheet, index) => {
                const footerTop = sheet.querySelector(".footer").getBoundingClientRect().top;
                const content = [...sheet.children].filter((el) => !el.matches(".footer, .masthead"));
                return content.some((el) => el.getBoundingClientRect().bottom > footerTop - 12) ? [index + 1] : [];
            }));
            if (overflow.length) throw new Error(`${lang} content overlaps footer on pages: ${overflow.join(", ")}`);
            const pdfPath = path.join(output, `fajar-januriawan-cv-${lang}.pdf`);
            await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
            console.log(`${path.relative(root, pdfPath)}: ${await page.locator(".sheet").count()} pages, ${data.previews.length} previews, ${data.projects.length} projects`);
        }
    } finally {
        await browser.close();
        await fs.rm(temp, { recursive: true, force: true });
    }
})().catch((error) => { console.error(error); process.exitCode = 1; });
