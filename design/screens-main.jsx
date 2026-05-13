// Main scene variants

function PrimaryButton({ children, variant = "primary", disabled = false, icon = null }) {
  const styles = {
    primary: { bg: 'var(--apple)', color: '#fff', border: 'transparent', shadow: '0 1px 0 #6B1212 inset, 0 -2px 0 #8E1A1A inset, 0 8px 18px rgba(155,28,28,0.25)' },
    secondary: { bg: 'var(--paper-warm)', color: 'var(--ink)', border: 'var(--hairline)', shadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 -2px 0 rgba(0,0,0,0.06) inset, 0 4px 12px rgba(107,66,38,0.08)' },
    ghost: { bg: 'transparent', color: 'var(--ink-soft)', border: 'var(--hairline)', shadow: 'none' },
    dark: { bg: 'var(--ink)', color: '#FAF5EC', border: 'transparent', shadow: '0 1px 0 rgba(255,255,255,0.10) inset, 0 -2px 0 rgba(0,0,0,0.30) inset, 0 8px 18px rgba(0,0,0,0.18)' },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button disabled={disabled} style={{
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

// ─── Option A: Orchard Hero ──────────────────────────────────────────────
function MainA() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      position: 'relative', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
      fontFamily: 'var(--font-body)'
    }}>
      {/* paper texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 80% 10%, rgba(244,162,97,0.18), transparent 50%),
                     radial-gradient(ellipse at 10% 90%, rgba(45,106,79,0.10), transparent 50%)`,
        pointerEvents: 'none'
      }}/>

      {/* Left: brand + actions */}
      <div style={{
        padding: '52px 56px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative', zIndex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', background: 'var(--paper-warm)', borderRadius: 999,
            border: '1px solid var(--hairline)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--leaf-light)' }}/>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>Season · 가을 출하중</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ink-soft)' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>♥ 2,418</span>
            <span style={{ color: 'var(--ink-mute)' }}>·</span>
            <span>오늘 함께 푼 사람</span>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-en)', fontSize: 14, letterSpacing: '0.30em',
            color: 'var(--apple-deep)', textTransform: 'uppercase', marginBottom: 14
          }}>
            Orchard · Sum to Ten
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 124, lineHeight: 0.9,
            color: 'var(--ink)', fontWeight: 700, margin: 0, letterSpacing: '-0.045em'
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
          <PrimaryButton variant="primary" icon={<span style={{ fontSize: 18 }}>🍎</span>}>혼자 따러 가기</PrimaryButton>
          <PrimaryButton variant="secondary">같이 따기 <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 500, marginLeft: 4 }}>· COMING SOON</span></PrimaryButton>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <button style={{
              flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: 'transparent', color: 'var(--ink-soft)',
              border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer'
            }}>나의 바구니</button>
            <button style={{
              flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: 'transparent', color: 'var(--ink-soft)',
              border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer'
            }}>리더보드</button>
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em',
          color: 'var(--ink-mute)', textTransform: 'uppercase'
        }}>
          v0.1 · sun-dried orchard build · made with 🍎
        </div>
      </div>

      {/* Right: mascot + apple stack */}
      <div style={{
        position: 'relative', background: 'var(--paper-warm)',
        borderLeft: '1px solid var(--hairline)', overflow: 'hidden'
      }}>
        {/* decorative apples */}
        <div style={{ position: 'absolute', top: 60, right: 80 }}>
          <AppleCell n={3} size={88} shape="realistic" />
        </div>
        <div style={{ position: 'absolute', top: 130, right: 200 }}>
          <AppleCell n={7} size={68} shape="realistic" />
        </div>
        <div style={{ position: 'absolute', top: 220, right: 50 }}>
          <AppleCell n={5} size={56} shape="realistic" />
        </div>
        <div style={{ position: 'absolute', bottom: 110, right: 160 }}>
          <AppleCell n={2} size={50} shape="realistic" />
        </div>
        <div style={{ position: 'absolute', bottom: 60, right: 50, opacity: 0.9 }}>
          <AppleCell n={8} size={64} shape="realistic" />
        </div>

        {/* mascot */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-55%, -50%)'
        }}>
          <AppleMascot size={300} mood="happy" />
        </div>

        {/* speech bubble */}
        <div style={{
          position: 'absolute', left: 60, top: 80,
          padding: '14px 18px', background: 'var(--paper)', borderRadius: '20px 20px 20px 4px',
          border: '1.5px solid var(--ink)',
          fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', fontWeight: 700,
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
  );
}

