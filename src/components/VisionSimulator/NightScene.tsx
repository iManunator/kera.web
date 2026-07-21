/** Static night city street scene used as the patient-view sample. */
export function NightScene() {
  return (
    <svg
      viewBox="0 0 960 540"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1020" />
          <stop offset="55%" stopColor="#121c33" />
          <stop offset="100%" stopColor="#1a2438" />
        </linearGradient>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2436" />
          <stop offset="100%" stopColor="#0e1420" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d0" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffd56a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffd56a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#dfefff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8ab4ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="taillight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd0d0" stopOpacity="1" />
          <stop offset="40%" stopColor="#ff5050" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ff3030" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="960" height="540" fill="url(#sky)" />

      {/* Distant city silhouette */}
      <g fill="#0d1526" opacity="0.95">
        <rect x="40" y="210" width="70" height="160" />
        <rect x="120" y="180" width="55" height="190" />
        <rect x="185" y="230" width="90" height="140" />
        <rect x="290" y="160" width="48" height="210" />
        <rect x="350" y="200" width="75" height="170" />
        <rect x="540" y="175" width="60" height="195" />
        <rect x="610" y="145" width="80" height="225" />
        <rect x="700" y="205" width="50" height="165" />
        <rect x="760" y="170" width="95" height="200" />
        <rect x="870" y="220" width="60" height="150" />
      </g>

      {/* Building windows */}
      <g fill="#f0c86a" opacity="0.75">
        {[
          [55, 230],
          [75, 255],
          [55, 290],
          [140, 200],
          [155, 240],
          [140, 280],
          [210, 250],
          [240, 270],
          [305, 190],
          [320, 230],
          [370, 230],
          [400, 260],
          [560, 200],
          [580, 245],
          [630, 180],
          [660, 220],
          [720, 230],
          [780, 200],
          [810, 250],
          [890, 250],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="8" height="10" rx="1" />
        ))}
      </g>

      {/* Road */}
      <path d="M0 370 L960 370 L960 540 L0 540 Z" fill="url(#road)" />
      <path
        d="M470 370 L490 370 L520 540 L440 540 Z"
        fill="#2a3348"
        opacity="0.8"
      />
      {/* Lane dashes */}
      {[400, 440, 480, 520].map((y, i) => (
        <rect
          key={i}
          x="472"
          y={y}
          width="16"
          height="18"
          rx="2"
          fill="#d4c07a"
          opacity="0.55"
        />
      ))}

      {/* Sidewalks */}
      <rect x="0" y="360" width="960" height="12" fill="#222b3d" />

      {/* Street lamps */}
      {[120, 320, 640, 840].map((x, i) => (
        <g key={i}>
          <rect x={x} y="250" width="4" height="120" fill="#3a4660" />
          <rect x={x - 14} y="248" width="32" height="6" rx="2" fill="#4a5874" />
          <circle cx={x + 2} cy="248" r="28" fill="url(#lampGlow)" />
          <circle cx={x + 2} cy="250" r="5" fill="#fff4c2" />
        </g>
      ))}

      {/* Oncoming car headlights */}
      <g>
        <rect x="380" y="400" width="70" height="28" rx="8" fill="#1a2233" />
        <circle cx="395" cy="414" r="22" fill="url(#headlight)" />
        <circle cx="435" cy="414" r="22" fill="url(#headlight)" />
        <circle cx="395" cy="414" r="5" fill="#ffffff" />
        <circle cx="435" cy="414" r="5" fill="#ffffff" />
      </g>

      {/* Traffic lights */}
      <g>
        <rect x="700" y="200" width="10" height="90" fill="#3a4660" />
        <rect x="688" y="190" width="34" height="70" rx="6" fill="#1a2233" stroke="#4a5874" />
        <circle cx="705" cy="208" r="8" fill="#ff4d4d" />
        <circle cx="705" cy="208" r="14" fill="#ff4d4d" opacity="0.35" />
        <circle cx="705" cy="230" r="8" fill="#f0b429" opacity="0.35" />
        <circle cx="705" cy="252" r="8" fill="#3dd6c6" opacity="0.25" />
      </g>

      <g>
        <rect x="230" y="210" width="10" height="80" fill="#3a4660" />
        <rect x="218" y="200" width="34" height="70" rx="6" fill="#1a2233" stroke="#4a5874" />
        <circle cx="235" cy="218" r="8" fill="#ff4d4d" opacity="0.3" />
        <circle cx="235" cy="240" r="8" fill="#f0b429" opacity="0.3" />
        <circle cx="235" cy="262" r="8" fill="#3dd6c6" />
        <circle cx="235" cy="262" r="14" fill="#3dd6c6" opacity="0.35" />
      </g>

      {/* Cars ahead — taillights */}
      <g>
        <rect x="560" y="390" width="80" height="26" rx="7" fill="#182030" />
        <circle cx="575" cy="403" r="16" fill="url(#taillight)" />
        <circle cx="625" cy="403" r="16" fill="url(#taillight)" />
        <circle cx="575" cy="403" r="4" fill="#ff8080" />
        <circle cx="625" cy="403" r="4" fill="#ff8080" />
      </g>
      <g>
        <rect x="250" y="420" width="95" height="30" rx="8" fill="#182030" />
        <circle cx="270" cy="435" r="18" fill="url(#taillight)" />
        <circle cx="325" cy="435" r="18" fill="url(#taillight)" />
      </g>

      {/* Neon shop signs */}
      <rect x="780" y="280" width="70" height="18" rx="3" fill="#3dd6c6" opacity="0.85" />
      <rect x="780" y="280" width="70" height="18" rx="3" fill="#3dd6c6" opacity="0.25" />
      <rect x="90" y="300" width="55" height="14" rx="3" fill="#7dd3fc" opacity="0.7" />

      {/* Wet road reflections */}
      <ellipse cx="395" cy="480" rx="30" ry="8" fill="#dfefff" opacity="0.12" />
      <ellipse cx="435" cy="480" rx="30" ry="8" fill="#dfefff" opacity="0.12" />
      <ellipse cx="575" cy="455" rx="20" ry="6" fill="#ff6060" opacity="0.15" />
      <ellipse cx="625" cy="455" rx="20" ry="6" fill="#ff6060" opacity="0.15" />
      <ellipse cx="122" cy="430" rx="18" ry="5" fill="#ffd56a" opacity="0.12" />
      <ellipse cx="642" cy="430" rx="18" ry="5" fill="#ffd56a" opacity="0.12" />
    </svg>
  )
}
