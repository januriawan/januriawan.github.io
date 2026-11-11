# Portfolio design and verification

Reviewed 11 November 2026. Current files: `index.html`, `css/portfolio.css`, `css/hero-scene.css`, `css/tailwind-style.css`, `css/project-explorer.css`, `css/theme.css`, `js/portfolio.js`, `js/project-explorer.js`, and local Font Awesome assets under `css/vendor/fontawesome/`.

The owner's clarified direction is a Tailwind-style redesign with rounded buttons, exact #023aef accents, and faint neutral blue-grey backgrounds without the previous lavender/indigo cast. Backgrounds should remain subtle rather than becoming saturated blue. Earlier requirements remain: readable text, animated seaside illustration, rotating introduction phrases, portrait only in the sidebar, and 35 institution projects with descriptions and filters. ENERGY 2 / RHYTHM 2 / MOTION 2. Antislop mode: during, selected by the owner for this session.

The visual style is implemented in local CSS. Tailwind itself is not installed and no browser compiler or framework CDN is required. The base stylesheet supplies layout and behavior styles; `tailwind-style.css` supplies the current palette, typography, surfaces and control styling. `hero-scene.css` retains the original seaside concept.

Following the owner's screenshot feedback, the introduction now has a shorter composition, less top/bottom padding, no extra heading row, a consistent 20px title-to-description gap, shorter secondary action text, and a smaller lighthouse. In Chrome at a 1440px viewport, the hero measured 601px tall with a 67.16px animated heading. These are layout measurements, not performance scores.

