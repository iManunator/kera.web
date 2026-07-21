import { useMemo, useState } from 'react'
import { Controls } from './components/Controls'
import { CorneaDiagram } from './components/CorneaDiagram'
import { VisionSimulator } from './components/VisionSimulator'
import { DEFAULT_PARAMS, STAGE_PRESETS, matchStage } from './lib/stages'
import type { KeratoconusStage, SimulatorParams } from './types'

export default function App() {
  const [params, setParams] = useState<SimulatorParams>(DEFAULT_PARAMS)

  const activeStage = useMemo(() => matchStage(params), [params])
  const scarringOverride = activeStage?.scarring

  const handleChange = (key: keyof SimulatorParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const handleStageSelect = (stageId: KeratoconusStage) => {
    const stage = STAGE_PRESETS.find((s) => s.id === stageId)
    if (stage) setParams({ ...stage.params })
  }

  const handleReset = () => setParams({ ...DEFAULT_PARAMS })

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <header className="animate-fade-up mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
              Clinical education tool
            </p>
            <h1 className="font-display text-4xl leading-none text-white md:text-5xl">
              Kera<span className="text-[var(--color-accent)]">Sim</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
              Explore how keratoconus — progressive corneal thinning and cone-like bulging —
              reshapes night vision across Mild, Moderate, Advanced, and Severe stages.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-[var(--color-muted)]">
            <span className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-1.5">
              Dual-view · patient + anatomy
            </span>
            <span className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-1.5">
              60fps CSS / SVG filters
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <VisionSimulator params={params} />
        <CorneaDiagram params={params} scarringOverride={scarringOverride} />
      </div>

      <div className="mt-5">
        <Controls
          params={params}
          activeStage={activeStage}
          onChange={handleChange}
          onStageSelect={handleStageSelect}
          onReset={handleReset}
        />
      </div>

      <section className="animate-fade-up mt-8 grid gap-4 md:grid-cols-4" style={{ animationDelay: '160ms' }}>
        {STAGE_PRESETS.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => handleStageSelect(stage.id)}
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]/70 p-4 text-left transition hover:border-[var(--color-accent-dim)]"
          >
            <div className="text-xs font-semibold tracking-wider text-[var(--color-accent)] uppercase">
              {stage.label}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
              {stage.description}
            </p>
          </button>
        ))}
      </section>

      <footer className="mt-10 border-t border-[var(--color-line)] pt-6 pb-4 text-center text-xs text-[var(--color-muted)]">
        KeraSim is an educational visualization — not a diagnostic device. Parameter ranges are
        inspired by typical clinical staging (Kmax / pachymetry) and simplified for teaching.
      </footer>
    </div>
  )
}
