// Result + Records scene variants

// ─── Result A: Mascot celebration ───────────────────────────────────────
function ResultA() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 50% 30%, rgba(244,162,97,0.30), transparent 60%), var(--paper)`,
      padding: 36, display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      {/* confetti apples */}
      {[
        { l: '6%', t: '8%', n: 7, s: 36, rot: -12 },
        { l: '90%', t: '12%', n: 3, s: 44, rot: 18 },
        { l: '10%', t: '60%', n: 2, s: 30, rot: -22 },
        { l: '88%', t: '70%', n: 8, s: 40, rot: 8 },
        { l: '50%', t: '5%', n: 5, s: 26, rot: 0 },
        { l: '20%', t: '85%', n: 1, s: 32, rot: 25 },
        { l: '78%', t: '38%', n: 9, s: 28, rot: -15 },
      ].map((a, i) => (
        <div key={i} style={{
          position: 'absolute', left: a.l, top: a.t, transform: `rotate(${a.rot}deg)`,
          opacity: 0.65, pointerEvents: 'none'
        }}>
          <AppleCell n={a.n} size={a.s} shape="realistic" />
        </div>
      ))}

      {/* top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          ── GAME OVER · 2026.05.13
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '4px 12px', background: 'var(--paper-warm)',
            borderRadius: 999, border: '1px solid var(--hairline)',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.05em'
          }}>17 × 10 · 오리지널 · 120s</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* left: mascot + ribbon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -10, padding: '8px 22px',
            background: 'var(--apple)', color: '#fff', borderRadius: 8,
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase',
            boxShadow: '3px 3px 0 var(--ink)',
            transform: 'rotate(-3deg)'
          }}>NEW BEST · 신기록</div>
          <AppleMascot size={280} mood="happy" />
          <div style={{
            marginTop: 10, fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)',
            fontWeight: 700, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.2
          }}>
            "이만큼 따왔어!"
          </div>
        </div>

        {/* right: score */}
        <div>
          <div style={{ fontFamily: 'var(--font-en)', fontSize: 16, color: 'var(--apple-deep)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Final Harvest
          </div>
          <div style={{
            fontFamily: 'var(--font-num)', fontSize: 220, color: 'var(--apple)',
            lineHeight: 0.9, letterSpacing: '-0.04em', marginTop: 8
          }}>
            147
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-soft)',
            marginTop: 4
          }}>
            <strong style={{ color: 'var(--ink)' }}>+ 28</strong> 이전 최고 대비 · <strong style={{ color: 'var(--leaf)' }}>86%</strong> 클리어
          </div>

          {/* stats */}
          <div style={{
            marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            paddingTop: 22, borderTop: '1px dashed var(--hairline)'
          }}>
            {[
              { label: 'COMBO', value: '×5', sub: 'best' },
              { label: 'CLEARS', value: '23', sub: 'regions' },
              { label: 'AVG', value: '6.4', sub: 'per region' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-num)', fontSize: 36, color: 'var(--ink)', lineHeight: 1, marginTop: 2 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* buttons */}
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton variant="primary">같은 모드로 한 번 더 →</PrimaryButton>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><PrimaryButton variant="secondary">다른 설정</PrimaryButton></div>
              <div style={{ flex: 1 }}><PrimaryButton variant="ghost">메인으로</PrimaryButton></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Result B: Receipt / orchard ticket ─────────────────────────────────
function ResultB() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper-warm)',
      padding: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '8%', opacity: 0.20, transform: 'rotate(-8deg)'
      }}><AppleCell n={4} size={120} shape="realistic"/></div>
      <div style={{
        position: 'absolute', bottom: '12%', right: '10%', opacity: 0.20, transform: 'rotate(12deg)'
      }}><AppleCell n={6} size={140} shape="realistic"/></div>

      {/* Receipt card */}
      <div style={{
        width: 420, background: 'var(--paper)', padding: 32,
        boxShadow: '0 30px 80px rgba(107,66,38,0.20), 0 1px 0 rgba(0,0,0,0.04)',
        position: 'relative',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), 95% 100%, 90% calc(100% - 12px), 85% 100%, 80% calc(100% - 12px), 75% 100%, 70% calc(100% - 12px), 65% 100%, 60% calc(100% - 12px), 55% 100%, 50% calc(100% - 12px), 45% 100%, 40% calc(100% - 12px), 35% 100%, 30% calc(100% - 12px), 25% 100%, 20% calc(100% - 12px), 15% 100%, 10% calc(100% - 12px), 5% 100%, 0 calc(100% - 12px))',
      }}>
        {/* header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--hairline)', paddingBottom: 16 }}>
          <AppleCell n={10} size={48} shape="realistic" />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', marginTop: 8
          }}>HARVEST RECEIPT</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)',
            fontWeight: 700, marginTop: 4
          }}>한 바구니 결산</div>
        </div>

        {/* line items */}
        <div style={{ padding: '18px 0', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' }}>
          {[
            ['MODE',         '17 × 10 · 오리지널'],
            ['DURATION',     '02:00 / 02:00'],
            ['CLEARS',       '23 regions'],
            ['BEST COMBO',   '×5'],
            ['MISSED',       '23 apples'],
            ['CLEAR RATE',   '86.4%'],
            ['DATE',         '2026.05.13 · 14:08'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dotted var(--hairline)' }}>
              <span>{k}</span>
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* total */}
        <div style={{
          background: 'var(--ink)', color: 'var(--paper)', padding: '14px 18px',
          borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          margin: '0 -4px'
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--honey)' }}>TOTAL</span>
          <span style={{ fontFamily: 'var(--font-num)', fontSize: 56, color: 'var(--honey)', lineHeight: 1 }}>147</span>
        </div>

        <div style={{
          marginTop: 14, padding: '8px 12px', background: 'var(--apple)', color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          textAlign: 'center', borderRadius: 6, fontWeight: 700
        }}>
          ★ NEW PERSONAL BEST · 신기록
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
            background: 'var(--ink)', color: 'var(--paper)', border: 'none',
            borderRadius: 10, cursor: 'pointer'
          }}>다시 →</button>
          <button style={{
            flex: 1, padding: '12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            background: 'transparent', color: 'var(--ink-soft)',
            border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer'
          }}>설정 바꾸기</button>
        </div>

        <div style={{
          marginTop: 18, textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          ★ thank you · 토토 농장 ★<br/>
          <span style={{ fontSize: 8 }}>· · · · · · · · · · · · · · · · · · · · · ·</span>
        </div>
      </div>

      {/* small mascot peek */}
      <div style={{ position: 'absolute', bottom: 36, left: 56 }}>
        <AppleMascot size={120} mood="sleepy" />
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-soft)',
          fontStyle: 'italic', textAlign: 'center', marginTop: -4
        }}>수고했어, 한 번 더?</div>
      </div>
    </div>
  );
}

// ─── Records ─────────────────────────────────────────────────────────────
function RecordsA() {
  const records = [
    { mode: '17 × 10 · 오리지널', plays: 47, best: 158, avg: 84, time: '2분', last: '오늘 14:08' },
    { mode: '25 × 15 · 오리지널', plays: 12, best: 312, avg: 218, time: '2분', last: '어제 21:42' },
    { mode: '17 × 10 · 10의 배수', plays: 8, best: 102, avg: 76, time: '2분', last: '3일 전' },
    { mode: '50 × 30 · 퍼펙트',    plays: 3, best: 1499, avg: 1320, time: '무한', last: '1주 전' },
    { mode: '17 × 10 · 무한',     plays: 5, best: 168, avg: 142, time: '무한', last: '2주 전' },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      {/* top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 나의 기록 · ARCHIVE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
            한 해의 수확.
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-soft)', marginTop: 8 }}>
            지금까지 따낸 사과들의 기록. 모드별로 정렬되어 있어요.
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 8
        }}>
          <button style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 999, cursor: 'pointer' }}>전체</button>
          <button style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer' }}>2분</button>
          <button style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer' }}>무한</button>
        </div>
      </div>

      {/* summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'TOTAL PLAYS', value: '75', sub: '회 플레이' },
          { label: 'TOTAL APPLES', value: '8,492', sub: '개 수확' },
          { label: 'BEST EVER', value: '1,499', sub: '50×30 퍼펙트' },
          { label: 'AVG / GAME', value: '113', sub: '점' },
        ].map(t => (
          <div key={t.label} style={{
            background: 'var(--paper-warm)', padding: 18, borderRadius: 14,
            border: '1px solid var(--hairline)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{t.label}</div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 40, color: 'var(--ink)', lineHeight: 1, marginTop: 4 }}>{t.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{t.sub}</div>
          </div>
        ))}
      </div>

      {/* table */}
      <div style={{
        background: 'var(--paper)', borderRadius: 16,
        border: '1px solid var(--hairline)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr',
          padding: '14px 22px', background: 'var(--paper-warm)',
          borderBottom: '1.5px solid var(--ink)',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--ink-soft)', fontWeight: 700
        }}>
          <span>MODE</span><span>PLAYS</span><span>BEST</span><span>AVG</span><span>LAST PLAYED</span>
        </div>
        {records.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr',
            padding: '16px 22px', alignItems: 'center',
            borderBottom: i < records.length - 1 ? '1px solid var(--hairline)' : 'none',
            background: i === 0 ? 'rgba(244,162,97,0.08)' : 'transparent'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AppleCell n={(i % 9) + 1} size={28} shape="realistic" leaf={false} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{r.mode}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--ink)' }}>{r.plays}</span>
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--apple)' }}>{r.best}</span>
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--ink-soft)' }}>{r.avg}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-mute)' }}>{r.last}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
          가장 자주 플레이한 모드 · <strong style={{ color: 'var(--ink)' }}>17 × 10 · 오리지널 (47회)</strong>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryButton variant="ghost">메인으로</PrimaryButton>
          <PrimaryButton variant="primary">한 판 더 →</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ResultA, ResultB, RecordsA });
