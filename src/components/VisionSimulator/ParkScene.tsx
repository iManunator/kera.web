interface SceneProps {
  uid?: string
}

/** Outdoor park / landscape — distance acuity sample. */
export function ParkScene({ uid = 'park' }: SceneProps) {
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
          <stop offset="0%" stopColor="#5eb0e5" />
          <stop offset="100%" stopColor="#b8dff5" />
        </linearGradient>
        <linearGradient id={g('hill')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6bbf6e" />
          <stop offset="100%" stopColor="#3d8b4a" />
        </linearGradient>
        <linearGradient id={g('path')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d2b48c" />
          <stop offset="100%" stopColor="#b8956c" />
        </linearGradient>
      </defs>

      <rect width="960" height="540" fill={`url(#${g('sky')})`} />
      <circle cx="140" cy="90" r="36" fill="#ffe566" />

      {/* Distant hills */}
      <path
        d="M0 280 Q120 200 240 260 T480 240 T720 255 T960 220 L960 320 L0 320 Z"
        fill="#8fbc8f"
        opacity="0.7"
      />
      <path
        d="M0 300 Q160 240 320 290 T640 270 T960 290 L960 360 L0 360 Z"
        fill={`url(#${g('hill')})`}
      />

      {/* Meadow */}
      <rect x="0" y="340" width="960" height="200" fill="#5aad5f" />
      <path
        d="M380 340 Q480 400 520 540 L440 540 Q420 420 380 340 Z"
        fill={`url(#${g('path')})`}
      />

      {/* Distant mountain ridge label target */}
      <text
        x="700"
        y="195"
        fill="#ffffff"
        fontSize="14"
        fontFamily="IBM Plex Sans, sans-serif"
        opacity="0.55"
      >
        Distant ridge
      </text>

      {/* Trees mid-ground */}
      {[80, 200, 620, 780, 900].map((x, i) => (
        <g key={i}>
          <rect x={x} y="280" width="12" height="70" fill="#6b4423" />
          <ellipse cx={x + 6} cy="250" rx="36" ry="48" fill={i % 2 ? '#2f9e44' : '#40c057'} />
          <ellipse cx={x - 16} cy="270" rx="24" ry="30" fill="#51cf66" />
          <ellipse cx={x + 28} cy="268" rx="22" ry="28" fill="#69db7c" />
        </g>
      ))}

      {/* Bench */}
      <g>
        <rect x="300" y="400" width="90" height="10" rx="2" fill="#8b5a2b" />
        <rect x="308" y="410" width="8" height="28" fill="#6b4423" />
        <rect x="374" y="410" width="8" height="28" fill="#6b4423" />
        <rect x="300" y="392" width="90" height="6" rx="2" fill="#a0522d" />
      </g>

      {/* Flowers */}
      {[
        [120, 450, '#ef6b6b'],
        [160, 470, '#f0b429'],
        [700, 440, '#c084fc'],
        [740, 460, '#ef6b6b'],
        [820, 450, '#60a5fa'],
      ].map(([x, y, color], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={Number(y) + 18} stroke="#2f9e44" strokeWidth="2" />
          <circle cx={Number(x)} cy={Number(y)} r="6" fill={String(color)} />
        </g>
      ))}

      {/* Near sign with readable text */}
      <g>
        <rect x="500" y="360" width="6" height="80" fill="#6b7280" />
        <rect x="470" y="340" width="66" height="36" rx="4" fill="#f8fafc" stroke="#334155" />
        <text
          x="503"
          y="362"
          textAnchor="middle"
          fill="#0f172a"
          fontSize="11"
          fontFamily="IBM Plex Sans, sans-serif"
          fontWeight="600"
        >
          PARK
        </text>
      </g>
    </svg>
  )
}
