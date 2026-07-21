import type { SceneId } from '../../types'
import { DayScene } from './DayScene'
import { NightScene } from './NightScene'
import { ParkScene } from './ParkScene'
import { ReadingScene } from './ReadingScene'

interface SceneViewProps {
  sceneId: SceneId
  uid: string
}

export function SceneView({ sceneId, uid }: SceneViewProps) {
  switch (sceneId) {
    case 'day-street':
      return <DayScene uid={uid} />
    case 'park':
      return <ParkScene uid={uid} />
    case 'reading':
      return <ReadingScene uid={uid} />
    case 'night-street':
    default:
      return <NightScene uid={uid} />
  }
}
