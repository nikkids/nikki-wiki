# The Nikki Wiki

A one-page, vintage-newspaper-styled personal portfolio for Jibril Nikki
Ghiffari. Static HTML/CSS/JS — no build step, no framework, no external
media files. Ready to deploy to Netlify as-is.

## Folder structure

```
portfolio/
├── index.html          Single-page site: masthead, sections, articles
├── netlify.toml         Netlify config (publish dir + cache headers)
├── README.md
├── css/
│   └── style.css        All styling (fonts loaded from Google Fonts CDN)
├── js/
│   └── script.js         All interactivity + synthesized audio (Web Audio API)
├── assets/
│   └── favicon.svg       Simple vintage stamp favicon
└── pages/                One detail page per experience — the "read the
                           full write-up" destination linked from each card
    ├── education.html
    ├── ferbos.html
    ├── bps.html
    ├── research.html
    ├── ml-cohort.html
    ├── gaotek.html
    ├── student-association.html
    ├── aiesec-future-leader.html
    ├── uiux-designer.html
    └── volunteer.html
```

## What's inside

- **Front page**: profile "headline story," a by-the-numbers stat box, a
  pull quote, a small vintage-engraved bar chart, and a weather-style
  forecast box.
- **Education**: a short front-page-style report card.
- **The Working Desk**: paid roles arrive as decoded telegrams (STOP-separated
  cable text), not resume bullet lines.
- **Field Reports**: the research post appears as a journal citation/offprint
  card; the shorter assignments (ML cohort, GAOTek) run down a field-log
  timeline with dated markers.
- **The Society Page**: campus organizations are written up as gossip-column
  items rather than job-title stacks.
- **Op-Ed & Volunteer**: the AIESEC volunteer stint is a postcard sent home,
  stamp, postmark, and all.
- **The Honor Roll**: awards and competition finals as ribboned cards.
- **Classifieds**: skills and certifications as a tilted stamp-collection
  grid, searchable live.
- **Letters**: contact details plus a wax seal.
- **Interactivity**: sticky tab navigation with scroll-spy, expandable
  "read more" panels on every dispatch, an "Unfold Full Edition" button
  that opens everything at once, a live classifieds search, a scrolling
  data ticker, and a gramophone toggle for background ambience.
- **Detail pages**: every experience card also links out ("See the full
  page ↗") to a standalone page under `/pages/` with a longer, plainer-
  language write-up and its own photo placeholder.
- **Image placeholders**: dashed-border "photo goes here" boxes are used
  throughout (headline photo, waving-avatar rotator, telegram photo pins,
  a research figure, timeline thumbnails, gossip-column polaroids, and
  the postcard's front photo) — swap the `.img-placeholder` divs for real
  `<img>` tags whenever real photos are ready.
- **Audio**: all sound (button clicks, page-flip whoosh, and the ambient
  loop) is synthesized in the browser with the Web Audio API — there are
  no audio files to license or host. Nothing plays until the visitor
  presses the gramophone button in the bottom-right corner, in line with
  browser autoplay rules and basic courtesy.

## Editing content

Everything is in `index.html`, organized in commented `<section>` blocks
that match the nav tabs. Formats vary by section: `.telegram-card` for
the Working Desk, `.citation-card` and `.timeline-node` for Field Reports,
`.gossip-entry` items for the Society Page, `.postcard` for the volunteer
dispatch, `.honor-card` for awards, and `.classified-ad` (with a
`data-cat` attribute used by the search box) for skills/certifications.
Any element with a `data-expandable` attribute plus an inner `.read-more`
button and `.story-body` block will auto-wire into the expand/collapse
behavior in `script.js` — reuse that pattern for new entries.

## Deploying to Netlify

**Option A — drag and drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `portfolio` folder onto the page.
3. Netlify publishes it instantly and gives you a live URL.

**Option B — Netlify CLI**
```bash
npm install -g netlify-cli
cd portfolio
netlify deploy --prod
```

**Option C — Git-based deploy**
1. Push this folder to a GitHub/GitLab/Bitbucket repository.
2. In Netlify, "Add new site" → "Import an existing project" → pick the repo.
3. Build command: leave blank. Publish directory: `.` (repo root, since
   `index.html` lives there). Netlify will pick up `netlify.toml`
   automatically.

No environment variables, build step, or backend are required.
