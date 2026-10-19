# Morteza Javaheri — Inside the System

Personal site / interactive resume. A static, frontend-only React app: the hero is a live 3D
"system" of the technologies I work with, and the rest of the page treats experience,
projects and engineering process like parts of a running system.

## Stack

- React 19 · TypeScript (strict) · Vite
- Three.js · React Three Fiber · Drei (hero scene, lazy-loaded)
- Framer Motion (all UI animation)
- Tailwind CSS v4 · Lucide icons
- IndexedDB (via a tiny wrapper) for local-only visitor state — no backend

## Scripts

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc only
```

Set `VITE_SITE_URL` (see `.env.example`) before building for production so Open Graph
image URLs and the canonical link are absolute.

## Editing content

All content lives in `src/data/` — no component needs to change:

| File | What it holds |
| --- | --- |
| `profile.ts` | name, roles, headline, bio, location, email, availability |
| `socials.ts` | GitHub / LinkedIn / Email links (`href: null` renders “not linked yet”) |
| `skills.ts` | technology map: groups, proficiency (`strong` / `exploring`), relationship chains |
| `system.ts` | nodes and links in the hero 3D system |
| `experience.ts` | roles, rendered as deployed services |
| `projects.ts` | systems with architecture layers, tech and challenges |
| `thinking.ts` | engineering process stages and principles |

Fields marked `TODO(morteza)` are placeholders that are intentionally empty (dates, company,
links, email). Empty values are hidden in the UI rather than invented.

## Structure

```
src/
  3d/           Three.js scene: core, nodes, connections + packets, particles, quality tiers
  animations/   motion tokens and primitives (Reveal, Stagger, ScrambleText)
  components/   shared UI (Nav, BootLoader, Terminal, CodePanel, ArchitectureDiagram, …)
  data/         all content
  hooks/        media queries, device tier, IndexedDB state, active section, Konami, …
  lib/          IndexedDB wrapper, terminal commands, C# highlighter, helpers
  sections/     page sections
  styles/       Tailwind theme tokens and base styles
  types/        content model
```

## Performance & accessibility notes

- The 3D scene is code-split and loaded after first paint; it pauses when scrolled out of view.
- Device tiers scale particles, packets, DPR and antialiasing; `PerformanceMonitor` drops DPR under load.
- No WebGL, or the visitor picks **effects: lite** in the footer → a 2D SVG system map is used instead.
- `prefers-reduced-motion` (or **lite**) disables decorative motion; the 3D scene renders on demand only.
- All interactive nodes are real buttons (keyboard + screen reader reachable), with visible focus states.

## Easter eggs

A few, kept quiet. The terminal has more commands than `help` admits.
