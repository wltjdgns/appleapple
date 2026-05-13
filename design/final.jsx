// final.jsx — locked prototype: 메인A · 설정B · 게임A · 결과A · 기록A
// Navigation via click delegation on button text content.

const { useState, useEffect, useRef } = React;

// Lock the design tokens — fresh palette, IBM Plex, round apples
const LOCKED_PALETTE = {
  '--paper':       '#F8FBF2',
  '--paper-warm':  '#EAF2DA',
  '--paper-dark':  '#D6E4B8',
  '--hairline':    '#C3D2A4',
  '--apple':       '#E63946',
  '--apple-deep':  '#A91D29',
  '--apple-bright':'#FF6B6B',
  '--leaf':        '#1B4332',
  '--leaf-light':  '#74C69D',
  '--gold':        '#F4A261',
  '--honey':       '#FFD166',
  '--ink':         '#1B2410',
  '--ink-soft':    '#3D4C24',
  '--ink-mute':    '#7B8868',
  '--font-display':'"IBM Plex Sans KR", "Pretendard", sans-serif',
  '--font-body':   '"IBM Plex Sans KR", "Pretendard", sans-serif',
  '--font-num':    '"IBM Plex Sans KR", "Pretendard", sans-serif',
  '--font-num-weight': 700,
};
for (const [k, v] of Object.entries(LOCKED_PALETTE)) {
  document.documentElement.style.setProperty(k, v);
}

// AppleCell defaults shape to "round" via wrapper
const RawAppleCell = window.AppleCell;
window.AppleCell = function LockedAppleCell(props) {
  return <RawAppleCell shape={props.shape || 'round'} {...props} />;
};

// ─── Navigation routing ─────────────────────────────────────────────────
// Maps button text fragments → target screen
const ROUTES = [
  // main
  { from: 'main',     match: /혼자 따러|혼자하기/,         to: 'settings' },
  { from: 'main',     match: /나의 바구니|나의 기록|기록/,  to: 'records' },
  { from: 'main',     match: /리더보드/,                   to: 'records' },
  // settings
  { from: 'settings', match: /게임 시작/,                  to: 'game' },
  { from: 'settings', match: /뒤로/,                       to: 'main' },
  // game
  { from: 'game',     match: /나가기/,                     to: 'result' },
  // result
  { from: 'result',   match: /한 번 더|한 판 더|다시/,     to: 'game' },
  { from: 'result',   match: /다른 설정|설정 바꾸기/,       to: 'settings' },
  { from: 'result',   match: /메인으로/,                   to: 'main' },
  // records
  { from: 'records',  match: /메인으로/,                   to: 'main' },
];

function App() {
  const [screen, setScreen] = useState('main');
  const [transitioning, setTransitioning] = useState(false);
  const rootRef = useRef(null);

  // Game timer simulation (visual only — counts down from 1:34)
  useEffect(() => {
    if (screen !== 'game') return;
    // No state change; the static frame already shows 01:34
  }, [screen]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const handler = (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      if (btn.closest('.twk-panel')) return; // ignore tweaks-panel buttons
      const txt = (btn.textContent || '').trim();
      const matches = ROUTES.filter(r => r.from === screen && r.match.test(txt));
      if (matches.length) {
        const next = matches[0].to;
        if (next === screen) return;
        setTransitioning(true);
        setTimeout(() => {
          setScreen(next);
          setTransitioning(false);
        }, 180);
      }
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [screen]);

  const screenComponent = (() => {
    switch (screen) {
      case 'main':     return <MainA />;
      case 'settings': return <SettingsB />;
      case 'game':     return <GameA />;
      case 'result':   return <ResultA />;
      case 'records':  return <RecordsA />;
      default:         return <MainA />;
    }
  })();

  return (
    <div ref={rootRef} style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1B2410'
    }}>
      <div style={{
        position: 'relative',
        width: 'min(100vw, 1280px)',
        aspectRatio: '16 / 10',
        maxHeight: '100vh',
        background: 'var(--paper)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        borderRadius: 0
      }}>
        <div key={screen} style={{
          width: '100%', height: '100%',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 180ms ease, transform 180ms ease'
        }}>
          {screenComponent}
        </div>

        {/* tiny screen indicator (bottom-right) */}
        <div style={{
          position: 'absolute', right: 12, bottom: 12,
          display: 'flex', gap: 4, padding: '4px 8px',
          background: 'rgba(27,36,16,0.65)', borderRadius: 999,
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(248,251,242,0.85)',
          pointerEvents: 'none', zIndex: 10
        }}>
          {['main','settings','game','result','records'].map((s, i) => (
            <span key={s} style={{
              opacity: s === screen ? 1 : 0.35,
              fontWeight: s === screen ? 700 : 400
            }}>{i+1}.{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
