// Result & Records components

function ResultScreen({ score, config, reason, onRestart, onNewSettings, onMain, onLeaderboard }) {
  const getMessage = () => {
    switch (reason) {
      case 'nomoves': return "더 이상 가능한 수가 없습니다!";
      case 'timeover': return "시간이 다 되었습니다!";
      case 'clear': return "축하합니다! 모든 사과를 수확했어요!";
      case 'quit': return "수확을 중단했습니다.";
      default: return "수확 완료!";
    }
  };

  return (
    <>
    <style>{`
      .result-layout { padding: clamp(24px, 5vw, 44px); }
      .result-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: center; position: relative; z-index: 1; flex: 1; }
      .result-score { font-size: clamp(100px, 15vw, 200px); line-height: 0.8; }
      .mascot-result svg { width: clamp(200px, 30vw, 320px); height: auto; }
      @media (max-width: 850px) {
        .result-grid { grid-template-columns: 1fr; text-align: center; }
        .mascot-result { display: none; }
      }
    `}</style>
    <div className="result-layout" style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 50% 30%, rgba(244,162,97,0.30), transparent 60%), var(--paper)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'auto'
    }}>
      {/* confetti apples decoration */}
      <div style={{ position: 'absolute', left: '6%', top: '8%', transform: 'rotate(-12deg)', opacity: 0.6 }}><AppleCell n={7} size={36} shape="realistic" /></div>
      <div style={{ position: 'absolute', right: '6%', top: '12%', transform: 'rotate(18deg)', opacity: 0.6 }}><AppleCell n={3} size={44} shape="realistic" /></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.22em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          ── {getMessage()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '6px 16px', background: 'var(--paper-warm)',
            borderRadius: 999, border: '1px solid var(--hairline)',
            fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.05em'
          }}>{config.cols} × {config.rows} · {config.clearType === 'original' ? '오리지널' : '10의 배수'}</span>
        </div>
      </div>

      <div className="result-grid">
        <div className="mascot-result" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AppleMascot size={320} mood={reason === 'clear' ? "happy" : "neutral"} />
          <div style={{ marginTop: 15, fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', fontWeight: 700, fontStyle: 'italic' }}>
            {reason === 'clear' ? "완벽한 수확이야!" : "이만큼이나 땄어!"}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-en)', fontSize: 18, color: 'var(--apple-deep)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Final Harvest
          </div>
          <div className="result-score" style={{
            fontFamily: 'var(--font-num)', color: 'var(--apple)',
            letterSpacing: '-0.04em', marginTop: 10, fontWeight: 900
          }}>
            {score}
          </div>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              <PrimaryButton onClick={onRestart} variant="primary">같은 모드로 한 번 더 →</PrimaryButton>
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 400 }}>
              <button onClick={onNewSettings} style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid var(--hairline)',
                background: 'var(--paper-warm)', color: 'var(--ink)', fontWeight: 700, cursor: 'pointer', fontSize: 15
              }}>다른 설정</button>
              <button onClick={onMain} style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid var(--hairline)',
                background: 'var(--paper)', color: 'var(--ink-soft)', fontWeight: 700, cursor: 'pointer', fontSize: 15
              }}>메인으로</button>
              <button onClick={onLeaderboard} style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid var(--hairline)',
                background: 'var(--ink)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15
              }}>리더보드</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function RecordsScreen({ records, onMain }) {
  const [activeTab, setActiveTab] = React.useState('all');
  
  const filteredRecords = activeTab === 'all' 
    ? Object.entries(records) 
    : Object.entries(records).filter(([k]) => k.startsWith(activeTab === '2min' ? '120' : 'infinite'));

  return (
    <>
    <style>{`
      .records-layout { padding: clamp(20px, 4vw, 36px) clamp(20px, 5vw, 44px); }
      .records-header { flex-direction: row; }
      @media (max-width: 600px) {
        .records-header { flex-direction: column; gap: 16px; }
        .records-controls { width: 100%; flex-wrap: wrap; justify-content: flex-start; }
      }
    `}</style>
    <div className="records-layout" style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      <div className="records-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 나의 기록 · ARCHIVE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 48px)', color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
            한 해의 수확.
          </div>
        </div>
        <div className="records-controls" style={{ display: 'flex', gap: 8 }}>
           <button onClick={() => setActiveTab('all')} style={{ padding: '8px 14px', background: activeTab === 'all' ? 'var(--ink)' : 'transparent', color: activeTab === 'all' ? 'var(--paper)' : 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer' }}>전체</button>
           <button onClick={() => setActiveTab('2min')} style={{ padding: '8px 14px', background: activeTab === '2min' ? 'var(--ink)' : 'transparent', color: activeTab === '2min' ? 'var(--paper)' : 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer' }}>2분</button>
           <button onClick={() => setActiveTab('infinite')} style={{ padding: '8px 14px', background: activeTab === 'infinite' ? 'var(--ink)' : 'transparent', color: activeTab === 'infinite' ? 'var(--paper)' : 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer' }}>무한</button>
           <button onClick={onMain} style={{ marginLeft: 'auto', padding: '10px 18px', background: 'transparent', border: '1.5px solid var(--hairline)', borderRadius: 12, color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>메인으로</button>
        </div>
      </div>

      <div style={{
        background: 'var(--paper)', borderRadius: 16,
        border: '1px solid var(--hairline)', overflow: 'auto', flex: 1
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
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
            {filteredRecords.length === 0 ? (
               <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>기록이 없습니다.</td></tr>
            ) : filteredRecords.map(([key, r], i) => {
              const parts = key.split('_');
              const modeLabel = `${parts[1]} · ${parts[3] === 'original' ? '오리지널' : '10의 배수'}`;
              return (
                <tr key={key} style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AppleCell n={(i % 9) + 1} size={28} shape="realistic" leaf={false} />
                    <span style={{ fontWeight: 600 }}>{modeLabel}</span>
                  </td>
                  <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22 }}>{r.playCount}</td>
                  <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--apple)' }}>{r.highScore}</td>
                  <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 22, color: 'var(--ink-soft)' }}>{(r.totalScore / r.playCount).toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

function LeaderboardScreen({ leaderboard, onMain, onRefresh, filters, onFilterChange }) {
  return (
    <>
    <style>{`
      .lb-layout { padding: clamp(20px, 4vw, 36px) clamp(20px, 5vw, 44px); }
      .lb-header { flex-direction: row; }
      @media (max-width: 800px) {
        .lb-header { flex-direction: column; gap: 16px; }
        .lb-controls { width: 100%; flex-wrap: wrap; justify-content: flex-start; }
      }
    `}</style>
    <div className="lb-layout" style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      <div className="lb-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 글로벌 랭킹 · LEADERBOARD</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 48px)', color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
            명예의 전당.
          </div>
        </div>
        <div className="lb-controls" style={{ display: 'flex', gap: 8 }}>
           <select value={filters.time} onChange={(e) => onFilterChange('time', e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid var(--hairline)', flex: 1, minWidth: 100 }}>
             <option value="120">2분 모드</option>
             <option value="infinite">무한 모드</option>
           </select>
           <select value={filters.size} onChange={(e) => onFilterChange('size', e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid var(--hairline)', flex: 1, minWidth: 100 }}>
             <option value="17x10">17x10</option>
             <option value="50x50">50x50</option>
           </select>
           <select value={filters.clearType} onChange={(e) => onFilterChange('clearType', e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid var(--hairline)', flex: 1, minWidth: 100 }}>
             <option value="original">오리지널</option>
             <option value="multiples">10의 배수</option>
           </select>
           <select value={filters.sort} onChange={(e) => onFilterChange('sort', e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid var(--hairline)', flex: 1, minWidth: 100 }}>
             <option value="highScore">최고 점수 순</option>
             <option value="playCount">판수 순</option>
           </select>
           <button onClick={onRefresh} style={{ padding: '8px 14px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>조회</button>
           <button onClick={onMain} style={{ marginLeft: 'auto', padding: '10px 18px', background: 'transparent', border: '1.5px solid var(--hairline)', borderRadius: 12, color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>메인으로</button>
        </div>
      </div>

      <div style={{
        background: 'var(--paper)', borderRadius: 16,
        border: '1px solid var(--hairline)', overflow: 'auto', flex: 1
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr style={{
              background: 'var(--paper-warm)', borderBottom: '1.5px solid var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)', textAlign: 'left'
            }}>
              <th style={{ padding: '14px 22px', width: 80 }}>RANK</th>
              <th style={{ padding: '14px 22px' }}>NAME</th>
              <th style={{ padding: '14px 22px' }}>SCORE</th>
              <th style={{ padding: '14px 22px' }}>PLAYS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
               <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>데이터를 불러오거나 기록이 없습니다.</td></tr>
            ) : leaderboard.map((data, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--hairline)', background: i < 3 ? 'rgba(233,196,106,0.05)' : 'transparent' }}>
                <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 24, color: i === 0 ? 'var(--gold)' : 'var(--ink)' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </td>
                <td style={{ padding: '16px 22px', fontWeight: 600 }}>{data.name}</td>
                <td style={{ padding: '16px 22px', fontFamily: 'var(--font-num)', fontSize: 28, color: 'var(--apple)' }}>{data.highScore}</td>
                <td style={{ padding: '16px 22px', color: 'var(--ink-mute)' }}>{data.playCount} 회</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

Object.assign(window, { ResultScreen, RecordsScreen, LeaderboardScreen });
