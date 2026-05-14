// Settings scene

function SettingsScreen({ config, onChange, theme, onThemeChange, customColor, onCustomColorChange, appleShape, onAppleShapeChange, musicEnabled, onMusicToggle, onStart, onBack }) {
  return (
    <>
    <style>{`
      .settings-layout { padding: clamp(24px, 5vw, 52px) clamp(24px, 5vw, 64px); }
      .settings-title { font-size: clamp(40px, 7vw, 64px); }
      .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; align-items: start; }
      .setting-item { display: flex; flex-direction: column; gap: 12px; }
      .setting-label { fontFamily: 'var(--font-mono)'; fontSize: 12; letterSpacing: '0.15em'; textTransform: 'uppercase'; color: 'var(--ink-mute)'; fontWeight: 700; }
      @media (max-width: 850px) {
        .settings-layout { padding: 24px; }
        .settings-grid { grid-template-columns: 1fr; }
        .settings-right { display: none; }
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

      <div className="settings-grid" style={{ zIndex: 1, position: 'relative' }}>
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div className="setting-item" style={{ flex: 1 }}>
              <label className="setting-label">⏳ 시간 모드</label>
              <select value={config.timeMode} onChange={(e) => onChange('timeMode', e.target.value)} style={{
                padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
              }}>
                <option value="120">제한 있음</option>
                <option value="infinite">제한 없음</option>
              </select>
            </div>

            <div className="setting-item" style={{ flex: 1 }}>
              <label className="setting-label">📏 배열 크기</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={config.cols} onChange={(e) => onChange('cols', parseInt(e.target.value))} min="5" max="50" style={{
                  flex: 1, padding: '16px 8px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                  background: 'var(--paper-warm)', textAlign: 'center', fontSize: 18, fontFamily: 'var(--font-num)', minWidth: 0
                }} />
                <span style={{ color: 'var(--ink-mute)', fontWeight: 700, fontSize: 20 }}>×</span>
                <input type="number" value={config.rows} onChange={(e) => onChange('rows', parseInt(e.target.value))} min="5" max="50" style={{
                  flex: 1, padding: '16px 8px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                  background: 'var(--paper-warm)', textAlign: 'center', fontSize: 18, fontFamily: 'var(--font-num)', minWidth: 0
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div className="setting-item" style={{ flex: 1 }}>
              <label className="setting-label">🍎 클리어 방식</label>
              <select value={config.seedType} onChange={(e) => onChange('seedType', e.target.value)} style={{
                padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
              }}>
                <option value="random">랜덤 생성</option>
                <option value="perfect">퍼펙트 보장</option>
              </select>
            </div>

            <div className="setting-item" style={{ flex: 1 }}>
              <label className="setting-label">✨ 클리어 타입</label>
              <select value={config.clearType} onChange={(e) => onChange('clearType', e.target.value)} style={{
                padding: '16px 20px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
              }}>
                <option value="original">오리지널</option>
                <option value="multiples">10의 배수</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div className="setting-item" style={{ flex: 1 }}>
              <label className="setting-label">🍎 모양</label>
              <select value={appleShape} onChange={(e) => onAppleShapeChange(e.target.value)} style={{
                padding: '16px 12px', borderRadius: 16, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 18
              }}>
                <option value="realistic">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>

            <div className="setting-item" style={{ flex: 1.5 }}>
              <label className="setting-label">🎨 사과 색상</label>
              <div style={{ display: 'flex', gap: 8, height: '100%' }}>
                <button 
                  onClick={() => onThemeChange('original')}
                  style={{
                    flex: '0 0 auto', padding: '0 12px', borderRadius: 16, 
                    border: `2px solid ${theme === 'original' ? '#ff3333' : 'var(--hairline)'}`,
                    background: 'var(--paper-warm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ff3333' }}></div>
                </button>
                <button 
                  onClick={() => onThemeChange('warm')}
                  style={{
                    flex: '0 0 auto', padding: '0 12px', borderRadius: 16, 
                    border: `2px solid ${theme === 'warm' ? '#e56f5b' : 'var(--hairline)'}`,
                    background: 'var(--paper-warm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e56f5b' }}></div>
                </button>
                <div 
                  style={{
                    flex: 1, padding: '0 10px', borderRadius: 16, 
                    border: `2px solid ${theme === 'custom' ? customColor : 'var(--hairline)'}`,
                    background: 'var(--paper-warm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                  onClick={() => onThemeChange('custom')}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'conic-gradient(#ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    position: 'relative', overflow: 'hidden', flexShrink: 0
                  }}>
                    <input 
                      type="color" 
                      value={customColor} 
                      onChange={(e) => {
                        onCustomColorChange(e.target.value);
                        onThemeChange('custom');
                      }}
                      style={{ position: 'absolute', top: -10, left: -10, width: 44, height: 44, opacity: 0, cursor: 'pointer' }}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: theme === 'custom' ? 700 : 400, color: 'var(--ink)', whiteSpace: 'nowrap' }}>사용자 지정</span>
                </div>
              </div>
            </div>

            <div className="setting-item" style={{ flex: 0.8, display: 'flex', flexDirection: 'column' }}>
              <label className="setting-label">미리보기</label>
              <div style={{
                flex: 1, borderRadius: 16, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                '--apple': theme === 'custom' ? customColor : (theme === 'warm' ? '#e56f5b' : '#ff3333'),
                '--apple-deep': theme === 'custom' ? '#8B0000' : undefined
              }}>
                <AppleCell n={1} size={42} shape={appleShape} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'stretch' }}>
            <div style={{ flex: 1.5 }}>
              <PrimaryButton onClick={onStart} variant="primary">게임 시작! →</PrimaryButton>
            </div>
            
            <div style={{ flex: 1 }}>
              <button onClick={onBack} style={{
                width: '100%', height: '100%', minHeight: 60,
                padding: '0 16px', background: 'var(--paper)', border: '1.5px solid var(--hairline)',
                borderRadius: 14, color: 'var(--ink-soft)', fontSize: 16, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>뒤로 가기</button>
            </div>

            <div style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              padding: '0 16px', background: 'var(--paper-warm)', borderRadius: 14, border: '1.5px solid var(--hairline)',
              cursor: 'pointer'
            }} onClick={() => onMusicToggle()}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6, letterSpacing: '0.05em' }}>🎵 BGM</span>
              <div style={{
                width: 44, height: 24, background: musicEnabled ? 'var(--apple)' : 'var(--hairline)',
                borderRadius: 999, position: 'relative', transition: 'background 0.2s'
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: musicEnabled ? 22 : 2, width: 20, height: 20,
                  background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s'
                }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mascot & Apples */}
        <div className="settings-right" style={{
          background: 'var(--paper-warm)', borderRadius: 32, border: '1.5px solid var(--hairline)',
          padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', minHeight: 500
        }}>
          {/* decorative apples */}
          <div style={{ position: 'absolute', top: 40, left: 40 }}><AppleCell n={3} size={56} shape="realistic" /></div>
          <div style={{ position: 'absolute', top: 120, right: 60 }}><AppleCell n={7} size={48} shape="realistic" /></div>
          <div style={{ position: 'absolute', bottom: 100, left: 70 }}><AppleCell n={5} size={44} shape="realistic" /></div>
          <div style={{ position: 'absolute', bottom: 50, right: 80 }}><AppleCell n={2} size={52} shape="realistic" /></div>

          <AppleMascot size={220} mood="happy" />
          
          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--paper)', borderRadius: 20,
            border: '1.5px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)', textAlign: 'center',
            position: 'relative', zIndex: 2
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
              "오늘 사과가 아주 달아!"
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
              준비가 끝났다면<br/>
              빨리 밭으로 나가보자! 🍎
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

Object.assign(window, { SettingsScreen });
