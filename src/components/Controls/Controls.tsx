import { PARAM_LIMITS, STAGE_PRESETS } from '../../lib/stages'
import type { KeratoconusStage, SimulatorParams, StagePreset } from '../../types'

interface ControlsProps {
  params: SimulatorParams
  activeStage: StagePreset | null
  onChange: (key: keyof SimulatorParams, value: number) => void
  onStageSelect: (stage: KeratoconusStage) => void
  onReset: () => void
}

const STAGE_COLORS: Record<KeratoconusStage, string> = {
  mild: 'var(--color-stage-mild)',
  moderate: 'var(--color-stage-moderate)',
  advanced: 'var(--color-stage-advanced)',
  severe: 'var(--color-stage-severe)',
}

const SLIDERS: {
  key: keyof SimulatorParams
  label: string
  hint: string
}[] = [
  {
    key: 'curvature',
    label: 'Corneal Curvature / Bulge',
    hint: 'Higher diopters = steeper cone',
  },
  {
    key: 'thickness',
    label: 'Corneal Thickness (Pachymetry)',
    hint: 'Lower µm = progressive thinning',
  },
  {
    key: 'ghosting',
    label: 'Visual Ghosting / Astigmatism',
    hint: 'Irregular optics & monocular polyopia',
  },
  {
    key: 'glare',
    label: 'Glare & Night Driving Halos',
    hint: 'Scatter around headlights & street lamps',
  },
]

function formatValue(key: keyof SimulatorParams, value: number) {
  const limit = PARAM_LIMITS[key]
  if (key === 'curvature') return `${value.toFixed(1)} ${limit.unit}`
  if (key === 'thickness') return `${Math.round(value)} ${limit.unit}`
  return `${Math.round(value)}${limit.unit}`
}

export function Controls({
  params,
  activeStage,
  onChange,
  onStageSelect,
  onReset,
}: ControlsProps) {
  return (
    <section className="panel animate-fade-up rounded-2xl p-5 md:p-6" style={{ animationDelay: '120ms' }}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Interactive Controls
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Tune clinical parameters or snap to a stage preset.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Reset
        </button>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase">
          Stage Presets
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STAGE_PRESETS.map((stage) => {
            const isActive = activeStage?.id === stage.id
            const color = STAGE_COLORS[stage.id]
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onStageSelect(stage.id)}
                className="rounded-xl border px-3 py-2.5 text-left transition"
                style={{
                  borderColor: isActive ? color : 'var(--color-line)',
                  background: isActive ? `${color}18` : 'transparent',
                  boxShadow: isActive ? `inset 0 0 0 1px ${color}55` : undefined,
                }}
              >
                <span
                  className="block text-sm font-semibold"
                  style={{ color: isActive ? color : '#e8eef8' }}
                >
                  {stage.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[var(--color-muted)]">
                  {stage.params.curvature}D · {stage.params.thickness}µm
                </span>
              </button>
            )
          })}
        </div>
        {activeStage && (
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            <span className="font-medium text-[var(--color-soft)]">{activeStage.label}:</span>{' '}
            {activeStage.description}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {SLIDERS.map((slider) => {
          const limit = PARAM_LIMITS[slider.key]
          const value = params[slider.key]
          return (
            <label key={slider.key} className="block">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white">{slider.label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                    {slider.hint}
                  </span>
                </div>
                <span className="shrink-0 rounded-md bg-[var(--color-panel-2)] px-2 py-1 font-mono text-xs text-[var(--color-accent)]">
                  {formatValue(slider.key, value)}
                </span>
              </div>
              <input
                className="slider-track"
                type="range"
                min={limit.min}
                max={limit.max}
                step={limit.step}
                value={value}
                onChange={(e) => onChange(slider.key, Number(e.target.value))}
                aria-label={slider.label}
              />
              <div className="mt-1 flex justify-between text-[10px] text-[var(--color-muted)]">
                <span>
                  {limit.min}
                  {limit.unit}
                </span>
                <span>
                  {limit.max}
                  {limit.unit}
                  {slider.key === 'curvature' || slider.key === 'thickness' ? '+' : ''}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </section>
  )
}
