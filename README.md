# KeraSim — Keratoconus Vision Simulator

A modern, high-performance visual simulator that illustrates how **Keratoconus** (progressive corneal thinning and cone-like bulging) affects vision across four clinical stages: Mild, Moderate, Advanced, and Severe.

## Features

### Dual-View Experience

1. **Vision Simulation (Patient View)** — Night city street scene with real-time distortions:
   - Blur / myopia (CSS `blur`)
   - Irregular astigmatism (SVG `feDisplacementMap`)
   - Ghosting / monocular polyopia (layered offsets + drop-shadows)
   - Glare & light halos (CSS radial-gradient overlays + brightness)

2. **Eye Cross-Section (Anatomical View)** — Responsive SVG diagram of the cornea morphing from a smooth dome to a steepened, thinned cone, with scarring opacity in advanced/severe stages.

### Interactive Controls

| Control | Range | Clinical meaning |
|--------|--------|------------------|
| Corneal Curvature / Bulge | 42D → 62D | Steeper Kmax / cone progression |
| Corneal Thickness (Pachymetry) | 540 µm → 350 µm | Central thinning |
| Visual Ghosting / Astigmatism | 0–100% | Irregular optics / polyopia |
| Glare & Night Halos | 0–100% | Scatter around bright lights |

**Stage preset buttons** snap all sliders to Mild / Moderate / Advanced / Severe clinical-inspired values.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- SVG filters + CSS for 60fps-friendly real-time effects

## Project Structure

```
src/
  components/
    VisionSimulator/   # Patient-view night scene + live filters
    CorneaDiagram/     # Anatomical SVG cross-section
    Controls/          # Sliders + stage presets
  lib/
    stages.ts          # Clinical presets + effect derivation
  types.ts
  App.tsx
  index.css
```

## Local Setup

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/iManunator/kera.web.git
cd kera.web

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Other commands

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

## How to Use

1. Click a **stage preset** (Mild → Severe) to snap to typical clinical values.
2. Drag individual sliders to explore intermediate states.
3. Watch both panels update together:
   - Patient view: blur, ghosting, and halos intensify.
   - Anatomy view: cornea steepens, thins, and may show apical scarring.

## Educational Note

KeraSim is a teaching visualization, **not** a diagnostic or clinical decision-support device. Parameter ranges are simplified approximations inspired by common keratoconus staging (Kmax / pachymetry).
