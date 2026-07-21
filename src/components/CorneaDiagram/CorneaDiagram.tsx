import { useId, useMemo } from 'react'
import { deriveVisualEffects } from '../../lib/stages'
import type { SimulatorParams, VisionMode } from '../../types'

interface CorneaDiagramProps {
  params: SimulatorParams
  scarringOverride?: number
  visionMode?: VisionMode
}

const MODE_SUBTITLE: Record<VisionMode, string> = {
  normal: 'Normal cornea · smooth dome',
  myopia: 'Nearsighted · steeper refractive power',
  hyperopia: 'Farsighted · flatter refractive power',
  keratoconus: 'Anatomical view · anterior segment',
}

/**
 * Build a cornea outer/inner arc path.
 * t: 0 = smooth dome, 1 = steep cone with apical thinning.
 */
function corneaPaths(curvatureNorm: number, thicknessNorm: number) {
  const bulge = curvatureNorm
  const thin = thicknessNorm

  // Outer surface control points (anterior cornea)
  const apexY = 78 - bulge * 38
  const midY = 92 - bulge * 18
  const outer = `M 40 140 C 55 ${midY}, 85 ${apexY}, 160 ${apexY}
    C 235 ${apexY}, 265 ${midY}, 280 140`

  // Inner surface (posterior) — thickness collapses toward apex
  const baseThickness = 28 - thin * 16
  const apexInnerY = apexY + baseThickness * (0.55 + thin * 0.55)
  const midInnerY = midY + baseThickness * 0.85
  const inner = `M 48 138 C 70 ${midInnerY}, 100 ${apexInnerY}, 160 ${apexInnerY}
    C 220 ${apexInnerY}, 250 ${midInnerY}, 272 138`

  // Closed stroma fill between outer and reversed inner
  const stroma = `${outer} L 272 138 C 250 ${midInnerY}, 220 ${apexInnerY}, 160 ${apexInnerY}
    C 100 ${apexInnerY}, 70 ${midInnerY}, 48 138 Z`

  return { outer, inner, stroma, apexY, apexInnerY, baseThickness }
}

export function CorneaDiagram({
  params,
  scarringOverride,
  visionMode = 'keratoconus',
}: CorneaDiagramProps) {
  const uid = useId().replace(/:/g, '')
  const effects = useMemo(() => deriveVisualEffects(params), [params])
  const { outer, inner, stroma, apexY, apexInnerY } = useMemo(
    () => corneaPaths(Math.max(0, effects.curvatureNorm), Math.max(0, effects.thicknessNorm)),
    [effects.curvatureNorm, effects.thicknessNorm],
  )

  const scarring = scarringOverride ?? effects.scarring
  const thicknessLabel = Math.round(params.thickness)
  const curvatureLabel = params.curvature.toFixed(1)

  return (
    <section
      className="panel animate-fade-up flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl"
      style={{ animationDelay: '80ms' }}
    >
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Eye Cross-Section
          </h2>
          <p className="text-xs text-[var(--color-muted)]">{MODE_SUBTITLE[visionMode]}</p>
        </div>
        <div className="flex gap-3 text-right text-[11px]">
          <div>
            <div className="text-[var(--color-muted)]">Kmax</div>
            <div className="font-mono text-[var(--color-accent)]">{curvatureLabel} D</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)]">CCT</div>
            <div className="font-mono text-[var(--color-accent)]">{thicknessLabel} µm</div>
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_center,_#152238_0%,_#0b1220_70%)] p-4">
        <svg
          viewBox="0 0 320 220"
          className="h-full w-full max-h-[340px]"
          role="img"
          aria-label="Corneal cross-section diagram showing keratoconus progression"
        >
          <defs>
            <linearGradient id={`stroma-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#3dd6c6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1f8a7e" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id={`scar-${uid}`} cx="50%" cy="35%" r="35%">
              <stop offset="0%" stopColor="#f0b429" stopOpacity={scarring} />
              <stop offset="70%" stopColor="#ef6b6b" stopOpacity={scarring * 0.45} />
              <stop offset="100%" stopColor="#ef6b6b" stopOpacity="0" />
            </radialGradient>
            <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* Globe outline */}
          <ellipse
            cx="160"
            cy="210"
            rx="118"
            ry="95"
            fill="#101a2c"
            stroke="#2a3d5c"
            strokeWidth="1.5"
          />

          {/* Iris / pupil suggestion */}
          <ellipse cx="160" cy="168" rx="42" ry="18" fill="#1a2740" opacity="0.9" />
          <ellipse cx="160" cy="168" rx="18" ry="8" fill="#070b14" />

          {/* Aqueous humor space hint */}
          <path
            d={`M 55 140 Q 160 ${apexInnerY + 20} 265 140`}
            fill="none"
            stroke="#3dd6c6"
            strokeOpacity="0.12"
            strokeWidth="8"
          />

          {/* Corneal stroma */}
          <path
            d={stroma}
            fill={`url(#stroma-${uid})`}
            stroke="none"
            style={{ transition: 'd 220ms ease' }}
          />

          {/* Anterior surface */}
          <path
            d={outer}
            fill="none"
            stroke="#9ff5eb"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ transition: 'd 220ms ease' }}
          />

          {/* Posterior surface */}
          <path
            d={inner}
            fill="none"
            stroke="#5eead4"
            strokeWidth="1.4"
            strokeOpacity="0.75"
            strokeLinecap="round"
            style={{ transition: 'd 220ms ease' }}
          />

          {/* Scaring opacity (severe) */}
          {scarring > 0.02 && (
            <ellipse
              cx="160"
              cy={(apexY + apexInnerY) / 2}
              rx={28 + effects.curvatureNorm * 10}
              ry={10 + effects.thicknessNorm * 6}
              fill={`url(#scar-${uid})`}
              filter={`url(#soft-${uid})`}
            />
          )}

          {/* Thickness callout line */}
          <line
            x1="160"
            y1={apexY}
            x2="160"
            y2={apexInnerY}
            stroke="#f0b429"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            style={{ transition: 'y1 220ms ease, y2 220ms ease' }}
          />
          <circle cx="160" cy={apexY} r="2.5" fill="#f0b429" />
          <circle cx="160" cy={apexInnerY} r="2.5" fill="#f0b429" />

          {/* Labels */}
          <text x="160" y="28" textAnchor="middle" fill="#8b9bb4" fontSize="11" fontFamily="IBM Plex Sans, sans-serif">
            Anterior cornea
          </text>
          <text
            x="212"
            y={(apexY + apexInnerY) / 2 + 4}
            fill="#f0b429"
            fontSize="10"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            {thicknessLabel} µm
          </text>
          <text x="40" y="200" fill="#8b9bb4" fontSize="10" fontFamily="IBM Plex Sans, sans-serif">
            Lens / iris plane
          </text>

          {scarring > 0.25 && (
            <text
              x="160"
              y={apexY - 12}
              textAnchor="middle"
              fill="#ef6b6b"
              fontSize="10"
              fontFamily="IBM Plex Sans, sans-serif"
              opacity={Math.min(1, scarring + 0.2)}
            >
              Apical scarring
            </text>
          )}
        </svg>
      </div>

      <footer className="border-t border-[var(--color-line)] px-5 py-3 text-xs text-[var(--color-muted)]">
        Dome → cone as curvature rises and thickness falls. Yellow dashes mark central corneal
        thickness; amber/red haze indicates scarring risk in advanced disease.
      </footer>
    </section>
  )
}
