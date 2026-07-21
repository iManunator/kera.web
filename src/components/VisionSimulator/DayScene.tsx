interface SceneProps {
  uid?: string
}

/** Sunny daytime city street. */
export function DayScene({ uid = 'day' }: SceneProps) {
  const g = (name: string) => `${uid}-${name}`

  return (
    <svg
      viewBox="0 0 960 540"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f5" />
          <stop offset="55%" stopColor="#a8d8f0" />
          <stop offset="100%" stopColor="#c5e4f5" />
        </linearGradient>
        <linearGradient id={g('road')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <radialGradient id={g('sun')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7c2" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffe566" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffe566" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="960" height="540" fill={`url(#${g('sky')})`} />
      <circle cx="820" cy="90" r="70" fill={`url(#${g('sun')})`} />
      <circle cx="820" cy="90" r="28" fill="#fff4a8" />

      {/* Soft clouds */}
      <g fill="#ffffff" opacity="0.55">
        <ellipse cx="180" cy="100" rx="70" ry="28" />
        <ellipse cx="230" cy="95" rx="50" ry="22" />
        <ellipse cx="480" cy="70" rx="80" ry="26" />
        <ellipse cx="540" cy="68" rx="45" ry="18" />
      </g>

      {/* Buildings */}
      <g>
        <rect x="40" y="200" width="90" height="180" fill="#d4a574" />
        <rect x="140" y="160" width="70" height="220" fill="#c48b6a" />
        <rect x="220" y="220" width="110" height="160" fill="#e8c9a0" />
        <rect x="340" y="140" width="60" height="240" fill="#b8956c" />
        <rect x="520" y="180" width="80" height="200" fill="#d4a574" />
        <rect x="610" y="120" width="100" height="260" fill="#9a7b5a" />
        <rect x="720" y="200" width="70" height="180" fill="#e0b888" />
        <rect x="800" y="170" width="120" height="210" fill="#c49a6c" />
      </g>

      {/* Windows */}
      <g fill="#7dd3fc" opacity="0.7">
        {[
          [55, 220],
          [75, 220],
          [55, 250],
          [75, 250],
          [55, 280],
          [155, 180],
          [170, 180],
          [155, 220],
          [170, 260],
          [240, 240],
          [270, 240],
          [240, 280],
          [355, 160],
          [370, 200],
          [355, 250],
          [540, 200],
          [560, 240],
          [630, 150],
          [660, 190],
          [630, 240],
          [740, 220],
          [820, 190],
          [860, 230],
          [820, 270],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="12" height="14" rx="1" />
        ))}
      </g>

      {/* Shop signs */}
      <rect x="235" y="300" width="80" height="22" rx="3" fill="#ef6b6b" />
      <rect x="735" y="290" width="60" height="18" rx="3" fill="#3dd6c6" />

      <rect x="0" y="370" width="960" height="12" fill="#9ca3af" />
      <path d="M0 382 L960 382 L960 540 L0 540 Z" fill={`url(#${g('road')})`} />
      <path d="M470 382 L490 382 L520 540 L440 540 Z" fill="#9ca3af" opacity="0.7" />
      {[410, 450, 490, 520].map((y, i) => (
        <rect key={i} x="472" y={y} width="16" height="16" rx="2" fill="#fef3c7" opacity="0.85" />
      ))}

      {/* Cars */}
      <g>
        <rect x="300" y="420" width="100" height="32" rx="8" fill="#2563eb" />
        <rect x="318" y="408" width="55" height="18" rx="4" fill="#93c5fd" />
        <circle cx="320" cy="452" r="10" fill="#1f2937" />
        <circle cx="380" cy="452" r="10" fill="#1f2937" />
      </g>
      <g>
        <rect x="580" y="400" width="90" height="28" rx="7" fill="#dc2626" />
        <rect x="595" y="390" width="48" height="16" rx="3" fill="#fca5a5" />
        <circle cx="598" cy="428" r="9" fill="#1f2937" />
        <circle cx="650" cy="428" r="9" fill="#1f2937" />
      </g>

      {/* Traffic light */}
      <rect x="480" y="250" width="8" height="70" fill="#4b5563" />
      <rect x="470" y="240" width="28" height="58" rx="5" fill="#374151" />
      <circle cx="484" cy="255" r="6" fill="#22c55e" />
      <circle cx="484" cy="272" r="6" fill="#fbbf24" opacity="0.35" />
      <circle cx="484" cy="289" r="6" fill="#ef4444" opacity="0.3" />

      {/* Street trees */}
      {[100, 450, 880].map((x, i) => (
        <g key={i}>
          <rect x={x} y="320" width="8" height="55" fill="#7c5a3a" />
          <circle cx={x + 4} cy="300" r="28" fill="#4ade80" />
          <circle cx={x - 10} cy="310" r="18" fill="#22c55e" />
          <circle cx={x + 18} cy="308" r="16" fill="#86efac" />
        </g>
      ))}
    </svg>
  )
}
