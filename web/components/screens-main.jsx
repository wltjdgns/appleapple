// Main scene variants

function PrimaryButton({ children, variant = "primary", disabled = false, icon = null, onClick }) {
  const styles = {
    primary: { bg: 'var(--apple)', color: '#fff', border: 'transparent', shadow: '0 1px 0 #6B1212 inset, 0 -2px 0 #8E1A1A inset, 0 8px 18px rgba(155,28,28,0.25)' },
    secondary: { bg: 'var(--paper-warm)', color: 'var(--ink)', border: 'var(--hairline)', shadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 -2px 0 rgba(0,0,0,0.06) inset, 0 4px 12px rgba(107,66,38,0.08)' },
    ghost: { bg: 'transparent', color: 'var(--ink-soft)', border: 'var(--hairline)', shadow: 'none' },
    dark: { bg: 'var(--ink)', color: '#FAF5EC', border: 'transparent', shadow: '0 1px 0 rgba(255,255,255,0.10) inset, 0 -2px 0 rgba(0,0,0,0.30) inset, 0 8px 18px rgba(0,0,0,0.18)' },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button disabled={disabled} onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '16px 24px',
      fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 700,
      background: s.bg, color: s.color,
      border: '1.5px solid', borderColor: s.border === 'transparent' ? 'transparent' : `var(--hairline)`,
      borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: s.shadow,
      opacity: disabled ? 0.5 : 1,
      letterSpacing: '-0.01em', minHeight: 56,
    }}>
      {icon}{children}
    </button>
  );
}

function MainScreen({ onStart, onRecords, onLeaderboard, user, onLogin, onLogout, onLoginAsGuest }) {
  return (
    <>
    <style>{`
      .main-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; width: 100%; height: 100%; }
      .main-left { padding: clamp(24px, 5vw, 52px) clamp(24px, 5vw, 56px); display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 1; }
      .main-title { font-size: clamp(60px, 8vw, 124px); line-height: 0.9; margin: 0; letter-spacing: -0.045em; }
      .mascot-container { position: absolute; left: 50%; top: 50%; transform: translate(-55%, -50%); }
      .mascot-container svg { width: clamp(150px, 20vw, 300px); height: auto; }
      @media (max-width: 850px) {
        .main-grid { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
        .main-right { display: none; }
      }
    `}</style>
    <div className="main-grid" style={{
      background: 'var(--paper)', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body)'
    }}>
      {/* paper texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 80% 10%, rgba(244,162,97,0.18), transparent 50%),
                     radial-gradient(ellipse at 10% 90%, rgba(45,106,79,0.10), transparent 50%)`,
        pointerEvents: 'none'
      }}/>

      {/* Left: brand + actions */}
      <div className="main-left">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', background: 'var(--paper-warm)', borderRadius: 999,
            border: '1px solid var(--hairline)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--leaf-light)' }}/>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>Season · 가을 출하중</span>
          </div>
          {user && (
             <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
               환영합니다, <strong style={{ color: 'var(--apple)' }}>{user.displayName || user.name}</strong>님!
             </div>
          )}
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-en)', fontSize: 14, letterSpacing: '0.30em',
            color: 'var(--apple-deep)', textTransform: 'uppercase', marginBottom: 14, marginTop: 20
          }}>
            Orchard · Sum to Ten
          </div>
          <h1 className="main-title" style={{
            fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 700
          }}>
            사과<br/>사과<span style={{ color: 'var(--apple)' }}>게임</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--ink-soft)',
            margin: '20px 0 0', maxWidth: 380, lineHeight: 1.5
          }}>
            합이 <strong style={{ color: 'var(--apple)' }}>10</strong>이 되도록 사과를 묶어 따세요.
            120초, 한 바구니 가득.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, marginTop: 20, marginBottom: 20 }}>
          {!user ? (
            <>
              <PrimaryButton onClick={onLogin} icon={<span>G</span>}>구글 로그인</PrimaryButton>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="text" id="guest-name-input" placeholder="게스트 닉네임" style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--hairline)',
                  fontFamily: 'var(--font-body)', minWidth: 0
                }} />
                <button onClick={() => onLoginAsGuest(document.getElementById('guest-name-input').value)} style={{
                   padding: '12px 20px', borderRadius: 10, border: '1px solid var(--hairline)',
                   background: 'var(--paper-warm)', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap'
                }}>게스트 시작</button>
              </div>
            </>
          ) : (
            <>
              <PrimaryButton onClick={onStart} variant="primary" icon={<span style={{ fontSize: 18 }}>🍎</span>}>혼자 따러 가기</PrimaryButton>
              <PrimaryButton variant="secondary" disabled>같이 따기 <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 500, marginLeft: 4 }}>· COMING SOON</span></PrimaryButton>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <button onClick={onRecords} style={{
                  flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  background: 'transparent', color: 'var(--ink-soft)',
                  border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer'
                }}>나의 바구니</button>
                <button onClick={onLeaderboard} style={{
                  flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  background: 'transparent', color: 'var(--ink-soft)',
                  border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer'
                }}>리더보드</button>
              </div>
              <button onClick={onLogout} style={{
                padding: '8px', background: 'transparent', border: 'none', color: 'var(--ink-mute)',
                fontSize: 12, cursor: 'pointer', textDecoration: 'underline'
              }}>로그아웃</button>
            </>
          )}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em',
          color: 'var(--ink-mute)', textTransform: 'uppercase'
        }}>
          v0.1 · integrated orchard build · made with 🍎
        </div>
      </div>

      {/* Right: mascot + apple stack */}
      <div className="main-right" style={{
        position: 'relative', background: 'var(--paper-warm)',
        borderLeft: '1px solid var(--hairline)', overflow: 'hidden'
      }}>
        {/* decorative apples */}
        <div style={{ position: 'absolute', top: 60, right: 80 }}><AppleCell n={3} size={88} shape="realistic" /></div>
        <div style={{ position: 'absolute', top: 130, right: 200 }}><AppleCell n={7} size={68} shape="realistic" /></div>
        <div style={{ position: 'absolute', top: 220, right: 50 }}><AppleCell n={5} size={56} shape="realistic" /></div>
        <div style={{ position: 'absolute', bottom: 110, right: 160 }}><AppleCell n={2} size={50} shape="realistic" /></div>
        <div style={{ position: 'absolute', bottom: 60, right: 50, opacity: 0.9 }}><AppleCell n={8} size={64} shape="realistic" /></div>

        {/* mascot */}
        <div className="mascot-container">
          <AppleMascot size={300} mood="happy" />
        </div>

        {/* speech bubble */}
        <div style={{
          position: 'absolute', left: '10%', top: '10%',
          padding: '14px 18px', background: 'var(--paper)', borderRadius: '20px 20px 20px 4px',
          border: '1.5px solid var(--ink)',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(14px, 2vw, 22px)', color: 'var(--ink)', fontWeight: 700,
          boxShadow: '4px 4px 0 var(--ink)'
        }}>
          오늘도 한바구니, <span style={{ color: 'var(--apple)' }}>같이 따자!</span>
        </div>

        {/* footer tape */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 28px', background: 'var(--ink)', color: 'var(--paper)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase'
        }}>
          <span>토토 농장 직송</span>
          <span style={{ color: 'var(--honey)' }}>★ ★ ★ ★ ★</span>
          <span>Hand-Picked Daily</span>
        </div>
      </div>
    </div>
    </>
  );
}

Object.assign(window, { MainScreen, PrimaryButton });
