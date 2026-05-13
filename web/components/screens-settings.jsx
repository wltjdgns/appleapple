// Settings scene

function SettingsScreen({ config, onChange, theme, onThemeChange, onStart, onBack }) {
  return (
    <>
    <style>{`
      .settings-layout { padding: clamp(20px, 4vw, 44px) clamp(20px, 5vw, 56px); }
      .settings-title { font-size: clamp(36px, 6vw, 56px); }
      .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 36px; flex: 1; }
      @media (max-width: 800px) {
        .settings-grid { grid-template-columns: 1fr; }
      }
    `}</style>
    <div className="settings-layout" style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'auto'
    }}>
      {/* background decoration */}
      <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.1, pointerEvents: 'none' }}><AppleCell n={9} size={240} shape="realistic"/></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 준비 작업 · SETTINGS</div>
          <h1 className="settings-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
            수확 준비.
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8, fontSize: 15 }}>어떤 밭으로 나갈까요? 난이도와 규칙을 정해주세요.</p>
        </div>
        <button onClick={onBack} style={{
          padding: '10px 18px', background: 'var(--paper)', border: '1.5px solid var(--hairline)',
          borderRadius: 12, color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
        }}>뒤로 가기</button>
      </div>

      <div className="settings-grid">
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>⏳ 시간 모드</label>
            <select value={config.timeMode} onChange={(e) => onChange('timeMode', e.target.value)} style={{
              padding: '14px 18px', borderRadius: 14, border: '1.5px solid var(--hairline)',
              background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 16
            }}>
              <option value="120">2분 (제한 시간)</option>
              <option value="infinite">무한 시간</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>📏 배열 크기</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="number" value={config.cols} onChange={(e) => onChange('cols', e.target.value)} min="5" max="50" style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', textAlign: 'center', fontSize: 16
              }} />
              <span style={{ color: 'var(--ink-mute)', fontWeight: 700 }}>×</span>
              <input type="number" value={config.rows} onChange={(e) => onChange('rows', e.target.value)} min="5" max="50" style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', textAlign: 'center', fontSize: 16
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>🍎 클리어 가능 여부</label>
            <select value={config.seedType} onChange={(e) => onChange('seedType', e.target.value)} style={{
              padding: '14px 18px', borderRadius: 14, border: '1.5px solid var(--hairline)',
              background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 16
            }}>
              <option value="random">랜덤 생성 (일반)</option>
              <option value="perfect">퍼펙트 시드 (100% 가능)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>✨ 클리어 타입</label>
            <select value={config.clearType} onChange={(e) => onChange('clearType', e.target.value)} style={{
              padding: '14px 18px', borderRadius: 14, border: '1.5px solid var(--hairline)',
              background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 16
            }}>
              <option value="original">오리지널 (합계 10)</option>
              <option value="multiples">10의 배수 (10, 20...)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>🎨 테마 색상 (사과 색상)</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => onThemeChange('original')}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14, 
                  border: `2px solid ${theme === 'original' ? '#ff3333' : 'var(--hairline)'}`,
                  background: 'var(--paper-warm)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff3333' }}></div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: theme === 'original' ? 700 : 400, color: 'var(--ink)' }}>오리지널</span>
              </button>
              <button 
                onClick={() => onThemeChange('warm')}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14, 
                  border: `2px solid ${theme === 'warm' ? '#e56f5b' : 'var(--hairline)'}`,
                  background: 'var(--paper-warm)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#e56f5b' }}></div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: theme === 'warm' ? 700 : 400, color: 'var(--ink)' }}>따뜻한 색감</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview / mascot */}
        <div style={{
          background: 'var(--paper-warm)', borderRadius: 24, border: '1.5px solid var(--hairline)',
          padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
           <AppleMascot size={180} mood="happy" />
           <div style={{
             marginTop: 24, padding: '16px 20px', background: 'var(--paper)', borderRadius: 16,
             border: '1px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', textAlign: 'center'
           }}>
             <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
               좋은 선택이야!
             </div>
             <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
               {config.cols}x{config.rows} 크기의 밭에서<br/>
               {config.clearType === 'original' ? '합계 10' : '10의 배수'}를 찾아보자.
             </div>
           </div>
           <div style={{ marginTop: 'auto', width: '100%' }}>
             <PrimaryButton onClick={onStart} variant="primary">게임 시작! →</PrimaryButton>
           </div>
        </div>
      </div>
    </div>
    </>
  );
}

Object.assign(window, { SettingsScreen });
