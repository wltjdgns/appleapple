// Result & Records components

function ResultScreen({ score, config, onRestart, onNewSettings, onMain }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 50% 30%, rgba(244,162,97,0.30), transparent 60%), var(--paper)`,
      padding: 36, display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      {/* confetti apples decoration */}
      <div style={{ position: 'absolute', left: '6%', top: '8%', transform: 'rotate(-12deg)', opacity: 0.6 }}><AppleCell n={7} size={36} shape="realistic" /></div>
      <div style={{ position: 'absolute', right: '6%', top: '12%', transform: 'rotate(18deg)', opacity: 0.6 }}><AppleCell n={3} size={44} shape="realistic" /></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          ── GAME OVER · FINISHED
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '4px 12px', background: 'var(--paper-warm)',
            borderRadius: 999, border: '1px solid var(--hairline)',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.05em'
          }}>{config.cols} × {config.rows} · {config.clearType === 'original' ? '오리지널' : '10의 배수'}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AppleMascot size={280} mood="happy" />
          <div style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', fontWeight: 700, fontStyle: 'italic' }}>
            "이만큼 따왔어!"
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-en)', fontSize: 16, color: 'var(--apple-deep)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Final Harvest
          </div>
          <div style={{
            fontFamily: 'var(--font-num)', fontSize: 180, color: 'var(--apple)',
            lineHeight: 0.9, letterSpacing: '-0.04em', marginTop: 8
          }}>
            {score}
          </div>

          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton onClick={onRestart} variant="primary">같은 모드로 한 번 더 →</PrimaryButton>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><PrimaryButton onClick={onNewSettings} variant="secondary">다른 설정</PrimaryButton></div>
              <div style={{ flex: 1 }}><PrimaryButton onClick={onMain} variant="ghost">메인으로</PrimaryButton></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordsScreen({ records, onMain, onRestart }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 나의 기록 · ARCHIVE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
            한 해의 수확.
          </div>
        </div>
        <button onClick={onMain} style={{
          padding: '10px 18px', background: 'transparent', border: '1.5px solid var(--hairline)',
          borderRadius: 12, color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
        }}>메인으로</button>
      </div>

      <div style={{
        background: 'var(--paper)', borderRadius: 16,
        border: '1px solid var(--hairline)', overflow: 'auto', flex: 1
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              background: 'var(--paper-warm)', borderBottom: '1.5px solid var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)', textAlign: 'left'
            }}>
              <th style={{ padding: '14px 22px' }}>MODE</th>
              <th style={{ padding: '14px 22px' }}>PLAYS</th>
              <th style={{ padding: '14px 22px' }}>BEST</th>
              <th style={{ padding: '14px 22px' }}>AVG</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AppleCell n={(i % 9) + 1} size={28} shape="realistic" leaf={false} />
                  <span style={{ fontWeight: 600 }}>{r.mode}</span>
                </td>
                <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22 }}>{r.plays}</td>
                <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--apple)' }}>{r.best}</td>
                <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--ink-soft)' }}>{r.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { ResultScreen, RecordsScreen });
