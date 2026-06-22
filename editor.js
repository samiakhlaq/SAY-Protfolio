/* =========================================================
   SAY PORTFOLIO — editor.js
   Password-gated dashboard for editing data.json visually.

   IMPORTANT — read this:
   This is a STATIC site with no backend or database. The
   password check happens entirely in the browser, so it is
   a convenience lock (keeps casual visitors out of the
   dashboard), not real security — anyone who reads this file
   could bypass it. Don't put anything truly sensitive behind it.

   Editing here updates a DRAFT saved in this browser's
   localStorage. To make changes visible to everyone who visits
   your site, click "Export data.json" and replace the
   data.json file in your project folder, then redeploy.
   ========================================================= */

(function () {
  "use strict";

  const DEFAULT_PASSWORD_HASH = "5d2752214e579be88d6991795e0843f81018c3d900445b8c320c75522d07fc92"; // SamiAkhlaq2026
  const PW_HASH_KEY = "say_editor_pw_hash";
  const AUTH_SESSION_KEY = "say_editor_auth";
  const DRAFT_KEY = "say_portfolio_draft";

  const ICON_OPTIONS = ["github", "linkedin", "x", "facebook", "instagram", "mail", "phone", "shield", "cpu", "chart", "terminal", "external"];

  let DATA = null;
  let activeSection = "profile";
  let autosaveTimer = null;

  /* =========================================================
     AUTH
     ========================================================= */
  async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function getStoredHash() {
    return localStorage.getItem(PW_HASH_KEY) || DEFAULT_PASSWORD_HASH;
  }

  async function tryLogin(password) {
    const hash = await sha256Hex(password);
    return hash === getStoredHash();
  }

  function setupLogin() {
    const form = document.getElementById("loginForm");
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("loginError");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await tryLogin(input.value);
      if (ok) {
        sessionStorage.setItem(AUTH_SESSION_KEY, "1");
        enterDashboard();
      } else {
        error.hidden = false;
        input.value = "";
        input.focus();
      }
    });
  }

  function enterDashboard() {
    document.getElementById("loginScreen").hidden = true;
    document.getElementById("dashboard").hidden = false;
    if (!DATA) loadDashboardData();
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    location.reload();
  });

  /* =========================================================
     DATA LOADING / SAVING
     ========================================================= */
  async function loadDashboardData() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        DATA = JSON.parse(draft);
        updateSaveStatus("saved", "Draft loaded from this browser");
        renderSection(activeSection);
        return;
      } catch (e) { /* fall through to fetch */ }
    }
    try {
      const res = await fetch("data.json", { cache: "no-store" });
      DATA = await res.json();
      updateSaveStatus("clean", "Loaded data.json — no edits yet");
      renderSection(activeSection);
    } catch (e) {
      document.getElementById("editorMain").innerHTML =
        `<p class="editor-section-desc">Couldn't load data.json. If you opened this file directly, run a local server (e.g. <code>python -m http.server</code>) and open the dashboard through it.</p>`;
    }
  }

  function persistDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(DATA));
    updateSaveStatus("saved", "Draft saved in this browser — " + new Date().toLocaleTimeString());
  }

  function scheduleAutosave() {
    updateSaveStatus("dirty", "Unsaved changes…");
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(persistDraft, 600);
  }

  function updateSaveStatus(state, text) {
    const el = document.getElementById("saveStatus");
    el.textContent = text || "";
    el.className = "save-status " + state;
  }

  document.getElementById("resetBtn")?.addEventListener("click", () => {
    if (!confirm("Discard your local draft and reload the original data.json? This cannot be undone.")) return;
    localStorage.removeItem(DRAFT_KEY);
    DATA = null;
    loadDashboardData();
  });

  document.getElementById("exportBtn")?.addEventListener("click", () => {
    persistDraft();
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Exported data.json — replace it in your project folder and redeploy.");
  });

  document.getElementById("previewBtn")?.addEventListener("click", () => {
    persistDraft();
    window.open("index.html?preview=1", "_blank");
  });

  function showToast(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* =========================================================
     SIDEBAR NAV
     ========================================================= */
  function setupSidebar() {
    document.querySelectorAll(".sidebar-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-link").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeSection = btn.dataset.section;
        renderSection(activeSection);
      });
    });
  }

  function renderSection(section) {
    if (!DATA) return;
    const main = document.getElementById("editorMain");
    main.innerHTML = "";
    const renderers = {
      profile: renderProfileSection,
      socials: renderSocialsSection,
      education: renderEducationSection,
      focusAreas: renderFocusAreasSection,
      projects: renderProjectsSection,
      achievements: () => renderSimpleListSection("achievements", "achievementsEmptyText", "Achievement", [
        { key: "title", label: "Title", type: "text" },
        { key: "date", label: "Date / Year", type: "text" },
        { key: "description", label: "Description", type: "textarea" }
      ]),
      research: () => renderSimpleListSection("research", "researchEmptyText", "Research Item", [
        { key: "title", label: "Title", type: "text" },
        { key: "date", label: "Date / Year", type: "text" },
        { key: "description", label: "Description", type: "textarea" }
      ]),
      collaboration: renderCollaborationSection,
      experience: renderExperienceSection,
      settings: renderSettingsSection
    };
    (renderers[section] || renderers.profile)();
  }

  /* =========================================================
     FORM HELPERS
     ========================================================= */
  function sectionHeader(main, title, desc) {
    const h = document.createElement("h2");
    h.className = "editor-section-title";
    h.textContent = title;
    main.appendChild(h);
    if (desc) {
      const p = document.createElement("p");
      p.className = "editor-section-desc";
      p.textContent = desc;
      main.appendChild(p);
    }
  }

  function field({ label, value, type = "text", placeholder = "", options = [], full = false, onChange }) {
    const wrap = document.createElement("div");
    wrap.className = full ? "field-full" : "";
    const lbl = document.createElement("label");
    lbl.className = "field-label";
    lbl.textContent = label;
    wrap.appendChild(lbl);

    let input;
    if (type === "textarea") {
      input = document.createElement("textarea");
      input.className = "textarea-input";
      input.value = value || "";
    } else if (type === "select") {
      input = document.createElement("select");
      input.className = "select-input";
      options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.value === value) o.selected = true;
        input.appendChild(o);
      });
    } else {
      input = document.createElement("input");
      input.type = type === "url" ? "url" : type === "email" ? "email" : "text";
      input.className = "text-input";
      input.value = value || "";
    }
    if (placeholder) input.placeholder = placeholder;
    input.addEventListener("input", () => {
      onChange(input.value);
      scheduleAutosave();
    });
    wrap.appendChild(input);
    return wrap;
  }

  function imageField({ value, hint, onChange }) {
    const tpl = document.getElementById("imageFieldTemplate");
    const node = tpl.content.cloneNode(true);
    const wrap = node.querySelector(".image-field");
    const preview = node.querySelector(".image-preview");
    const pathInput = node.querySelector(".image-path-input");
    const fileInput = node.querySelector(".file-picker-input");
    const hintEl = node.querySelector(".image-field-hint");

    preview.src = value || "";
    preview.onerror = () => { preview.style.opacity = "0.25"; };
    preview.onload = () => { preview.style.opacity = "1"; };
    pathInput.value = value || "";
    hintEl.textContent = hint || "Type the path/filename where this image will live, e.g. images/project-name.jpg";

    pathInput.addEventListener("input", () => {
      onChange(pathInput.value);
      preview.src = pathInput.value;
      scheduleAutosave();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      const suggestedName = file.name.toLowerCase().replace(/[^a-z0-9.\-]+/g, "-");
      const suggestedPath = "images/" + suggestedName;
      pathInput.value = suggestedPath;
      onChange(suggestedPath);
      preview.src = URL.createObjectURL(file); // local preview only — not saved anywhere
      hintEl.textContent = `Now save "${file.name}" into your project's images/ folder as "${suggestedName}" so this path resolves on the live site.`;
      scheduleAutosave();
    });

    return wrap;
  }

  function itemHeader(label, onUp, onDown, onRemove) {
    const header = document.createElement("div");
    header.className = "array-item-header";
    const title = document.createElement("span");
    title.className = "array-item-title";
    title.textContent = label;
    const actions = document.createElement("div");
    actions.className = "array-item-actions";

    const up = document.createElement("button");
    up.type = "button"; up.className = "icon-btn"; up.title = "Move up"; up.textContent = "↑";
    up.addEventListener("click", onUp);

    const down = document.createElement("button");
    down.type = "button"; down.className = "icon-btn"; down.title = "Move down"; down.textContent = "↓";
    down.addEventListener("click", onDown);

    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "icon-btn danger"; remove.title = "Remove"; remove.textContent = "✕";
    remove.addEventListener("click", onRemove);

    actions.append(up, down, remove);
    header.append(title, actions);
    return header;
  }

  function addArrayControls(main, arr, label, makeEmptyItem, renderList) {
    // Each section re-runs draw() after every add/remove/move, which calls
    // this again — remove any previous add-button first so they don't stack up.
    main.querySelectorAll(".add-item-btn").forEach(btn => btn.remove());
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "add-item-btn";
    addBtn.textContent = `+ Add ${label}`;
    addBtn.addEventListener("click", () => {
      arr.push(makeEmptyItem());
      scheduleAutosave();
      renderList();
    });
    main.appendChild(addBtn);
  }

  function moveItem(arr, index, dir, rerender) {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    scheduleAutosave();
    rerender();
  }

  function removeItem(arr, index, rerender) {
    if (!confirm("Remove this entry?")) return;
    arr.splice(index, 1);
    scheduleAutosave();
    rerender();
  }

  /* =========================================================
     SECTION: PROFILE
     ========================================================= */
  function renderProfileSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Profile", "Your core identity — shown in the hero, about section and browser tab.");
    const p = DATA.profile;

    const grid = document.createElement("div");
    grid.className = "form-grid";
    grid.append(
      field({ label: "Full Name", value: p.name, onChange: v => p.name = v }),
      field({ label: "Short Name (footer/title)", value: p.shortName, onChange: v => p.shortName = v }),
      field({ label: "Site Title", value: p.title, onChange: v => p.title = v }),
      field({ label: "Role / Headline", value: p.role, onChange: v => p.role = v }),
      field({ label: "Tagline", value: p.tagline, full: true, onChange: v => p.tagline = v }),
      field({ label: "Bio", value: p.bio, type: "textarea", full: true, onChange: v => p.bio = v }),
      field({ label: "Location", value: p.location, onChange: v => p.location = v }),
      field({ label: "Nationality", value: p.nationality, onChange: v => p.nationality = v }),
      field({ label: "Email", value: p.email, type: "email", onChange: v => p.email = v }),
      field({ label: "Phone", value: p.phone, onChange: v => p.phone = v }),
      field({ label: "Availability Status", value: p.availability, full: true, onChange: v => p.availability = v })
    );
    main.appendChild(grid);

    const imgLabel = document.createElement("label");
    imgLabel.className = "field-label";
    imgLabel.textContent = "Profile Photo";
    imgLabel.style.marginTop = "18px";
    main.appendChild(imgLabel);
    main.appendChild(imageField({
      value: p.photo,
      hint: "Recommended: a square photo, e.g. images/profile.jpg",
      onChange: v => p.photo = v
    }));
  }

  /* =========================================================
     SECTION: SOCIALS
     ========================================================= */
  function renderSocialsSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Social Links", "Shown as icon buttons in the contact section.");
    const list = document.createElement("div");
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      DATA.socials.forEach((s, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(s.platform || `Link ${i + 1}`,
          () => moveItem(DATA.socials, i, -1, draw),
          () => moveItem(DATA.socials, i, 1, draw),
          () => removeItem(DATA.socials, i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({ label: "Platform Name", value: s.platform, onChange: v => s.platform = v }),
          field({ label: "Icon", value: s.icon, type: "select", options: ICON_OPTIONS.map(o => ({ value: o, label: o })), onChange: v => s.icon = v }),
          field({ label: "URL", value: s.url, type: "url", full: true, onChange: v => s.url = v })
        );
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, DATA.socials, "Social Link", () => ({ platform: "New Link", url: "https://", icon: "external" }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: EDUCATION
     ========================================================= */
  function renderEducationSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Education", "Shown as a timeline. Mark your current program as \"Ongoing\".");
    const list = document.createElement("div");
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      DATA.education.forEach((ed, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(ed.degree || `Entry ${i + 1}`,
          () => moveItem(DATA.education, i, -1, draw),
          () => moveItem(DATA.education, i, 1, draw),
          () => removeItem(DATA.education, i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({ label: "Degree / Certificate", value: ed.degree, full: true, onChange: v => ed.degree = v }),
          field({ label: "Institution", value: ed.institution, full: true, onChange: v => ed.institution = v }),
          field({ label: "Level", value: ed.level, onChange: v => ed.level = v }),
          field({ label: "Period (e.g. 2023 – Ongoing)", value: ed.period, onChange: v => ed.period = v }),
          field({
            label: "Status", value: ed.status, type: "select",
            options: [{ value: "current", label: "Ongoing" }, { value: "done", label: "Completed" }],
            onChange: v => ed.status = v
          })
        );
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, DATA.education, "Education Entry",
        () => ({ degree: "New Degree", institution: "Institution Name", level: "", period: "", status: "done" }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: FOCUS AREAS
     ========================================================= */
  function renderFocusAreasSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Focus Areas", "Short cards under the About section describing what you work on.");
    const list = document.createElement("div");
    main.appendChild(list);
    const iconOpts = ["shield", "cpu", "chart", "terminal"];

    function draw() {
      list.innerHTML = "";
      DATA.focusAreas.forEach((f, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(f.title || `Area ${i + 1}`,
          () => moveItem(DATA.focusAreas, i, -1, draw),
          () => moveItem(DATA.focusAreas, i, 1, draw),
          () => removeItem(DATA.focusAreas, i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({ label: "Title", value: f.title, onChange: v => f.title = v }),
          field({ label: "Icon", value: f.icon, type: "select", options: iconOpts.map(o => ({ value: o, label: o })), onChange: v => f.icon = v }),
          field({ label: "Description", value: f.description, type: "textarea", full: true, onChange: v => f.description = v })
        );
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, DATA.focusAreas, "Focus Area",
        () => ({ title: "New Focus Area", description: "", icon: "terminal" }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: PROJECTS
     ========================================================= */
  function slugify(str) {
    return (str || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function tagsToString(arr) { return (arr || []).join(", "); }
  function stringToTags(str) { return str.split(",").map(t => t.trim()).filter(Boolean); }

  function renderProjectsSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Projects", "Each card links straight to its GitHub repo. Upload a picture using the file picker below — it sets the right filename automatically.");
    const list = document.createElement("div");
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      DATA.projects.forEach((proj, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(proj.title || `Project ${i + 1}`,
          () => moveItem(DATA.projects, i, -1, draw),
          () => moveItem(DATA.projects, i, 1, draw),
          () => removeItem(DATA.projects, i, draw)));

        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({
            label: "Title", value: proj.title, onChange: v => {
              proj.title = v;
              if (!proj._idLocked) proj.id = slugify(v);
            }
          }),
          field({ label: "Category", value: proj.category, onChange: v => proj.category = v }),
          field({ label: "GitHub URL", value: proj.githubUrl, type: "url", full: true, onChange: v => proj.githubUrl = v }),
          field({ label: "Description", value: proj.description, type: "textarea", full: true, onChange: v => proj.description = v }),
          field({ label: "Tags (comma separated)", value: tagsToString(proj.tags), full: true, onChange: v => proj.tags = stringToTags(v) })
        );
        item.appendChild(grid);

        const imgLabel = document.createElement("label");
        imgLabel.className = "field-label";
        imgLabel.textContent = "Project Picture";
        imgLabel.style.marginTop = "10px";
        item.appendChild(imgLabel);
        item.appendChild(imageField({
          value: proj.image,
          hint: "Default placeholder shown. Pick a screenshot to auto-fill the filename, e.g. images/" + (proj.id || "project") + ".jpg",
          onChange: v => proj.image = v
        }));

        list.appendChild(item);
      });
      addArrayControls(main, DATA.projects, "Project", () => ({
        id: "new-project", title: "New Project", category: "Project",
        description: "", image: "images/placeholder.svg", githubUrl: "https://github.com/samiakhlaq/", tags: []
      }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: ACHIEVEMENTS / RESEARCH (shared simple-list shape)
     ========================================================= */
  function renderSimpleListSection(dataKey, emptyTextKey, label, fieldDefs) {
    const main = document.getElementById("editorMain");
    sectionHeader(main, label + "s", `Shown as cards. If the list is empty, the message below is shown instead.`);

    main.appendChild(field({
      label: `Empty-state message`, value: DATA[emptyTextKey], type: "textarea", full: true,
      onChange: v => DATA[emptyTextKey] = v
    }));

    const list = document.createElement("div");
    list.style.marginTop = "18px";
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      DATA[dataKey].forEach((it, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(it.title || `${label} ${i + 1}`,
          () => moveItem(DATA[dataKey], i, -1, draw),
          () => moveItem(DATA[dataKey], i, 1, draw),
          () => removeItem(DATA[dataKey], i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        fieldDefs.forEach(fd => {
          grid.appendChild(field({
            label: fd.label, value: it[fd.key], type: fd.type,
            full: fd.type === "textarea",
            onChange: v => it[fd.key] = v
          }));
        });
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, DATA[dataKey], label, () => {
        const obj = {};
        fieldDefs.forEach(fd => obj[fd.key] = "");
        return obj;
      }, draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: COLLABORATION
     ========================================================= */
  function renderCollaborationSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Collaboration", "An open invitation for other developers, plus optional highlighted items (e.g. a current open call, a hackathon you're forming a team for).");
    const c = DATA.collaboration;

    main.append(
      field({ label: "Heading", value: c.heading, onChange: v => c.heading = v }),
      field({ label: "Description", value: c.description, type: "textarea", full: true, onChange: v => c.description = v })
    );

    const list = document.createElement("div");
    list.style.marginTop = "18px";
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      c.items.forEach((it, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(it.title || `Item ${i + 1}`,
          () => moveItem(c.items, i, -1, draw),
          () => moveItem(c.items, i, 1, draw),
          () => removeItem(c.items, i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({ label: "Title", value: it.title, onChange: v => it.title = v }),
          field({ label: "Date / Status", value: it.date, onChange: v => it.date = v }),
          field({ label: "Description", value: it.description, type: "textarea", full: true, onChange: v => it.description = v })
        );
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, c.items, "Collaboration Item", () => ({ title: "", date: "", description: "" }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: EXPERIENCE
     ========================================================= */
  function renderExperienceSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Work Experience", "Shown as a timeline, same style as Education. Empty by default — add entries as you gain experience.");

    main.appendChild(field({
      label: "Empty-state message", value: DATA.experienceEmptyText, type: "textarea", full: true,
      onChange: v => DATA.experienceEmptyText = v
    }));

    const list = document.createElement("div");
    list.style.marginTop = "18px";
    main.appendChild(list);

    function draw() {
      list.innerHTML = "";
      DATA.experience.forEach((ex, i) => {
        const item = document.createElement("div");
        item.className = "array-item";
        item.appendChild(itemHeader(ex.role || `Role ${i + 1}`,
          () => moveItem(DATA.experience, i, -1, draw),
          () => moveItem(DATA.experience, i, 1, draw),
          () => removeItem(DATA.experience, i, draw)));
        const grid = document.createElement("div");
        grid.className = "form-grid";
        grid.append(
          field({ label: "Role / Title", value: ex.role, onChange: v => ex.role = v }),
          field({ label: "Organization", value: ex.organization, onChange: v => ex.organization = v }),
          field({ label: "Period", value: ex.period, onChange: v => ex.period = v }),
          field({
            label: "Status", value: ex.status, type: "select",
            options: [{ value: "current", label: "Current" }, { value: "done", label: "Past" }],
            onChange: v => ex.status = v
          }),
          field({ label: "Level / Type (e.g. Internship)", value: ex.level, full: true, onChange: v => ex.level = v })
        );
        item.appendChild(grid);
        list.appendChild(item);
      });
      addArrayControls(main, DATA.experience, "Experience Entry",
        () => ({ role: "New Role", organization: "Company / Org", period: "", status: "current", level: "" }), draw);
    }
    draw();
  }

  /* =========================================================
     SECTION: SETTINGS
     ========================================================= */
  function renderSettingsSection() {
    const main = document.getElementById("editorMain");
    sectionHeader(main, "Settings", "Dashboard password and local-draft management.");

    const pwBlock = document.createElement("div");
    pwBlock.className = "settings-block";
    pwBlock.innerHTML = `
      <h3>Change Password</h3>
      <p>This updates the password stored in this browser only. If you log in from another device or clear your browser data, it resets to the default password.</p>
    `;
    const curr = field({ label: "Current Password", type: "text", value: "", onChange: () => {} });
    const next = field({ label: "New Password", type: "text", value: "", onChange: () => {} });
    curr.querySelector("input").type = "password";
    next.querySelector("input").type = "password";
    const grid = document.createElement("div");
    grid.className = "form-grid";
    grid.append(curr, next);
    pwBlock.appendChild(grid);

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-primary btn-sm";
    saveBtn.style.marginTop = "14px";
    saveBtn.textContent = "Update Password";
    saveBtn.addEventListener("click", async () => {
      const currVal = curr.querySelector("input").value;
      const nextVal = next.querySelector("input").value;
      if (!nextVal || nextVal.length < 6) {
        showToast("New password should be at least 6 characters.");
        return;
      }
      const ok = await tryLogin(currVal);
      if (!ok) {
        showToast("Current password is incorrect.");
        return;
      }
      const newHash = await sha256Hex(nextVal);
      localStorage.setItem(PW_HASH_KEY, newHash);
      showToast("Password updated for this browser.");
      curr.querySelector("input").value = "";
      next.querySelector("input").value = "";
    });
    pwBlock.appendChild(saveBtn);

    const warn = document.createElement("div");
    warn.className = "settings-warning";
    warn.textContent = "Heads up: this lock is client-side only, like every password gate on a static site with no server. It keeps casual visitors from finding the dashboard, but isn't a real security boundary — don't store sensitive data here.";
    pwBlock.appendChild(warn);
    main.appendChild(pwBlock);

    const draftBlock = document.createElement("div");
    draftBlock.className = "settings-block";
    draftBlock.innerHTML = `
      <h3>Local Draft</h3>
      <p>Your edits are saved automatically to this browser's storage as you type. Export data.json regularly so you don't lose work if you clear browser data.</p>
    `;
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn btn-ghost btn-sm";
    clearBtn.textContent = "Discard Local Draft";
    clearBtn.addEventListener("click", () => document.getElementById("resetBtn").click());
    draftBlock.appendChild(clearBtn);
    main.appendChild(draftBlock);
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    setupLogin();
    setupSidebar();
    if (sessionStorage.getItem(AUTH_SESSION_KEY) === "1") {
      enterDashboard();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
