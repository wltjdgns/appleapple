// Settings scene

function SettingsScreen({ config, onChange, theme, onThemeChange, onStart, onBack }) {
  return (
    <>
    <style>{`
      .settings-layout { padding: clamp(24px, 5vw, 52px) clamp(24px, 5vw, 64px); }
      .settings-title { font-size: clamp(40px, 7vw, 64px); }
      .settings-grid { display: flex; flex-direction: column; gap: 36px; margin-top: 40px; }
      .setting-item { display: flex; flex-direction: column; gap: 12px; }
      .setting-label { fontFamily: 'var(--font-mono)'; fontSize: 12; letterSpacing: '0.15em'; textTransform: 'uppercase'; color: 'var(--ink-mute)'; fontWeight: 700; }
      @media (max-width: 800px) {
        .settings-layout { padding: 24px; }
      }
    `}</style>
    <div className="settings-layout" style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'auto'
    }}>
      {/* background decoration */}
      <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.1, pointerEvents: 'none' }}><AppleCell n={9} size={240} shape="realistic"/></div>
      
      <div style={{ zIndex: 1, position: 'relative' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 준비 작업 · SETTINGS</div>
        <h1 className="settings-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 700, marginTop: 8, lineHeight: 1 }}>
          수확 준비.
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 12, fontSize: 18 }}>어떤 밭으로 나갈까요? 난이도와 규칙을 정해주세요.</p>
      </div>

      <div className="settings-grid" style={{ zIndex: 1, position: 'relative', maxWidth: 600 }}>
        <div className="setting-item">
          <label className="setting-label">⏳ 시간 모드</label>
          <select value={config.timeMode} onChange={(e) => onChange('timeMode', e.target.value)} style={{
            padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
            background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
          }}>
            <option value="120">시간내로</option>
            <option value="infinite">시간제한없이</option>
          </select>
        </div>

        <div className="setting-item">
          <label className="setting-label">📏 배열 크기 (기본: 17 * 10)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input type="number" value={config.cols} onChange={(e) => onChange('cols', parseInt(e.target.value))} min="5" max="50" style={{
              flex: 1, padding: '16px', borderRadius: 16, border: '1.5px solid var(--hairline)',
              background: 'var(--paper-warm)', textAlign: 'center', fontSize: 18, fontFamily: 'var(--font-num)'
            }} />
            <span style={{ color: 'var(--ink-mute)', fontWeight: 700, fontSize: 20 }}>×</span>
            <input type="number" value={config.rows} onChange={(e) => onChange('rows', parseInt(e.target.value))} min="5" max="50" style={{
              flex: 1, padding: '16px', borderRadius: 16, border: '1.5px solid var(--hairline)',
              background: 'var(--paper-warm)', textAlign: 'center', fontSize: 18, fontFamily: 'var(--font-num)'
            }} />
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">🍎 클리어 가능 여부</label>
          <select value={config.seedType} onChange={(e) => onChange('seedType', e.target.value)} style={{
            padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
            background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
          }}>
            <option value="random">랜덤</option>
            <option value="perfect">가능</option>
          </select>
        </div>

        <div className="setting-item">
          <label className="setting-label">✨ 클리어 타입</label>
          <select value={config.clearType} onChange={(e) => onChange('clearType', e.target.value)} style={{
            padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
            background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
          }}>
            <option value="original">오리지널</option>
            <option value="multiples">10의 배수</option>
          </select>
        </div>

        <div className="setting-item">
          <label className="setting-label">🎨 사과 색상</label>
          <div style={{ display: 'flex', gap: 16 }}>
            <button 
              onClick={() => onThemeChange('original')}
              style={{
                flex: 1, padding: '16px', borderRadius: 16, 
                border: `2px solid ${theme === 'original' ? '#ff3333' : 'var(--hairline)'}`,
                background: 'var(--paper-warm)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ff3333' }}></div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: theme === 'original' ? 700 : 400, color: 'var(--ink)' }}>오리지널</span>
            </button>
            <button 
              onClick={() => onThemeChange('warm')}
              style={{
                flex: 1, padding: '16px', borderRadius: 16, 
                border: `2px solid ${theme === 'warm' ? '#e56f5b' : 'var(--hairline)'}`,
                background: 'var(--paper-warm)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e56f5b' }}></div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: theme === 'warm' ? 700 : 400, color: 'var(--ink)' }}>따뜻한 색감</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 20, marginBottom: 40 }}>
          <div style={{ flex: 1.5 }}>
            <PrimaryButton onClick={onStart} variant="primary">게임 시작! →</PrimaryButton>
          </div>
          <div style={{ flex: 1 }}>
            <button onClick={onBack} style={{
              width: '100%', height: '100%', minHeight: 56,
              padding: '16px 24px', background: 'var(--paper)', border: '1.5px solid var(--hairline)',
              borderRadius: 14, color: 'var(--ink-soft)', fontSize: 17, fontWeight: 700, cursor: 'pointer'
            }}>뒤로 가기</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

Object.assign(window, { SettingsScreen });
