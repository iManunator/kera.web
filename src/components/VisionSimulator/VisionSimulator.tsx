import { useId, useMemo } from 'react'
import { getScene } from '../../lib/scenes'
import { deriveModeEffects, type RenderEffects } from '../../lib/visionModes'
import type { SceneId, SimulatorParams, VisionMode } from '../../types'
import { SceneView } from './SceneView'

interface VisionSimulatorProps {
  params: SimulatorParams
  sceneId: SceneId
  visionMode: VisionMode
  compareNormal: boolean
}

export function VisionSimulator({
  params,
  sceneId,
  visionMode,
  compareNormal,
}: VisionSimulatorProps) {
  const scene = getScene(sceneId)
  const primaryEffects = useMemo(
    () => deriveModeEffects(visionMode, sceneId, params),
    [visionMode, sceneId, params],
  )
  const normalEffects = useMemo(
    () => deriveModeEffects('normal', sceneId, params),
    [sceneId, params],
  )

  return (
    <section
      className="panel animate-fade-up flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl"
      style={{ animationDelay: '40ms' }}
    >
      <header className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Vision Simulation
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            {scene.label} · {scene.description}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-muted)]">
          {compareNormal ? 'Compare' : primaryEffects.label}
        </span>
      </header>

      <div
        className={`relative flex-1 overflow-hidden bg-black ${
          compareNormal ? 'grid grid-cols-1 sm:grid-cols-2' : ''
        }`}
      >
        {compareNormal && (
          <FilteredScene
            sceneId={sceneId}
            effects={normalEffects}
            title="Normal vision"
            chipTone="normal"
          />
        )}
        <FilteredScene
          sceneId={sceneId}
          effects={primaryEffects}
          title={primaryEffects.label}
          chipTone={visionMode}
          showDivider={compareNormal}
        />
      </div>

      <footer className="border-t border-[var(--color-line)] px-5 py-3 text-xs text-[var(--color-muted)]">
        {visionMode === 'keratoconus'
          ? 'Keratoconus stack: CSS blur, SVG displacement, ghost layers, and radial halos.'
          : visionMode === 'myopia'
            ? 'Myopia: distance scenes blur; reading stays relatively clear.'
            : visionMode === 'hyperopia'
              ? 'Hyperopia: reading blurs; distance scenes stay relatively clear.'
              : 'Normal (emmetropic) vision — sharp focus for this scene.'}
      </footer>
    </section>
  )
}

