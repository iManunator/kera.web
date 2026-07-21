import { useId, useMemo } from 'react'
import { deriveVisualEffects } from '../../lib/stages'
import type { SimulatorParams } from '../../types'
import { NightScene } from './NightScene'

interface VisionSimulatorProps {
  params: SimulatorParams
}

export function VisionSimulator({ params }: VisionSimulatorProps) {
  const uid = useId().replace(/:/g, '')
  const effects = useMemo(() => deriveVisualEffects(params), [params])

  const filterId = `kc-displace-${uid}`
  const ghostLayers = useMemo(() => {
    const o = effects.ghostOffset
    if (o < 0.5) return []
    return [
      { x: -o * 0.85, y: -o * 0.25, opacity: 0.28 + effects.ghostingNorm * 0.15 },
      { x: o * 0.7, y: o * 0.35, opacity: 0.22 + effects.ghostingNorm * 0.12 },
      { x: -o * 0.35, y: o * 0.55, opacity: 0.16 + effects.ghostingNorm * 0.1 },
    ]
  }, [effects.ghostOffset, effects.ghostingNorm])

  const sceneFilter = `
    blur(${effects.blurPx.toFixed(2)}px)
    brightness(${effects.brightness.toFixed(3)})
    contrast(${effects.contrast.toFixed(3)})
    url(#${filterId})
  `

  return (
    <section
      className="panel animate-fade-up flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl"
      style={{ animationDelay: '40ms' }}
    >
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Vision Simulation
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Patient view · night street with traffic lights
          </p>
        </div>
        <span className="rounded-md border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-muted)]">
          Live filters
        </span>
      </header>

      <div className="relative flex-1 overflow-hidden bg-black">
        {/* Hidden SVG filter definition for irregular astigmatism */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter
              id={filterId}
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.012 + effects.ghostingNorm * 0.02}
                numOctaves="3"
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

        {/* Ghost / polyopia layers */}
        {ghostLayers.map((layer, i) => (
          <div
            key={i}
            className="pointer-events-none absolute inset-0"
            style={{
              transform: `translate(${layer.x}px, ${layer.y}px)`,
              opacity: layer.opacity,
              filter: `blur(${(effects.blurPx * 0.6 + 0.5).toFixed(2)}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform, filter, opacity',
            }}
            aria-hidden="true"
          >
            <NightScene />
          </div>
        ))}

        {/* Primary scene with blur + displacement */}
        <div
          className="absolute inset-0"
          style={{
            filter: sceneFilter,
            willChange: 'filter',
          }}
        >
          <NightScene />
        </div>

        {/* CSS drop-shadow ghosting boost on bright sources */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: effects.ghostingNorm * 0.55,
            filter: `
              drop-shadow(${effects.ghostOffset * 0.6}px ${effects.ghostOffset * 0.2}px 0 rgba(255,255,255,0.25))
              drop-shadow(${-effects.ghostOffset * 0.5}px ${effects.ghostOffset * 0.3}px 0 rgba(180,220,255,0.2))
            `,
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        >
          <NightScene />
        </div>

        {/* Glare & light halos overlay */}
        <div
          className="pointer-events-none absolute inset-0 animate-halo"
          style={{
            opacity: effects.haloOpacity,
            background: `
              radial-gradient(circle at 41% 76%, rgba(255,255,255,0.55) 0%, rgba(200,220,255,0.18) 8%, transparent 22%),
              radial-gradient(circle at 45% 76%, rgba(255,255,255,0.5) 0%, rgba(180,210,255,0.15) 8%, transparent 22%),
              radial-gradient(circle at 60% 74%, rgba(255,80,80,0.45) 0%, rgba(255,60,60,0.12) 10%, transparent 24%),
              radial-gradient(circle at 65% 74%, rgba(255,80,80,0.4) 0%, rgba(255,60,60,0.1) 10%, transparent 24%),
              radial-gradient(circle at 12.7% 46%, rgba(255,220,120,0.5) 0%, rgba(255,200,80,0.12) 12%, transparent 28%),
              radial-gradient(circle at 33.5% 46%, rgba(255,220,120,0.45) 0%, transparent 26%),
              radial-gradient(circle at 66.8% 46%, rgba(255,220,120,0.45) 0%, transparent 26%),
              radial-gradient(circle at 87.7% 46%, rgba(255,220,120,0.5) 0%, transparent 28%),
              radial-gradient(circle at 73.4% 38%, rgba(255,70,70,0.55) 0%, rgba(255,50,50,0.15) 8%, transparent 20%),
              radial-gradient(circle at 24.5% 48%, rgba(61,214,198,0.45) 0%, transparent 18%),
              radial-gradient(ellipse at 50% 70%, rgba(255,255,255,${0.04 + effects.glareNorm * 0.08}) 0%, transparent 55%)
            `,
            mixBlendMode: 'screen',
            filter: `blur(${(2 + effects.glareNorm * 6).toFixed(1)}px)`,
          }}
          aria-hidden="true"
        />

        {/* Soft vignette for loss of contrast */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${0.15 + effects.curvatureNorm * 0.35}) 100%)`,
            opacity: 0.85,
          }}
          aria-hidden="true"
        />

        {/* Readout chips */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2">
          <Chip label="Blur" value={`${effects.blurPx.toFixed(1)}px`} />
          <Chip label="Displace" value={effects.displaceScale.toFixed(0)} />
          <Chip label="Halo" value={`${Math.round(effects.haloOpacity * 100)}%`} />
        </div>
      </div>

      <footer className="border-t border-[var(--color-line)] px-5 py-3 text-xs text-[var(--color-muted)]">
        Effects stack CSS blur (myopia), SVG displacement (irregular astigmatism), layered
        ghosts (polyopia), and radial halos (glare).
      </footer>
    </section>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] text-[var(--color-soft)] backdrop-blur-sm">
      <span className="text-[var(--color-muted)]">{label}</span> {value}
    </span>
  )
}
