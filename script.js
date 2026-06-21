/* =========================================================
   SAY PORTFOLIO — script.js
   Renders the entire site from data.json (or, in ?preview=1
   mode, from a localStorage draft saved by editor.html).
   Edit content via editor.html — never edit this file for
   day-to-day content changes.
   ========================================================= */

(function () {
  "use strict";

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.42.36.78 1.08.78 2.18v3.23c0 .31.21.66.79.55C20.71 21.38 24 17.07 24 12 24 5.73 18.27.5 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2H21.5l-7.32 8.37L22.8 22h-6.76l-5.3-6.93L4.62 22H1.36l7.83-8.95L1 2h6.93l4.79 6.34L18.24 2Zm-1.19 18h1.8L7.04 4H5.1l11.95 16Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 4.72 2.6c.46-.16 1.26-.35 2.43-.4 1.27-.06 1.65-.07 4.85-.07Zm0 2.16c-3.15 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.14.87.3 1.83.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a3 3 0 0 0-.74-1.13 3 3 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.59-.07-4.74-.07Zm0 3.68a5.92 5.92 0 1 1 0 11.84 5.92 5.92 0 0 1 0-11.84Zm0 2.16a3.76 3.76 0 1 0 0 7.52 3.76 3.76 0 0 0 0-7.52Zm6.16-2.4a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6.5 12 13l9-6.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 4 5.5v6c0 5 3.4 8.7 8 9.5 4.6-.8 8-4.5 8-9.5v-6L12 2Z"/><path d="m9 12 2 2 4-4"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m6 9 3 3-3 3M12 15h6"/></svg>'
  };

  let DATA = null;

  /* ---------- helpers ---------- */
  function $(sel) { return document.querySelector(sel); }
  function esc(str) {
    if (str === undefined || str === null) return "";
    const d = document.createElement("div");
    d.textContent = String(str);
    return d.innerHTML;
  }

  function isPreviewMode() {
    return new URLSearchParams(window.location.search).get("preview") === "1";
  }

  async function loadData() {
    if (isPreviewMode()) {
      const draft = localStorage.getItem("say_portfolio_draft");
      if (draft) {
        try { return JSON.parse(draft); } catch (e) { /* fall through */ }
      }
    }
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("data.json not found");
    return res.json();
  }

  /* ---------- render: profile / about ---------- */
  function renderProfile(d) {
    document.title = `${d.profile.title} — ${d.profile.shortName}`;
    $("#profilePhoto").src = d.profile.photo;
    $("#profilePhoto").alt = `Portrait of ${d.profile.name}`;
    $("#aboutBio").textContent = d.profile.bio;
    $("#footerName").textContent = `© ${new Date().getFullYear()} ${d.profile.shortName}`;

    const meta = $("#aboutMeta");
    meta.innerHTML = "";
    const metaItems = [
      ["Role", d.profile.role],
      ["Location", d.profile.location],
      ["Nationality", d.profile.nationality]
    ];
    metaItems.forEach(([label, val]) => {
      if (!val) return;
      const pill = document.createElement("span");
      pill.className = "meta-pill";
      pill.innerHTML = `<strong>${esc(label)}:</strong> ${esc(val)}`;
      meta.appendChild(pill);
    });

    $("#emailBtn").href = `mailto:${d.profile.email}`;
    $("#callBtn").href = `tel:${d.profile.phone}`;
    if (!d.profile.phone) $("#callBtn").style.display = "none";
  }

  function renderSocials(d) {
    const row = $("#socialRow");
    row.innerHTML = "";
    (d.socials || []).forEach((s) => {
      const a = document.createElement("a");
      a.href = s.url;
      a.className = "social-link";
      a.target = s.url.startsWith("mailto:") ? "_self" : "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", s.platform);
      a.innerHTML = ICONS[s.icon] || ICONS.external;
      row.appendChild(a);
    });
  }

  /* ---------- render: focus areas ---------- */
  function renderFocusAreas(d) {
    const grid = $("#focusGrid");
    grid.innerHTML = "";
    (d.focusAreas || []).forEach((f) => {
      const card = document.createElement("div");
      card.className = "focus-card";
      card.innerHTML = `
        <div class="focus-icon">${ICONS[f.icon] || ICONS.terminal}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.description)}</p>`;
      grid.appendChild(card);
    });
  }

  /* ---------- render: education / experience timelines ---------- */
  function renderTimeline(containerId, items, emptyId, emptyText) {
    const container = $(containerId);
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.style.display = "none";
      if (emptyId) {
        const e = $(emptyId);
        e.textContent = emptyText || "Nothing here yet.";
        e.hidden = false;
      }
      return;
    }
    container.style.display = "";
    if (emptyId) $(emptyId).hidden = true;

    items.forEach((item) => {
      const isCurrent = item.status === "current";
      const wrap = document.createElement("div");
      wrap.className = "timeline-item" + (isCurrent ? " current" : "");
      wrap.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <h3>${esc(item.degree || item.role)}</h3>
          <div class="org">${esc(item.institution || item.organization || "")}</div>
          <div class="meta-row">
            ${item.period ? `<span class="badge${isCurrent ? " ongoing" : ""}">${esc(item.period)}</span>` : ""}
            ${item.level ? `<span class="badge">${esc(item.level)}</span>` : ""}
          </div>
        </div>`;
      container.appendChild(wrap);
    });
  }

  /* ---------- render: projects ---------- */
  function renderProjects(d) {
    const grid = $("#projectGrid");
    grid.innerHTML = "";
    (d.projects || []).forEach((p) => {
      const card = document.createElement("a");
      card.className = "project-card";
      card.href = p.githubUrl;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `Open ${p.title} on GitHub`);
      card.innerHTML = `
        <img class="project-thumb" src="${esc(p.image)}" alt="${esc(p.title)} preview" loading="lazy">
        <div class="project-body">
          <span class="project-cat">${esc(p.category || "Project")}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="tag-row">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <span class="project-link">View Repository ${ICONS.external}</span>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ---------- render: simple info card lists ---------- */
  function renderCardList(containerId, items, fields, emptyId, emptyText) {
    const container = $(containerId);
    container.innerHTML = "";
    if (!items || items.length === 0) {
      if (emptyId) {
        const e = $(emptyId);
        e.textContent = emptyText || "Nothing here yet.";
        e.hidden = false;
      }
      return;
    }
    if (emptyId) $(emptyId).hidden = true;
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "info-card";
      const dateHtml = fields.date && item[fields.date] ? `<span class="info-date">${esc(item[fields.date])}</span>` : "";
      card.innerHTML = `
        ${dateHtml}
        <h3>${esc(item[fields.title])}</h3>
        <p>${esc(item[fields.desc])}</p>`;
      container.appendChild(card);
    });
  }

  function renderCollaboration(d) {
    const c = d.collaboration || {};
    $("#collabHeading").textContent = c.heading || "Open to Collaboration";
    $("#collabDescription").textContent = c.description || "";
    renderCardList("#collabList", c.items, { title: "title", desc: "description", date: "date" }, null, "");
  }

  /* ---------- hero typing animation ---------- */
  function typeText(el, text, speed) {
    return new Promise((resolve) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = text;
        resolve();
        return;
      }
      let i = 0;
      el.textContent = "";
      const timer = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  async function runHeroSequence(d) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0 : 28;

    await typeText($("#typeWhoami"), "whoami", speed);
    await typeText($("#typeName"), d.profile.name, speed);
    await typeText($("#typeRole"), "cat role.txt", speed);
    await typeText($("#typeRoleOut"), `${d.profile.role} — ${d.profile.tagline}`, speed);
    await typeText($("#typeStatus"), "status --check", speed);
    $("#availabilityText").textContent = d.profile.availability || "Available";
    $("#finalCursor").style.display = "none";

    const actions = $("#heroActions");
    actions.style.transition = "opacity 0.6s ease";
    actions.style.opacity = "1";
  }

  /* ---------- nav interactions ---------- */
  function setupNav() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const links = $("#navLinks");

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    });

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupCopyEmail(d) {
    const btn = $("#copyEmailBtn");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(d.profile.email);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = original; }, 1800);
      } catch (e) {
        window.prompt("Copy email address:", d.profile.email);
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    const targets = document.querySelectorAll(".focus-card, .project-card, .timeline-item, .info-card, .empty-state");
    if (!("IntersectionObserver" in window)) return;
    targets.forEach(t => { t.style.opacity = "0"; t.style.transform = "translateY(16px)"; t.style.transition = "opacity 0.5s ease, transform 0.5s ease"; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- init ---------- */
  async function init() {
    setupNav();
    try {
      DATA = await loadData();
    } catch (err) {
      $("#dataError").hidden = false;
      console.error(err);
      return;
    }

    renderProfile(DATA);
    renderSocials(DATA);
    renderFocusAreas(DATA);
    renderTimeline("#educationTimeline", DATA.education, null, "");
    renderProjects(DATA);
    renderCardList("#achievementsList", DATA.achievements, { title: "title", desc: "description", date: "date" }, "#achievementsEmpty", DATA.achievementsEmptyText);
    renderCardList("#researchList", DATA.research, { title: "title", desc: "description", date: "date" }, "#researchEmpty", DATA.researchEmptyText);
    renderCollaboration(DATA);
    renderTimeline("#experienceTimeline", DATA.experience, "#experienceEmpty", DATA.experienceEmptyText);
    setupCopyEmail(DATA);

    runHeroSequence(DATA);
    setupReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
