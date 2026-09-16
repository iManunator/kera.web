# KeraSim

### Keratoconus vision simulator

<p align="center">
  <a href="https://imanunator.github.io/kera.web/"><img src="https://img.shields.io/badge/demo-live-3dd6c6?style=for-the-badge" alt="Live demo" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
</p>

<p align="center">
  <strong>See how keratoconus reshapes sight</strong> — from mild steepening to advanced irregular optics — across day, night, park, and reading scenes.
</p>

<p align="center">
  <a href="https://imanunator.github.io/kera.web/"><b>→ Open the live demo</b></a>
</p>

---

## What it does

KeraSim is an interactive teaching visualization for **keratoconus** (progressive corneal thinning and cone-like bulging). Compare normal vision, common refractive errors, and keratoconus side by side — with a live cornea cross-section that morphs as parameters change.

> **Not a medical device.** Parameter ranges are simplified educational approximations, not diagnostic tools.

### Dual view

| Panel | What you get |
| --- | --- |
| **Vision simulation** | Patient-style scene with blur, ghosting, displacement, and night glare |
| **Cornea diagram** | SVG cross-section that steepens and thins with stage / sliders |

### Vision modes

| Mode | Effect |
| --- | --- |
| **Normal** | Sharp emmetropic focus |
| **Nearsighted** | Distance blur; near stays clearer |
| **Farsighted** | Near blur; distance stays clearer |
| **Keratoconus** | Ghosting, glare, irregular blur + stage presets |

Enable **Compare with normal** for a split view.

### Keratoconus controls

| Control | Range | Meaning |
| --- | --- | --- |
| Corneal curvature | 42D → 62D | Steeper Kmax / cone progression |
| Corneal thickness | 540 µm → 350 µm | Central thinning (pachymetry) |
| Ghosting / astigmatism | 0–100% | Irregular optics / polyopia |
| Glare & night halos | 0–100% | Scatter around bright lights |

Stage presets (**Mild → Severe**) snap sliders to clinical-inspired values.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS 4**
- Real-time effects via CSS filters, layered ghost copies, and SVG `feDisplacementMap`

```
src/
  components/
    VisionSimulator/   # Scenes + live vision filters
    CorneaDiagram/     # Anatomical SVG cross-section
    Controls/          # Scenes, modes, sliders, presets
  lib/
    stages.ts          # KC presets + effect derivation
    scenes.ts          # Sample picture catalog
    visionModes.ts     # Normal / myopia / hyperopia / KC
```

---

## Quick start

**Requires** Node.js 18+ and npm.

```bash
git clone https://github.com/iManunator/kera.web.git
cd kera.web
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/kera.web/`).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |

---

## How to explore

1. Pick a **scene** — night street, day street, park, or reading chart  
2. Choose a **vision mode** — Normal, Near, Far, or Keratoconus  
3. Toggle **Compare with normal** for a side-by-side view  
4. In Keratoconus mode, use **stage presets** or fine-tune the sliders  
5. Watch the patient view and cornea diagram update together  

---

## License

Released under the [MIT License](LICENSE) — free to use, modify, and share.

## AI-assisted development

This project was **developed with AI assistance** (Cursor). Human direction, review, and decisions remain with the maintainer; the AI helped implement UI, vision effects, and tooling.

## Disclaimer

KeraSim is for **education and demonstration only**. It is not intended for diagnosis, treatment planning, or clinical decision support.
