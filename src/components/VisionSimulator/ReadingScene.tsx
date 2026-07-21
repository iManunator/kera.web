interface SceneProps {
  uid?: string
}

/** Near-vision reading / letter chart scene. */
export function ReadingScene({ uid = 'read' }: SceneProps) {
  const g = (name: string) => `${uid}-${name}`

  const rows: { size: number; letters: string; y: number }[] = [
    { size: 56, letters: 'E', y: 110 },
    { size: 42, letters: 'F P', y: 175 },
    { size: 32, letters: 'T O Z', y: 235 },
    { size: 24, letters: 'L P E D', y: 290 },
    { size: 18, letters: 'P E C F D', y: 338 },
    { size: 14, letters: 'E D F C Z P', y: 380 },
    { size: 11, letters: 'F E L O P Z D', y: 415 },
    { size: 9, letters: 'D E F P O T E C', y: 445 },
  ]

  return (
    <svg
      viewBox="0 0 960 540"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g('desk')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a484" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id={g('wall')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef5" />
          <stop offset="100%" stopColor="#d5dde8" />
        </linearGradient>
      </defs>

      <rect width="960" height="540" fill={`url(#${g('wall')})`} />

      {/* Soft window light */}
      <rect x="720" y="40" width="180" height="160" rx="4" fill="#b8d4f0" opacity="0.7" />
      <rect x="720" y="40" width="180" height="160" rx="4" fill="none" stroke="#94a3b8" strokeWidth="4" />
      <line x1="810" y1="40" x2="810" y2="200" stroke="#94a3b8" strokeWidth="3" />
      <line x1="720" y1="120" x2="900" y2="120" stroke="#94a3b8" strokeWidth="3" />

      {/* Desk */}
      <rect x="0" y="460" width="960" height="80" fill={`url(#${g('desk')})`} />

      {/* Chart card */}
      <rect
        x="180"
        y="40"
        width="520"
        height="420"
        rx="12"
        fill="#fafafa"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <text
        x="440"
        y="78"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="18"
        fontFamily="IBM Plex Sans, sans-serif"
        fontWeight="700"
        letterSpacing="2"
      >
        NEAR VISION CHART
      </text>

      {rows.map((row, i) => (
        <text
          key={i}
          x="440"
          y={row.y}
          textAnchor="middle"
          fill="#0f172a"
          fontSize={row.size}
          fontFamily="IBM Plex Sans, sans-serif"
          fontWeight="600"
          letterSpacing={Math.max(4, row.size * 0.2)}
        >
          {row.letters}
        </text>
      ))}

      {/* Paragraph sample */}
      <rect x="740" y="240" width="180" height="200" rx="8" fill="#fffef8" stroke="#d6d3d1" />
      <text
        x="830"
        y="270"
        textAnchor="middle"
        fill="#44403c"
        fontSize="11"
        fontFamily="Instrument Serif, Georgia, serif"
      >
        Sample paragraph
      </text>
      {[
        'The quick brown fox',
        'jumps over the lazy',
        'dog near the river.',
        'Keratoconus can make',
        'fine print ghost and',
        'blur even in daylight.',
      ].map((line, i) => (
        <text
          key={i}
          x="755"
          y={295 + i * 20}
          fill="#57534e"
          fontSize="10"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          {line}
        </text>
      ))}
    </svg>
  )
}