// ─── Option B: Crate / mosaic ─────────────────────────────────────────────
function MainB() {
  const apples = [];
  const cols = 12, rows = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      apples.push({ r, c, n: ((r * 7 + c * 3) % 9) + 1 });
    }
  }
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--ink)',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-body)'
    }}>
      {/* apple grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
        opacity: 0.55, transform: 'rotate(-4deg) scale(1.15)', transformOrigin: 'center'
      }}>
        {apples.map((a, i) => (
          <div key={i} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppleCell n={a.n} size={84} shape="realistic" />
          </div>
        ))}
      </div>
      {/* vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(31,24,18,0.5) 50%, rgba(31,24,18,0.92) 100%)'
      }}/>

      {/* centered card */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--paper)', padding: '48px 56px', borderRadius: 24,
          minWidth: 440, textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          border: '1px solid var(--hairline)'
        }}>
          <div style={{
            fontFamily: 'var(--font-en)', fontSize: 12, letterSpacing: '0.32em',
            color: 'var(--apple-deep)', textTransform: 'uppercase', marginBottom: 18
          }}>
            ★ Welcome to the Orchard ★
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 86, lineHeight: 0.95,
            color: 'var(--ink)', fontWeight: 700, margin: 0, letterSpacing: '-0.04em'
          }}>
            사과사과<br/><span style={{ color: 'var(--apple)' }}>게임</span>
          </h1>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)',
            marginTop: 16, marginBottom: 32, lineHeight: 1.5
          }}>
            합이 <strong>10</strong>인 사과들을 묶어 따요.<br/>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>120s · 17 × 10 · 클래식</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton variant="primary">혼자하기</PrimaryButton>
            <PrimaryButton variant="ghost">같이하기 · COMING SOON</PrimaryButton>
          </div>
          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--hairline)',
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
            color: 'var(--ink-mute)', textTransform: 'uppercase'
          }}>
            <span>나의 기록</span>
            <span>리더보드</span>
            <span>설정</span>
          </div>
        </div>
      </div>

      {/* corner banner */}
      <div style={{
        position: 'absolute', top: 24, left: 24,
        padding: '8px 14px', background: 'var(--apple)', color: '#fff',
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        borderRadius: 4, transform: 'rotate(-3deg)'
      }}>
        sun-dried · 2026
      </div>
    </div>
  );
}

// ─── Option C: Editorial / Magazine ──────────────────────────────────────
function MainC() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper-warm)',
      padding: 0, display: 'grid', gridTemplateRows: '64px 1fr 56px',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      {/* top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 36px', borderBottom: '1.5px solid var(--ink)', background: 'var(--paper)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink)' }}>
          <AppleCell n={1} size={28} shape="realistic" leaf={false}/>
          사과사과게임 · ED. 01
        </div>
        <div style={{ display: 'flex', gap: 28, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-soft)' }}>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>HOME</span>
          <span>PLAY</span>
          <span>ARCHIVE</span>
          <span>ABOUT</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
          2026.05 · vol.1
        </div>
      </div>

      {/* hero grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr',
        padding: 36, gap: 28
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)',
              letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12
            }}>
              ── 이번 호의 주제
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 140, lineHeight: 0.85,
              color: 'var(--ink)', fontWeight: 700, margin: 0, letterSpacing: '-0.05em'
            }}>
              합이<br/><em style={{ fontFamily: 'var(--font-en)', color: 'var(--apple)', fontWeight: 400 }}>ten</em><br/>이 되도록.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
            <PrimaryButton variant="dark">혼자하기 →</PrimaryButton>
            <PrimaryButton variant="ghost">같이하기</PrimaryButton>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
            background: 'var(--apple)', padding: 24, borderRadius: 18, color: '#fff',
            flex: 1, position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: -10, bottom: -10 }}>
              <AppleCell n={10} size={140} shape="realistic" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', opacity: 0.85, textTransform: 'uppercase' }}>
              Rule No.1
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, fontWeight: 700,
              marginTop: 12, letterSpacing: '-0.02em'
            }}>
              ∑ = 10
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, marginTop: 16, lineHeight: 1.5, opacity: 0.95, maxWidth: 180 }}>
              드래그한 영역의 사과 숫자 합이 정확히 10이면 한꺼번에 사라집니다.
            </div>
          </div>
          <div style={{
            background: 'var(--paper)', padding: 20, borderRadius: 18,
            border: '1px solid var(--hairline)'
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <AppleCell n={2} size={36} shape="realistic" />
              <AppleCell n={3} size={36} shape="realistic" />
              <AppleCell n={1} size={36} shape="realistic" />
              <AppleCell n={4} size={36} shape="realistic" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
              2 + 3 + 1 + 4 = <strong style={{ color: 'var(--apple)' }}>10</strong> ✓
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ position: 'relative', flex: 1, background: 'var(--ink)', borderRadius: 18, padding: 24, color: 'var(--paper)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20 }}>
              <AppleMascot size={160} mood="happy" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--honey)' }}>
              안내자 · 토토
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.1, fontWeight: 700,
              marginTop: 70, letterSpacing: '-0.01em'
            }}>
              "이번엔<br/>몇 개나<br/>딸 거야?"
            </div>
          </div>
          <div style={{
            background: 'var(--paper)', padding: '14px 18px', borderRadius: 12,
            border: '1px solid var(--hairline)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>YOUR BEST</div>
              <div style={{ fontFamily: 'var(--font-num)', fontSize: 32, color: 'var(--apple)', lineHeight: 1 }}>147</div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-soft)', textAlign: 'right' }}>
              17 × 10<br/>오리지널 · 120s
            </div>
          </div>
        </div>
      </div>

      {/* bottom marquee */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        display: 'flex', alignItems: 'center',
        padding: '0 36px', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase'
      }}>
        <span>★ 합 = 10 · 사과당 1점 · 120s</span>
        <span style={{ color: 'var(--honey)' }}>sun-dried orchard</span>
        <span>편집 · 2026</span>
      </div>
    </div>
  );
}

Object.assign(window, { MainA, MainB, MainC, PrimaryButton });
