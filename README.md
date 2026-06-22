# SAY Portfolio — MD Sami Akhlaq

A dark-neon, terminal-themed portfolio site. Every word on the site comes from
`data.json` — you almost never need to touch HTML, CSS, or JS again. Edit
content through the password-protected dashboard at `editor.html`.

---

## 1. Folder structure

Everything lives in **one flat folder** — no `static/css/` nesting, just
direct references like `style.css`, `script.js`.

```
SAY-Portfolio/
├── index.html          ← the public site
├── editor.html          ← password-protected dashboard
├── style.css             ← styles for index.html
├── editor.css           ← extra styles for the dashboard
├── script.js              ← renders index.html from data.json
├── editor.js             ← dashboard logic (auth, forms, export)
├── data.json               ← ALL your content lives here
├── favicon.svg
├── README.md              ← this file
└── images/
    ├── profile.jpg               ← your photo (already added)
    ├── securepass-analyzer.svg   ← placeholder thumbnails (replace anytime)
    ├── tic-tac-toe-3x3.svg
    ├── tic-tac-toe-5x5.svg
    ├── sudoku-solver.svg
    ├── say-portfolio.svg
    ├── qr-code-generator.svg
    ├── codeforces-solutions.svg
    ├── leetcode-solutions.svg
    └── placeholder.svg          ← shown for newly added projects
```

---

## 2. Adding / replacing pictures

Drop image files straight into the `images/` folder. Use these exact rules:

- **Format:** `.jpg`, `.png`, `.webp`, or `.svg` — any of these work fine.
- **Name:** lowercase, words separated by hyphens, no spaces — e.g.
  `securepass-analyzer.jpg`.
- **Profile photo:** replace `images/profile.jpg` with any photo (square
  photos look best, but the layout crops automatically either way).
- **Project pictures:** replace the matching placeholder, e.g. swap
  `images/securepass-analyzer.svg` for `images/securepass-analyzer.jpg`,
  then update the path in the dashboard (Projects → that project → Project
  Picture field) so it points at the new file.

**Easiest method:** open the dashboard (`editor.html`), go to the relevant
section, and use the **"Choose file to preview"** button under any picture
field. It previews your image and automatically fills in the correct
`images/filename.ext` path for you — you just need to make sure a file with
that exact name actually exists in the `images/` folder (the picker can't
save files itself, since this is a static site with no server storage).

---

## 3. Running it locally

Opening `index.html` by double-clicking it won't load `data.json` — browsers
block local file loading for security. Instead, run a tiny local server from
inside the project folder:

```bash
# Python (most systems already have this)
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`. This restriction disappears once the
site is hosted online (GitHub Pages, Netlify, Vercel, etc. all serve files
correctly).

---

## 4. The Editor Dashboard (`editor.html`)

### Logging in
- Default password: **`SamiAkhlaq2026`**
- Change it immediately from **Settings** inside the dashboard.
- Password changes are stored in your browser only (`localStorage`). If you
  log in from a different browser or device, it resets to the default
  password above — that's normal, not a bug.

### ⚠️ Please understand this limitation
This site has **no backend or database** — it's pure HTML/CSS/JS. That means
the password check happens entirely in your browser. Anyone who opens
`editor.js` in dev tools could technically read past it. It's a **soft lock**
to keep casual visitors out of the dashboard, not a real security boundary.
Don't put anything truly sensitive behind it. If you ever need real
authentication, that requires a backend, which is outside the scope of a
static site like this one.

### How editing actually works
1. Open `editor.html` and log in.
2. Edit any section from the sidebar — Profile, Education, Projects,
   Achievements, Research, Collaboration, Experience, Social Links.
3. Every keystroke autosaves a **draft** to your browser's local storage —
   you won't lose work by accident.
4. Click **Preview Site** any time to open `index.html` in a new tab showing
   your draft (this only works in the browser you're editing in).
5. When you're happy, click **Export data.json**. This downloads the updated
   file.
6. Replace the old `data.json` in your project folder with the downloaded
   one, then re-upload / `git push` / redeploy your site.

That last step is the one manual action required — a fully static site has
no way to save changes back to the server by itself. Steps 1–5 mean you're
only ever filling out forms, never editing code.

### Adding / removing / reordering
Every list (projects, education, achievements, research, collaboration
items, experience) has:
- **+ Add** button at the bottom to create a new entry
- **↑ / ↓** to reorder
- **✕** to remove

### Empty sections (Research, Collaboration, Experience)
You currently have no research, collaborations, or work experience —
that's fine. Each section shows a friendly placeholder message instead of an
empty page (editable from the same section in the dashboard). Add real
entries any time, and the section switches to showing cards automatically.

---

## 5. Deploying

The simplest free option is **GitHub Pages**, since all your projects are
already on GitHub:

1. Create a repository (e.g. `SAY-Portfolio`) and push this folder's
   contents to it.
2. In the repo settings, enable **GitHub Pages** → deploy from the `main`
   branch, root folder.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

Any time you export a new `data.json` from the editor, replace the file in
the repo and push again — the live site updates automatically.

Netlify or Vercel work the same way if you'd rather use those (drag-and-drop
the folder, or connect the GitHub repo).

---

## 6. Quick content checklist

- [ ] Swap project placeholder thumbnails for real screenshots
- [ ] Add achievements as you earn them
- [ ] Add research entries once you publish/start something
- [ ] Add work/internship experience when it happens
- [ ] Update the password in Settings
- [ ] Keep `data.json` backed up somewhere (it's your whole site's content)
