/* =====================================================================
   DSFV – fælles header, navigation og footer
   ---------------------------------------------------------------------
   Navigationen er defineret ÉT sted (NAV herunder) og indsættes
   automatisk på alle sider. Vil du tilføje/omdøbe en side, så ret
   kun her – du behøver ikke røre de enkelte HTML-filer.
   ===================================================================== */

const SITE = {
  short: "DSFV",
  name: "Dansk Selskab for Vestibulogi",
  email: "sek@dsfv.dk",
};

const NAV = [
  { label: "Hjem", href: "index.html" },
  {
    label: "Om DSFV",
    children: [
      { label: "Fagområde", href: "fagomraade.html" },
      { label: "Vedtægter", href: "vedtaegter.html" },
      { label: "Bestyrelse", href: "bestyrelse.html" },
      { label: "Stiftelsesreferat", href: "stiftelsesreferat.html" },
    ],
  },
  { label: "Årsmøde 2026", href: "aarsmoede-2026.html" },
  { label: "Bliv medlem", href: "bliv-medlem.html", cta: true },
  { label: "Kontakt", href: "kontakt.html" },
];

/* Logo: tre sammenflettede ringe – en nik til de tre buegange */
const LOGO = `
<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <g fill="none" stroke-width="3.2">
    <circle cx="24" cy="16.5" r="10" stroke="currentColor" opacity=".95"/>
    <circle cx="30.5" cy="28" r="10" stroke="currentColor" opacity=".7"/>
    <circle cx="17.5" cy="28" r="10" stroke="currentColor" opacity=".5"/>
  </g>
</svg>`;

const CHEVRON = `<svg class="chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function currentPage() {
  const last = location.pathname.split("/").pop();
  return last === "" ? "index.html" : last;
}

function buildHeader() {
  const here = currentPage();

  const items = NAV.map((item, i) => {
    if (item.children) {
      const active = item.children.some((c) => c.href === here);
      const sub = item.children
        .map(
          (c) =>
            `<li><a href="${c.href}"${c.href === here ? ' aria-current="page"' : ""}>${c.label}</a></li>`
        )
        .join("");
      return `
        <li class="has-dropdown${active ? " is-active" : ""}">
          <button type="button" aria-expanded="false" aria-controls="dd-${i}">
            ${item.label} ${CHEVRON}
          </button>
          <ul class="dropdown" id="dd-${i}">${sub}</ul>
        </li>`;
    }
    const cur = item.href === here ? ' aria-current="page"' : "";
    return `<li><a href="${item.href}"${cur}${item.cta ? ' class="cta"' : ""}>${item.label}</a></li>`;
  }).join("");

  return `
    <a class="skip-link" href="#indhold">Spring til indhold</a>
    <header class="site-header">
      <div class="container">
        <a class="brand" href="index.html" aria-label="${SITE.short} – forside">
          ${LOGO}
          <span>
            <span class="brand-title">${SITE.short}</span>
            <span class="brand-sub">${SITE.name}</span>
          </span>
        </a>
      </div>
    </header>
    <nav class="site-nav" aria-label="Hovedmenu">
      <div class="container nav-inner">
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-list">
          <span class="burger" aria-hidden="true"></span> Menu
        </button>
        <ul class="nav-list" id="nav-list">${items}</ul>
      </div>
    </nav>`;
}

function buildFooter() {
  const year = new Date().getFullYear();
  const links = NAV.flatMap((n) => (n.children ? n.children : [n]))
    .map((n) => `<li><a href="${n.href}">${n.label}</a></li>`)
    .join("");
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <div class="footer-brand">${LOGO}<strong>${SITE.short}</strong></div>
          <p>${SITE.name} – fagområdeselskab under DSOHH for vestibulogi og otoneurologi.</p>
        </div>
        <div>
          <h2>Sider</h2>
          <ul class="footer-links">${links}</ul>
        </div>
        <div>
          <h2>Kontakt</h2>
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
        </div>
      </div>
      <div class="container footer-bottom">© ${year} ${SITE.name}</div>
    </footer>`;
}

function closeAllDropdowns(except) {
  document.querySelectorAll(".has-dropdown.open").forEach((li) => {
    if (li !== except) {
      li.classList.remove("open");
      li.querySelector("button").setAttribute("aria-expanded", "false");
    }
  });
}

function wireNav() {
  // Dropdowns (klik/tryk – virker både med mus, tastatur og touch)
  document.querySelectorAll(".has-dropdown > button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.parentElement;
      const open = !li.classList.contains("open");
      closeAllDropdowns(li);
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", () => closeAllDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });

  // Mobilmenu
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* Formularer med data-mailto: GitHub Pages har ingen server, så
   formularen samler felterne i en e-mail, som åbnes i brugerens
   mailprogram. Se README for alternativer (fx Formspree). */
function wireMailtoForms() {
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        const field = form.querySelector(`[name="${key}"]`);
        const label = field?.labels?.[0]?.textContent.trim() || key;
        lines.push(`${label}: ${value}`);
      }
      const subject = form.dataset.subject || "Henvendelse via dsfv.dk";
      const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      window.location.href = href;
      const note = form.querySelector(".form-note");
      if (note) note.textContent = "Dit mailprogram er åbnet med beskeden – husk at trykke send.";
    });
  });

  // Indsæt e-mailadressen hvor der står data-email
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = SITE.email;
    if (el.tagName === "A") el.href = `mailto:${SITE.email}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = buildHeader();
  if (f) f.outerHTML = buildFooter();
  wireNav();
  wireMailtoForms();
});
