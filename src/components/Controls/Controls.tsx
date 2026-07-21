import { PARAM_LIMITS, STAGE_PRESETS } from '../../lib/stages'
import { SCENES } from '../../lib/scenes'
import { VISION_MODES } from '../../lib/visionModes'
import type {
  KeratoconusStage,
  SceneId,
  SimulatorParams,
  StagePreset,
  VisionMode,
} from '../../types'

interface ControlsProps {
  params: SimulatorParams
  activeStage: StagePreset | null
  sceneId: SceneId
  visionMode: VisionMode
  compareNormal: boolean
  onChange: (key: keyof SimulatorParams, value: number) => void
  onStageSelect: (stage: KeratoconusStage) => void
  onSceneSelect: (sceneId: SceneId) => void
  onVisionModeSelect: (mode: VisionMode) => void
  onCompareToggle: (value: boolean) => void
  onReset: () => void
}

const STAGE_COLORS: Record<KeratoconusStage, string> = {
  mild: 'var(--color-stage-mild)',
  moderate: 'var(--color-stage-moderate)',
  advanced: 'var(--color-stage-advanced)',
  severe: 'var(--color-stage-severe)',
}

const MODE_COLORS: Record<VisionMode, string> = {
  normal: '#86efac',
  myopia: '#7dd3fc',
  hyperopia: '#fbbf24',
  keratoconus: '#3dd6c6',
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
  sceneId,
  visionMode,
  compareNormal,
  onChange,
  onStageSelect,
  onSceneSelect,
  onVisionModeSelect,
  onCompareToggle,
  onReset,
}: ControlsProps) {
  const kcActive = visionMode === 'keratoconus'

  return (
    <section className="panel animate-fade-up rounded-2xl p-5 md:p-6" style={{ animationDelay: '120ms' }}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Interactive Controls
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Switch scenes, compare vision modes, or tune keratoconus parameters.
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

      {/* Scene picker */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase">
          Sample Picture
        </p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {SCENES.map((scene) => {
            const isActive = sceneId === scene.id
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSceneSelect(scene.id)}
                className="rounded-xl border px-3 py-2.5 text-left transition"
                style={{
                  borderColor: isActive ? 'var(--color-accent)' : 'var(--color-line)',
                  background: isActive ? 'rgba(61,214,198,0.12)' : 'transparent',
                }}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="text-[10px] tracking-wide text-[var(--color-muted)] uppercase">
                    {scene.timeOfDay}
                  </span>
                  {scene.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[var(--color-muted)]">
                  {scene.focus === 'near' ? 'Near focus' : 'Distance focus'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vision mode */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase">
            Vision Mode
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-soft)]">
            <input
              type="checkbox"
              checked={compareNormal}
              onChange={(e) => onCompareToggle(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
            Compare with normal
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VISION_MODES.map((mode) => {
            const isActive = visionMode === mode.id
            const color = MODE_COLORS[mode.id]
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onVisionModeSelect(mode.id)}
                className="rounded-xl border px-3 py-2.5 text-left transition"
                style={{
                  borderColor: isActive ? color : 'var(--color-line)',
                  background: isActive ? `${color}18` : 'transparent',
                  boxShadow: isActive ? `inset 0 0 0 1px ${color}55` : undefined,
                }}
              >
                <span className="block text-sm font-semibold" style={{ color: isActive ? color : '#e8eef8' }}>
                  {mode.shortLabel}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[var(--color-muted)]">
                  {mode.label}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-soft)]">
            {VISION_MODES.find((m) => m.id === visionMode)?.label}:
          </span>{' '}
          {VISION_MODES.find((m) => m.id === visionMode)?.description}
        </p>
      </div>

      {/* KC stage presets */}
      <div className={`mb-6 ${kcActive ? '' : 'opacity-45'}`}>
        <p className="mb-2 text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase">
          Keratoconus Stage Presets
          {!kcActive && (
            <span className="ml-2 font-normal normal-case tracking-normal">
              (select Keratoconus mode to apply)
            </span>
          )}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STAGE_PRESETS.map((stage) => {
            const isActive = kcActive && activeStage?.id === stage.id
            const color = STAGE_COLORS[stage.id]
            return (
              <button
                key={stage.id}
                type="button"
                disabled={!kcActive}
                onClick={() => onStageSelect(stage.id)}
                className="rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-not-allowed"
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
        {kcActive && activeStage && (
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            <span className="font-medium text-[var(--color-soft)]">{activeStage.label}:</span>{' '}
            {activeStage.description}
          </p>
        )}
      </div>

      {/* Sliders — only meaningful for KC */}
      <div className={`space-y-5 ${kcActive ? '' : 'pointer-events-none opacity-40'}`}>
        {!kcActive && (
          <p className="text-xs text-[var(--color-muted)]">
            Parameter sliders apply in Keratoconus mode. Other modes use fixed educational presets.
          </p>
        )}
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
                disabled={!kcActive}
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
