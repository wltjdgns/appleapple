// AppleCell — SVG apple icon with a number inside. Three shape variants.
// Used both inside the game grid and as a brand element.

function AppleCell({ n = 1, size = 44, shape = "round", selected = false, ghost = false, leaf = true }) {
  const s = size;
  const fontSize = Math.round(s * 0.5);
  const ring = selected ? (
    <circle cx={s / 2} cy={s / 2 + s * 0.05} r={s * 0.46} fill="none"
            stroke="#FFD166" strokeWidth={s * 0.08} opacity="0.95" />
  ) : null;

  if (shape === "square") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
        {ring}
        <rect x={s*0.12} y={s*0.18} width={s*0.76} height={s*0.76} rx={s*0.12}
              fill={ghost ? "#EBDFC4" : "var(--apple, #D62828)"} />
        {!ghost && (
          <rect x={s*0.12} y={s*0.18} width={s*0.76} height={s*0.18} rx={s*0.12} fill="rgba(255,255,255,0.18)" />
        )}
        {leaf && !ghost && (
          <path d={`M ${s*0.62} ${s*0.18} q ${s*0.08} -${s*0.10} ${s*0.18} -${s*0.04} q -${s*0.04} ${s*0.12} -${s*0.18} ${s*0.06} z`}
                fill="var(--leaf, #2D6A4F)" />
        )}
        <text x={s/2} y={s/2 + s*0.02} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--font-num)" fontSize={fontSize} fill={ghost ? "#B8A98A" : "#fff"}
              style={{ fontWeight: 'var(--font-num-weight, 900)', letterSpacing: '-0.02em' }}>{n}</text>
      </svg>
    );
  }

  if (shape === "realistic") {
    // Apple body with subtle indent at top, stem, leaf, highlight
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
        {ring}
        <defs>
          <radialGradient id={`ag-${n}-${size}-r`} cx="0.35" cy="0.30" r="0.85">
            <stop offset="0" stopColor={ghost ? "#E5D8BB" : "var(--apple-bright, #F25C54)"} />
            <stop offset="0.55" stopColor={ghost ? "#D9CBA8" : "var(--apple, #D62828)"} />
            <stop offset="1" stopColor={ghost ? "#C9BB95" : "var(--apple-deep, #9B1C1C)"} />
          </radialGradient>
        </defs>
        {/* stem */}
        <path d={`M ${s*0.50} ${s*0.18} Q ${s*0.53} ${s*0.10} ${s*0.56} ${s*0.13}`}
              stroke={ghost ? "#A6936E" : "var(--bark, #6B4226)"} strokeWidth={s*0.04} strokeLinecap="round" fill="none" />
        {/* leaf */}
        {leaf && (
          <path d={`M ${s*0.55} ${s*0.16} Q ${s*0.72} ${s*0.08} ${s*0.78} ${s*0.22} Q ${s*0.66} ${s*0.24} ${s*0.55} ${s*0.20} Z`}
                fill={ghost ? "#B8B093" : "var(--leaf, #2D6A4F)"} />
        )}
        {/* body */}
        <path d={`
          M ${s*0.50} ${s*0.22}
          C ${s*0.20} ${s*0.20} ${s*0.10} ${s*0.46} ${s*0.14} ${s*0.66}
          C ${s*0.18} ${s*0.86} ${s*0.34} ${s*0.94} ${s*0.50} ${s*0.92}
          C ${s*0.66} ${s*0.94} ${s*0.82} ${s*0.86} ${s*0.86} ${s*0.66}
          C ${s*0.90} ${s*0.46} ${s*0.80} ${s*0.20} ${s*0.50} ${s*0.22} Z`}
          fill={`url(#ag-${n}-${size}-r)`} />
        {/* highlight */}
        {!ghost && (
          <ellipse cx={s*0.34} cy={s*0.36} rx={s*0.10} ry={s*0.06} fill="rgba(255,255,255,0.35)" transform={`rotate(-30 ${s*0.34} ${s*0.36})`} />
        )}
        <text x={s*0.50} y={s*0.60} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--font-num)" fontSize={fontSize}
              fill={ghost ? "#A89875" : "#FFF7E8"}
              style={{ fontWeight: 'var(--font-num-weight, 900)', letterSpacing: '-0.02em' }}>{n}</text>
      </svg>
    );
  }

  // "round" — flat circle
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
      {ring}
      <circle cx={s/2} cy={s/2 + s*0.04} r={s*0.40}
              fill={ghost ? "#E0D2B0" : "var(--apple, #D62828)"} />
      {!ghost && (
        <ellipse cx={s*0.38} cy={s*0.34} rx={s*0.10} ry={s*0.05} fill="rgba(255,255,255,0.30)" transform={`rotate(-25 ${s*0.38} ${s*0.34})`} />
      )}
      {leaf && !ghost && (
        <>
          <path d={`M ${s*0.50} ${s*0.20} Q ${s*0.52} ${s*0.12} ${s*0.56} ${s*0.14}`}
                stroke="var(--bark, #6B4226)" strokeWidth={s*0.03} strokeLinecap="round" fill="none" />
          <path d={`M ${s*0.54} ${s*0.16} Q ${s*0.66} ${s*0.10} ${s*0.70} ${s*0.20} Q ${s*0.62} ${s*0.22} ${s*0.54} ${s*0.20} Z`}
                fill="var(--leaf, #2D6A4F)" />
        </>
      )}
      <text x={s/2} y={s/2 + s*0.06} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-num)" fontSize={fontSize}
            fill={ghost ? "#A89875" : "#FFF7E8"}
            style={{ fontWeight: 'var(--font-num-weight, 900)', letterSpacing: '-0.02em' }}>{n}</text>
    </svg>
  );
}

