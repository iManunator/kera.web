import type { SimulatorParams, StagePreset } from '../types'

/** Clinical-inspired stage presets for one-click snaps. */
export const STAGE_PRESETS: StagePreset[] = [
  {
    id: 'mild',
    label: 'Mild',
    description: 'Subtle steepening · near-normal thickness · faint ghosting',
    params: {
      curvature: 47,
      thickness: 510,
      ghosting: 18,
      glare: 15,
    },
    scarring: 0,
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Clear cone · thinning underway · night glare begins',
    params: {
      curvature: 52,
      thickness: 460,
      ghosting: 42,
      glare: 40,
    },
    scarring: 0.05,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Steep cone · marked thinning · strong polyopia',
    params: {
      curvature: 56,
      thickness: 410,
      ghosting: 68,
      glare: 65,
    },
    scarring: 0.2,
  },
  {
    id: 'severe',
    label: 'Severe',
    description: 'Extreme bulge · <400 µm · scarring & dense halos',
    params: {
      curvature: 60,
      thickness: 370,
      ghosting: 90,
      glare: 88,
    },
    scarring: 0.55,
  },
]

export const DEFAULT_PARAMS: SimulatorParams = { ...STAGE_PRESETS[0].params }

export const PARAM_LIMITS = {
  curvature: { min: 42, max: 62, step: 0.5, unit: 'D' },
  thickness: { min: 350, max: 540, step: 5, unit: 'µm' },
  ghosting: { min: 0, max: 100, step: 1, unit: '%' },
  glare: { min: 0, max: 100, step: 1, unit: '%' },
} as const

/** Map slider params → visual filter intensities (0–1 normalized helpers). */
export function deriveVisualEffects(params: SimulatorParams) {
  // Allow slight extrapolation below 42D for hyperopia educational presets
  const curvatureNorm = (params.curvature - 42) / (62 - 42)
  const thicknessNorm = 1 - (params.thickness - 350) / (540 - 350)
  const ghostingNorm = params.ghosting / 100
  const glareNorm = params.glare / 100

  // Blur grows with steepening + thinning (myopia / irregular optics)
  const blurPx = curvatureNorm * 4.5 + thicknessNorm * 1.5 + ghostingNorm * 1.2

  // Displacement scale for SVG feDisplacementMap
  const displaceScale = ghostingNorm * 28 + curvatureNorm * 8

  // Ghost layer offsets (monocular polyopia)
  const ghostOffset = ghostingNorm * 10

  // Halo / glare overlay strength
  const haloOpacity = glareNorm * 0.75 + curvatureNorm * 0.1
  const brightness = 1 + glareNorm * 0.55 + curvatureNorm * 0.15
  const contrast = 1 + glareNorm * 0.2

  // Scarring from thickness collapse at high curvature
  const scarring =
    params.curvature >= 58 && params.thickness < 400
      ? Math.min(0.7, (60 - params.thickness / 10) * 0.02 + curvatureNorm * 0.3)
      : params.curvature >= 55
        ? Math.max(0, (params.curvature - 55) * 0.06)
        : 0

  return {
    blurPx,
    displaceScale,
    ghostOffset,
    haloOpacity,
    brightness,
    contrast,
    scarring,
    curvatureNorm,
    thicknessNorm,
    ghostingNorm,
    glareNorm,
  }
}

export function matchStage(params: SimulatorParams): StagePreset | null {
  const TOLERANCE = {
    curvature: 1.5,
    thickness: 20,
    ghosting: 12,
    glare: 12,
  }

  for (const stage of STAGE_PRESETS) {
    const p = stage.params
    if (
      Math.abs(p.curvature - params.curvature) <= TOLERANCE.curvature &&
      Math.abs(p.thickness - params.thickness) <= TOLERANCE.thickness &&
      Math.abs(p.ghosting - params.ghosting) <= TOLERANCE.ghosting &&
      Math.abs(p.glare - params.glare) <= TOLERANCE.glare
    ) {
      return stage
    }
  }
  return null
}
