import type { SceneDefinition, SceneId } from '../types'

export const SCENES: SceneDefinition[] = [
  {
    id: 'night-street',
    label: 'Night Street',
    timeOfDay: 'night',
    focus: 'distance',
    description: 'Traffic lights, headlights & street lamps — glare-heavy',
  },
  {
    id: 'day-street',
    label: 'Day Street',
    timeOfDay: 'day',
    focus: 'distance',
    description: 'Sunny city avenue with signs and cars',
  },
  {
    id: 'park',
    label: 'Park View',
    timeOfDay: 'day',
    focus: 'distance',
    description: 'Trees, path & distant hills — distance acuity',
  },
  {
    id: 'reading',
    label: 'Reading Chart',
    timeOfDay: 'day',
    focus: 'near',
    description: 'Near text & letters — near acuity',
  },
]

export function getScene(id: SceneId): SceneDefinition {
  return SCENES.find((s) => s.id === id) ?? SCENES[0]
}