The owner explicitly requested Font Awesome. Font Awesome Free 6.7.2 solid and brand assets are now hosted locally, following the [official webfont setup](https://docs.fontawesome.com/web/setup/host-yourself/webfonts/). Only the core/solid/brands styles and their two WOFF2 files are included; upstream license and attribution are preserved in `css/vendor/fontawesome/LICENSE.txt`.

Design decisions:

- The owner requested an optional dark mode with light as the default. A labelled native switch appears in the sidebar with checked state and a moving thumb. Every load starts light, regardless of OS preference; no stored preference is read or written. Without JavaScript the page stays light and the inactive switch is hidden. Dark mode uses slate surfaces (#15202e / #1d2b3d / #1f2e40), avoiding pure black. Primary actions retain #023aef; text links use a lighter blue for contrast on dark surfaces. Logo artwork and screenshots retain their original colors, with white logo backplates for legibility. The seaside animation and its pause/reduced-motion behavior remain independent of the theme switch.

- Slate text, a pale slate page background and white panels provide the neutral hierarchy requested by the owner. The owner's exact accent, `#023aef`, now distinguishes primary actions, icons, links and selected controls; hover and soft-surface variants derive from that royal-blue direction.
- Introduction and contact panels use a neutral blue-grey surface (#f4f7fa), with dark slate headings/body and exact #023aef emphasis. Sky, clouds, water and borders use desaturated steel-blue neutrals to remove the earlier lavender cast. The sidebar and long-form reading sections remain white.
- A system sans-serif font matches the requested visual language and removes the remote font dependency.
- Font Awesome icons identify navigation destinations, social profiles, service categories, search, contact and real button actions. Icons accompanying labels are decorative to assistive technology; icon-only social links have accessible names. Menu and animation symbols update with their actual state.
- Spacing follows consistent 4px-based steps. Phone panels have smaller padding; desktop panels gain room without changing the content order.
- The animated heading grid reserves the tallest phrase's intrinsic height rather than an extra blank line. A solid neutral copy surface preserves text contrast throughout the sky animation; smaller phone actions can share a row. Day/night colors stay within the same desaturated blue-grey family.
- Following the owner's gradient feedback, the illustration uses one desktop edge feather, with the stacked vertical mask removed. Water uses a flat muted surface; its surface, plants and boat stay above the feather so they remain crisp. Day/night sky colors are close in lightness, the beam is restrained, and the coordinated cycle is 32 seconds with ease-in-out timing.
- Buttons use a full radius as explicitly requested. Inputs use a 12px radius, cards 16–20px, and large desktop sections 24px.
- Project cards use borders and screenshot crops to make the supplied work scannable. Eleven previews open native detail dialogs and full-size scrollable images; projects without screenshots keep text entries without fabricated imagery. Shared search and agency filters apply to both views. Preview labels stay visible without requiring hover. Reduced motion removes image hover animation.
- Disclosure cards keep all six services individually identifiable. Institution filters have rounded outlines and a filled selected state.
- Primary buttons use #023aef with white text; secondary actions use white surfaces with royal-blue labels. The contact form and its inputs remain white with dark labels. Focus indicators use royal blue against the light surfaces.
- The owner's requested contact pattern uses faint repeating wave contours in #023aef at 4.5% opacity, connecting that section to the seaside introduction. It is decorative CSS beneath content, does not intercept pointer input, and leaves the form on an opaque white surface.
- The seaside illustration and three rotating phrases retain shared pause/play control. Reduced-motion mode disables their animations and displays the phrases statically.
- All 36 institution projects and 2 other works remain in static HTML. KUmeet is the newly supplied Kemendag project. Search/filter controls progressively enhance the directory; without JavaScript, all 38 entries remain readable. A matching project without an image offers switching to the full list; failed images show readable fallback text while preserving project details.
- Content provenance, the PPID deduplication, official naming references, and the owner's clarification of New Era Office (NEO) are recorded in [PORTFOLIO-CONTENT.md](PORTFOLIO-CONTENT.md).
- All 13 supplied partner logos now appear in two groups: six institution/program logos and seven brand/community logos. Visible captions identify each organization; centered wrapping cards use two, three or four columns and contained images. All PNGs were renamed descriptively without image modification; the complete mapping is in [PORTFOLIO-CONTENT.md](PORTFOLIO-CONTENT.md).

Verification used installed Google Chrome through Playwright, file-based and local HTTP page loading, screenshot inspection, axe-core WCAG A/AA scans and the antislop contrast calculator. QA dependencies and scripts were kept outside the repository in `/tmp`. No repository package dependency was added.

| Rule | Status and evidence |
| --- | --- |
| R-01 | PASS: exact #023aef remains the strong accent. Hero/contact backgrounds are neutral #f4f7fa, and the illustration uses muted steel-blue colors rather than lavender tints. No vertical water gradient or stacked mask remains. |
| R-02 | PASS: existing English page and Indonesian directory copy retained; no new marketing claims or em dashes. |
| R-03 | PASS: 320, 375, 390, 620, 720, 768, 900, 1024, 1050, 1280, 1440, 1920px checked without horizontal overflow or text/controls extending outside the viewport. |
| R-04 | PASS: owner-requested Font Awesome Free icons communicate navigation, brand destinations, services and actions; 34 rendered glyph mappings verified. No generated icons. |
| R-05 | PASS: portrait sidebar, animated introduction, biography, experience cards, service disclosures, screenshot gallery, institution directory and contact retain content-driven compositions. |
| R-06 | PASS: system sans-serif matches the requested style and avoids remote fonts; fluid heading sizes and smaller phone spacing preserve readability. |
| R-07 | PASS: owner-requested subtle wave pattern is limited to Contact, with its seaside-identity purpose recorded above; no pattern is added to unrelated sections. |
| R-08 | PASS: existing arrows indicate navigation, scrolling or opening details. |
| R-09 | PASS: rounded institution count labels display actual project counts; no decorative status badges or dots. |
| R-10 | PASS: no glass effects. |
| R-11 | PASS: full-radius buttons explicitly requested; consistent input/card/section radius levels recorded above. |
| R-12 | PASS: small project/input shadows distinguish those surfaces; dialog shadow separates the modal from its backdrop. |
| R-13 | PASS: no decorative glow. |
| R-14 | PASS: real screenshots in the selected gallery; text cards provide each institution project's supplied title and description. |
| R-15 | PASS: action labels retain their real outcomes, including view work, create email draft, project details and reset filters. |
| R-16 | PASS: service and project descriptions retained without invented claims. |
| R-17 | PASS: experience figure retained from the original; 36 institution projects verified at 28 Kemendag, 6 PIP and 2 Setneg/GIZ, plus 2 other works. |
| R-18 | PASS: no testimonials. |
| R-19 | PASS: title and seaside animations remain owner-requested; shared pause/resume verified; reduced-motion mode has no active scene/title animations. |
| R-20 | PASS: original identity, portrait, real projects and seaside concept retained; all 13 owner-supplied partner logos now have matching names and captions. |
| R-21 | PASS: default light theme and owner-requested optional dark theme; the labelled switch changes surfaces, text, form controls, dialogs and scene colors. Primary accent stays #023aef. |
| R-22 | PASS: existing seaside illustration concept and original screenshots retained; no new visual assets generated. |
| R-23 | PASS: style/radius and Font Awesome directions explicitly supplied by owner; original icon assets obtained upstream with license preserved. No invented photos, project metrics, destinations or navigation sections. |
| R-24 | PASS: all five desktop and mobile navigation anchors exercised; identity and footer return to Home; no new destinations. |
| R-25 | PASS: axe scans report zero violations at 1440/768/390px and with menu/dialog open. White text on #023aef and #023aef text on white both measure 7.36:1; slate body text on slate-50 measures 7.24:1. Focus colors follow the adjacent light or blue surface. |
| R-26 | PASS: filters, search, reset, six disclosures, dialog open/close, navigation, mail-draft feedback, and animation control exercised; external links clicked with remote requests intercepted. |
| R-27 | PASS: static local directory has an explicit no-results state and reset; no network-dependent data fetch. Contact retains validation and email-app fallback guidance. |
| R-28 | PASS: no FAQ. |
| R-29 | PASS: centralized slate/royal-blue palette with exact accent #023aef; warm colors remain only in the original seaside artwork. |
| R-30 | PASS: requested Tailwind visual language applied to the existing portfolio rather than copying an unrelated product. |
| R-31 | PASS: reasons for palette, typography, layout, spacing, card treatment, radii, shadows and motion recorded above. |
| R-32 | PASS: visible focus, keyboard skip link, mobile menu Escape, native disclosures, dialog Escape and filter controls retained; menu and skip-link keyboard actions exercised. |
| R-33 | PASS: direct HTML/CSS edits with standard formatting; no external source-rewriting feature scripts. |
| R-34 | PASS: royal-blue introduction/contact treatment checked across desktop/mobile; illustration day/night remains functional, with open menu/dialog states scanned. |
| R-35 | PASS: page run in Chrome, screenshots inspected and control actions recorded below; no JavaScript errors, JS syntax check and git whitespace check passed. |
| R-36 | PASS: KUmeet description follows the supplied screenshot; no invented dates, stack, impact metrics or production URLs. Original Kemendag notes remain specific to that project. |
| R-37 | PASS: owner's explicit Tailwind-style direction and rounded-button requirement applied with dials recorded above. |
| R-38 | PASS: original assets and owner-supplied projects retained; NEO expanded from the owner's clarification. Partner identities come from supplied logos, with programs and brands distinguished from institutions. No new organization links or impact metrics invented. |
| R-39 | PASS: native controls, visible labels, accessible names, image alternatives, landmarks, logical headings, pressed states, focus styles and reduced-motion behavior retained. Zero axe violations at 1440/768/390px and with menu/dialog/empty results/day/night states; 200% text reflow passed. |
| R-40 | PASS: media dimensions preserved, illustration uses CSS, local script is deferred, two Font Awesome WOFF2 fonts load locally without failed requests, and below-fold images remain lazy-loaded. Lighthouse and field Web Vitals were not measured. |

Interaction evidence:

- Theme revision: light default verified under a dark OS preference and after reloading from dark mode. Switch click and keyboard Space update the theme and aria-checked; switching back restores light surfaces. Axe reported zero violations in dark mode at 1440/768/390px, desktop details, and phone menu/service/list/empty/detail/full-image states, plus the restored light page. Both themes had no overflow at 320/390/768/1050/1440px; dark 200% text reflow at 720px passed. Form typing worked, reduced-motion scene had no active animation, and the underwater surface uses the dark palette. Desktop Home/Contact and phone screenshots inspected; no JavaScript errors, syntax/format/whitespace checks passed. The 40-rule gate was rechecked; theme scope changes R-21 and extends R-25/R-26/R-32/R-34/R-39 evidence without changing content or assets.

Current explorer revision supersedes the older directory counts and single-dialog notes below. The 40-rule delivery gate was rechecked for this revision; unchanged hero, contact, services, and partner checks below remain historical regression evidence.

- All 38 project detail dialogs exercised. All 11 previews decode and open in the full-image dialog. Nested Escape closes the image first, then details; focus returns to the originating preview button. Previous/next tracks the active filtered view with disabled boundaries.
- Filter counts: all 11 previews/38 projects; Kemendag 6/28; PIP 2/6; Setneg 1/2; other works 2/2. PPID yields one text project with a switch-to-list action; unknown text yields an explicit empty state; reset restores all records. JavaScript-disabled rendering retains 38 readable entries.
- No horizontal page overflow at 320/375/390/620/720/768/900/1050/1280/1440/1920px. Axe checks reported zero violations for the page at desktop/tablet/phone sizes, desktop/phone details and full-image dialogs, and empty results. Phone details have no horizontal overflow. Failed-image handling was tested by aborting the KUmeet request: an explicit fallback appeared, enlargement was disabled, and the description remained readable. Full-image scroll regions have keyboard focus and accessible labels.
- Eleven portfolio files renamed descriptively and references updated; original binary content retained. No JavaScript errors during the explorer interaction run. Added CSS is confined to portfolio controls/cards/dialogs; accent remains #023aef and hero animation is unchanged.
- Final asset check: every JPEG decodes and its natural dimensions match the HTML declarations; all 11 filenames are unique and mapped. Combined search/filter passed (Kudagang → 5 projects, then PIP → 0). Updated 200% text reflow at 720px passed; reduced-motion scene/title remain paused. JavaScript syntax and git whitespace checks passed. Desktop gallery and phone detail screenshots were visually inspected after the image-frame correction.

- Partners: all 13 PNGs are referenced exactly once and decode successfully; natural dimensions match the declared image sizes, object-fit is contain, and every image has an alt and caption. No numeric or download-style filenames remain. Six institution/program and seven brand/community cards verified. Cards/captions do not overflow at 320/375/390/620/720/768/900/1050/1280/1440/1920px; partner axe scans report zero violations at 1440/390px. All 35 portfolio projects remain present and no JavaScript errors occurred.
- Contact pattern: CSS background present and pointer-events disabled on its pseudo-element; clicking and typing in the form still works. Contact axe scans report zero violations at 1440/390px, with no horizontal overflow. Desktop screenshot reviewed.
- Corrected color cast: browser computed styles confirm neutral #f4f7fa hero background and exact #023aef primary action. The night-phase screenshot was reviewed. Updated axe scans at 1440/768/390px and open menu/dialog found zero violations; no JavaScript errors. Previous layout verification remains applicable because this revision changes colors only.
- Gradient revision: computed styles confirm no stacked mask, no water background image, and a 32-second ease-in-out sky cycle. Day/night screenshots inspected; both phase axe scans reported zero violations. No overflow at 320/390/768/1050/1440px and no JavaScript errors.
- All 34 Font Awesome glyphs map to real icons; solid and brand font faces reached loaded status over local HTTP. No failed resource requests. Decorative icon semantics and social-link names were checked.
- Menu icons: bars → xmark on open, Escape → bars on close. Animation icon: pause → play when paused, play → pause when resumed. Labels remain visible.
- Updated layout/icon scan: zero axe violations at 1440/768/390px, with the mobile menu open, and in the project dialog. Chrome screenshots inspected for the introduction, services and mobile introduction.
- Home, About, Services, Portfolio, Contact: all five desktop and mobile links navigate to their corresponding fragments. On mobile, selecting a destination closes the menu.
- Mobile Menu: opens/closes, Escape closes it, and its rendered radius is full. Identity and footer links return to Home. Keyboard skip link reaches the main content.
- Six service disclosures: each opens and closes after the card redesign.
- Read project details: opens the native dialog. Escape and Close dismiss it; the Close button has a full radius.
- Nineteen visible project/social/directorate links: clicks opened their expected URLs. Remote requests were intercepted for deterministic tests; live remote availability was not checked.
- Directory: 35 entries present; All → 35, Kementerian Perdagangan RI → 27, PIP → 6, Kementerian Sekretariat Negara RI → 2. Search PPID → 1. Unknown search → explicit empty state. Reset → all 35.
- Contact: empty form → required-field validation; invalid email → email validation; completed form → mailto draft and explicit not-yet-sent feedback. No email was sent.
- Animation control: scene and all heading animation timelines freeze together and resume. Reduced-motion mode has zero active scene/title animations.
- Every visible desktop button has a full radius; the mobile Menu and dialog Close controls were also checked separately.
- Without JavaScript: navigation and all 35 institution entries remain available.
- Screenshots inspected for desktop introduction, selected work, institution directory, and mobile introduction. Tests found no horizontal overflow at the twelve widths listed above or at 200% text size in a 720px viewport.

Automated accessibility checks supplement keyboard, contrast and layout verification; this report does not claim complete WCAG conformance. The revised style uses native CSS, not an installed Tailwind framework.
