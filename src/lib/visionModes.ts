import type { SceneId, SimulatorParams, VisionMode, VisionModeDefinition } from '../types'
import { deriveVisualEffects } from './stages'
import { getScene } from './scenes'

export const VISION_MODES: VisionModeDefinition[] = [
  {
    id: 'normal',
    label: 'Normal Vision',
    shortLabel: 'Normal',
    description: 'Emmetropia — sharp focus at near and distance',
  },
  {
    id: 'myopia',
    label: 'Nearsighted (Myopia)',
    shortLabel: 'Near',
    description: 'Distance blur; near tasks stay relatively clear',
  },
  {
    id: 'hyperopia',
    label: 'Farsighted (Hyperopia)',
    shortLabel: 'Far',
    description: 'Near blur; distance stays relatively clear',
  },
  {
    id: 'keratoconus',
    label: 'Keratoconus',
    shortLabel: 'KC',
    description: 'Irregular cornea — ghosting, glare & progressive blur',
  },
]

export const NORMAL_EYE_PARAMS: SimulatorParams = {
  curvature: 43.5,
  thickness: 540,
  ghosting: 0,
  glare: 0,
}

export const MYOPIA_PARAMS: SimulatorParams = {
  curvature: 46,
  thickness: 535,
  ghosting: 0,
  glare: 8,
}

export const HYPEROPIA_PARAMS: SimulatorParams = {
  curvature: 41.5,
  thickness: 540,
  ghosting: 0,
  glare: 5,
}

/** Anatomy snapshot params used when vision mode is not keratoconus. */
export function anatomyParamsForMode(
  mode: VisionMode,
  kcParams: SimulatorParams,
): SimulatorParams {
  if (mode === 'keratoconus') return kcParams
  if (mode === 'myopia') return MYOPIA_PARAMS
  if (mode === 'hyperopia') return HYPEROPIA_PARAMS
  return NORMAL_EYE_PARAMS
}

export interface RenderEffects {
  blurPx: number
  displaceScale: number
  ghostOffset: number
  haloOpacity: number
  brightness: number
  contrast: number
  vignette: number
  showHalos: boolean
  label: string
}

/**
 * Derive filter stack for a vision mode + scene combination.
 * Myopia blurs distance scenes; hyperopia blurs near (reading).
 */
export function deriveModeEffects(
  mode: VisionMode,
  sceneId: SceneId,
  kcParams: SimulatorParams,
): RenderEffects {
  const scene = getScene(sceneId)
  const isNight = scene.timeOfDay === 'night'
  const isNear = scene.focus === 'near'

  if (mode === 'normal') {
    return {
      blurPx: 0,
      displaceScale: 0,
      ghostOffset: 0,
      haloOpacity: 0,
      brightness: 1,
      contrast: 1,
      vignette: 0.08,
      showHalos: false,
      label: 'Normal',
    }
  }

  if (mode === 'myopia') {
    // Distance blur; near stays clearer
    const blurPx = isNear ? 0.4 : 5.5
    return {
      blurPx,
      displaceScale: 0,
      ghostOffset: 0,
      haloOpacity: isNight ? 0.12 : 0.04,
      brightness: isNight ? 1.08 : 1,
      contrast: 1.02,
      vignette: 0.18,
      showHalos: isNight,
      label: 'Myopia',
    }
  }

  if (mode === 'hyperopia') {
    // Near blur; distance stays clearer
    const blurPx = isNear ? 6.2 : 0.6
    return {
      blurPx,
      displaceScale: 0,
      ghostOffset: 0,
      haloOpacity: isNight ? 0.08 : 0.02,
      brightness: 1,
      contrast: 1,
      vignette: 0.14,
      showHalos: isNight,
      label: 'Hyperopia',
    }
  }

  // Keratoconus — full irregular optics stack
  const base = deriveVisualEffects(kcParams)
  const nightBoost = isNight ? 1 : 0.55
  return {
    blurPx: base.blurPx * (isNear ? 0.85 : 1),
    displaceScale: base.displaceScale,
    ghostOffset: base.ghostOffset,
    haloOpacity: base.haloOpacity * nightBoost,
    brightness: 1 + (base.brightness - 1) * nightBoost,
    contrast: 1 + (base.contrast - 1) * nightBoost,
    vignette: 0.15 + base.curvatureNorm * 0.35,
    showHalos: true,
    label: 'Keratoconus',
  }
}