// Mascot — friendly apple character with face, used on main + result screens.
function AppleMascot({ size = 200, mood = "happy" }) {
  const s = size;
  const eyeOpen = mood !== "sleepy";
  const smile = mood === "happy" ? 1 : mood === "panic" ? -1 : 0.3;
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="mascot-body" cx="0.35" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#F25C54" />
          <stop offset="0.5" stopColor="#D62828" />
          <stop offset="1" stopColor="#8E1A1A" />
        </radialGradient>
        <radialGradient id="mascot-leaf" cx="0.3" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#74C69D" />
          <stop offset="1" stopColor="#1B4332" />
        </radialGradient>
      </defs>
      {/* stem */}
      <path d="M 100 38 Q 108 22 116 28" stroke="#6B4226" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* leaf */}
      <path d="M 114 30 Q 150 16 160 50 Q 130 52 112 38 Z" fill="url(#mascot-leaf)" />
      <path d="M 120 36 Q 138 30 152 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      {/* body */}
      <path d="
        M 100 46
        C 40 42 22 96 28 130
        C 34 168 64 184 100 180
        C 136 184 166 168 172 130
        C 178 96 160 42 100 46 Z" fill="url(#mascot-body)" />
      {/* cheek blush */}
      <ellipse cx="58" cy="130" rx="14" ry="9" fill="#FFB199" opacity="0.55" />
      <ellipse cx="142" cy="130" rx="14" ry="9" fill="#FFB199" opacity="0.55" />
      {/* highlight */}
      <ellipse cx="60" cy="80" rx="20" ry="12" fill="rgba(255,255,255,0.30)" transform="rotate(-30 60 80)" />
      {/* eyes */}
      {eyeOpen ? (
        <>
          <ellipse cx="76" cy="108" rx="6" ry="8" fill="#1F1812" />
          <ellipse cx="124" cy="108" rx="6" ry="8" fill="#1F1812" />
          <circle cx="78" cy="105" r="2" fill="#fff" />
          <circle cx="126" cy="105" r="2" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M 70 108 Q 76 102 82 108" stroke="#1F1812" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 118 108 Q 124 102 130 108" stroke="#1F1812" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* mouth */}
      {smile > 0 ? (
        <path d={`M 86 138 Q 100 ${138 + smile * 14} 114 138`} stroke="#1F1812" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : smile < 0 ? (
        <path d="M 86 142 Q 100 130 114 142" stroke="#1F1812" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : (
        <line x1="92" y1="140" x2="108" y2="140" stroke="#1F1812" strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

Object.assign(window, { AppleCell, AppleMascot });
