export type KeratoconusStage = 'mild' | 'moderate' | 'advanced' | 'severe'

export interface SimulatorParams {
  /** Corneal curvature in diopters (42–62) */
  curvature: number
  /** Central corneal thickness in µm (350–540) */
  thickness: number
  /** Ghosting / irregular astigmatism offset intensity (0–100) */
  ghosting: number
  /** Glare & night-driving halo intensity (0–100) */
  glare: number
}

export interface StagePreset {
  id: KeratoconusStage
  label: string
  description: string
  params: SimulatorParams
  /** Optional stromal scarring opacity (0–1), mainly severe */
  scarring: number
}