function FilteredScene({
  sceneId,
  effects,
  title,
  chipTone,
  showDivider = false,
}: {
  sceneId: SceneId
  effects: RenderEffects
  title: string
  chipTone: VisionMode | 'normal'
  showDivider?: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const filterId = `kc-displace-${uid}`

  // Semi-transparent offset copies of the same scene (monocular polyopia).
  // Opacity stays well below 1 so ghosts read as layered doubles, not solid warp.
  const ghostLayers = useMemo(() => {
    const o = effects.ghostOffset
    if (o < 0.5) return []
    const strength = Math.min(1, o / 14)
    return [
      { x: -o * 0.9, y: -o * 0.2, opacity: 0.18 + strength * 0.22 },
      { x: o * 0.75, y: o * 0.3, opacity: 0.14 + strength * 0.18 },
      { x: -o * 0.35, y: o * 0.55, opacity: 0.1 + strength * 0.12 },
    ]
  }, [effects.ghostOffset])

  const sceneFilter = [
    effects.blurPx > 0.05 ? `blur(${effects.blurPx.toFixed(2)}px)` : null,
    `brightness(${effects.brightness.toFixed(3)})`,
    `contrast(${effects.contrast.toFixed(3)})`,
    effects.displaceScale > 0.5 ? `url(#${filterId})` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const ghostFilter = [
    effects.blurPx > 0.05 ? `blur(${(effects.blurPx + 0.4).toFixed(2)}px)` : 'blur(0.4px)',
    `brightness(${effects.brightness.toFixed(3)})`,
    `contrast(${effects.contrast.toFixed(3)})`,
  ].join(' ')

  const haloBackground = sceneHaloBackground(sceneId, effects)

  return (
    <div
      className={`relative min-h-[280px] overflow-hidden ${
        showDivider ? 'border-t border-[var(--color-line)] sm:border-t-0 sm:border-l' : ''
      }`}
    >
      {effects.displaceScale > 0.5 && (
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter
              id={filterId}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.018"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={effects.displaceScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div className="absolute inset-0" style={{ filter: sceneFilter, willChange: 'filter' }}>
        <SceneView sceneId={sceneId} uid={`${uid}-main`} />
      </div>

      {ghostLayers.map((layer, i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-0"
          style={{
            transform: `translate(${layer.x.toFixed(1)}px, ${layer.y.toFixed(1)}px)`,
            opacity: layer.opacity,
            filter: ghostFilter,
            willChange: 'transform, filter, opacity',
          }}
          aria-hidden="true"
        >
          <SceneView sceneId={sceneId} uid={`${uid}-g${i}`} />
        </div>
      ))}

      {effects.showHalos && effects.haloOpacity > 0.02 && (
        <div
          className="pointer-events-none absolute inset-0 animate-halo"
          style={{
            opacity: effects.haloOpacity,
            background: haloBackground,
            mixBlendMode: 'screen',
            filter: `blur(${(2 + effects.haloOpacity * 8).toFixed(1)}px)`,
          }}
          aria-hidden="true"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${effects.vignette}) 100%)`,
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute top-3 left-3">
        <span
          className="rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm"
          style={{
            background: 'rgba(0,0,0,0.55)',
            color: toneColor(chipTone),
          }}
        >
          {title}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2">
        <Chip label="Blur" value={`${effects.blurPx.toFixed(1)}px`} />
        {effects.displaceScale > 0 && (
          <Chip label="Displace" value={effects.displaceScale.toFixed(0)} />
        )}
        {effects.haloOpacity > 0.02 && (
          <Chip label="Halo" value={`${Math.round(effects.haloOpacity * 100)}%`} />
        )}
      </div>
    </div>
  )
}

function toneColor(tone: VisionMode | 'normal') {
  switch (tone) {
    case 'myopia':
      return '#7dd3fc'
    case 'hyperopia':
      return '#fbbf24'
    case 'keratoconus':
      return '#3dd6c6'
    default:
      return '#86efac'
  }
}

function sceneHaloBackground(sceneId: SceneId, effects: RenderEffects) {
  if (sceneId === 'night-street') {
    return `
      radial-gradient(circle at 41% 76%, rgba(255,255,255,0.55) 0%, rgba(200,220,255,0.18) 8%, transparent 22%),
      radial-gradient(circle at 45% 76%, rgba(255,255,255,0.5) 0%, transparent 22%),
      radial-gradient(circle at 60% 74%, rgba(255,80,80,0.45) 0%, transparent 24%),
      radial-gradient(circle at 65% 74%, rgba(255,80,80,0.4) 0%, transparent 24%),
      radial-gradient(circle at 12.7% 46%, rgba(255,220,120,0.5) 0%, transparent 28%),
      radial-gradient(circle at 33.5% 46%, rgba(255,220,120,0.45) 0%, transparent 26%),
      radial-gradient(circle at 66.8% 46%, rgba(255,220,120,0.45) 0%, transparent 26%),
      radial-gradient(circle at 87.7% 46%, rgba(255,220,120,0.5) 0%, transparent 28%),
      radial-gradient(circle at 73.4% 38%, rgba(255,70,70,0.55) 0%, transparent 20%),
      radial-gradient(circle at 24.5% 48%, rgba(61,214,198,0.45) 0%, transparent 18%),
      radial-gradient(ellipse at 50% 70%, rgba(255,255,255,${0.04 + effects.haloOpacity * 0.1}) 0%, transparent 55%)
    `
  }

  if (sceneId === 'day-street') {
    return `
      radial-gradient(circle at 85% 17%, rgba(255,244,168,0.55) 0%, transparent 28%),
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.2) 0%, transparent 18%),
      radial-gradient(ellipse at 50% 40%, rgba(255,255,255,${0.05 + effects.haloOpacity * 0.12}) 0%, transparent 50%)
    `
  }

  if (sceneId === 'park') {
    return `
      radial-gradient(circle at 15% 17%, rgba(255,229,102,0.5) 0%, transparent 25%),
      radial-gradient(ellipse at 50% 45%, rgba(255,255,255,${0.04 + effects.haloOpacity * 0.1}) 0%, transparent 50%)
    `
  }

  // reading — soft window glare only
  return `
    radial-gradient(circle at 84% 20%, rgba(255,255,255,0.45) 0%, transparent 22%),
    radial-gradient(ellipse at 45% 40%, rgba(255,255,255,${0.03 + effects.haloOpacity * 0.08}) 0%, transparent 45%)
  `
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] text-[var(--color-soft)] backdrop-blur-sm">
      <span className="text-[var(--color-muted)]">{label}</span> {value}
    </span>
  )
}
