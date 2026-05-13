// Game scene with engine integration, real-time feedback, and effects

function GameGrid({ board, cellSize = 36, selection = null }) {
  const rows = board.length;
  const cols = board[0].length;
  const gap = 4;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap,
      background: 'var(--paper-warm)',
      padding: 18, borderRadius: 18,
      border: '1.5px solid var(--ink)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px rgba(107,66,38,0.10)',
      position: 'relative',
      userSelect: 'none',
      touchAction: 'none'
    }}>
      {board.map((row, r) => row.map((n, c) => {
        const key = `${r}-${c}`;
        const isSelected = selection && r >= selection.r1 && r <= selection.r2 && c >= selection.c1 && c <= selection.c2;
        return <AppleCell key={key} n={n} size={cellSize} shape="realistic" selected={isSelected} />;
      }))}
    </div>
  );
}

function HUD({ score, time, warn = false, mode, combo = 0, onThemeToggle, themeLabel, onQuit }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24,
      padding: '14px 22px', background: 'var(--paper)',
      borderRadius: 16, border: '1.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)'
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>SCORE</div>
        <div style={{ fontFamily: 'var(--font-num)', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>{score}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>TIME</div>
        <div style={{
          fontFamily: 'var(--font-num)', fontSize: 56, color: warn ? 'var(--apple)' : 'var(--ink)',
          lineHeight: 1, letterSpacing: '0.02em',
          animation: warn ? 'pulse 1s infinite' : 'none'
        }}>{time}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{mode}</div>
          <button onClick={onThemeToggle} style={{ 
            marginTop: 4, padding: '4px 8px', fontSize: 10, background: 'var(--paper-warm)', 
            border: '1px solid var(--hairline)', borderRadius: 4, cursor: 'pointer' 
          }}>🎨 {themeLabel === 'original' ? 'Original' : 'Warm'}</button>
        </div>
        <button id="quit-btn-real" onClick={onQuit} style={{
          padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          background: 'var(--paper-warm)', color: 'var(--ink-soft)',
          border: '1.5px solid var(--ink)', borderRadius: 8, cursor: 'pointer',
          boxShadow: '2px 2px 0 var(--ink)'
        }}>나가기</button>
      </div>
    </div>
  );
}

function GameScreen({ engine, config, theme, onThemeToggle, onQuit, onFinish }) {
  const [board, setBoard] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(120);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = React.useState({ x: 0, y: 0 });
  const [selection, setSelection] = React.useState(null);
  const [currentSum, setCurrentSum] = React.useState(0);
  const [floatingTexts, setFloatingTexts] = React.useState([]);
  const containerRef = React.useRef(null);

  const APPLE_SIZE = 36;
  const GAP = 4;
  const PADDING = 18;

  React.useEffect(() => {
     if (engine) {
       setBoard([...engine.getBoard().map(r => [...r])]);
       setScore(engine.getScore());
       if (config.timeMode !== 'infinite') {
         setTimeLeft(parseInt(config.timeMode));
       }
     }
  }, [engine]);

  React.useEffect(() => {
    if (config.timeMode === 'infinite') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(engine.getScore());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [config.timeMode]);

  const updateSelection = (start, end) => {
    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const right = Math.max(start.x, end.x);
    const bottom = Math.max(start.y, end.y);

    let r1 = 1000, c1 = 1000, r2 = -1, c2 = -1;
    let found = false;

    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const centerX = PADDING + c * (APPLE_SIZE + GAP) + APPLE_SIZE / 2;
        const centerY = PADDING + r * (APPLE_SIZE + GAP) + APPLE_SIZE / 2;

        if (centerX >= left && centerX <= right && centerY >= top && centerY <= bottom) {
          r1 = Math.min(r1, r);
          c1 = Math.min(c1, c);
          r2 = Math.max(r2, r);
          c2 = Math.max(c2, c);
          found = true;
        }
      }
    }

    if (found) {
      const sum = engine.getAreaSum(r1, c1, r2, c2);
      setSelection({ r1, c1, r2, c2 });
      setCurrentSum(sum);
    } else {
      setSelection(null);
      setCurrentSum(0);
    }
  };

  const handlePointerDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
    updateSelection({ x, y }, { x, y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragEnd({ x, y });
    updateSelection(dragStart, { x, y });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selection) {
      const beforeApples = engine.getRemainingApples();
      if (engine.evaluateSelection(selection.r1, selection.c1, selection.r2, selection.c2, config.clearType)) {
        const removed = beforeApples - engine.getRemainingApples();
        setBoard([...engine.getBoard().map(r => [...r])]);
        setScore(engine.getScore());
        
        // Combo text effect
        let comboMsg = 'Good!';
        if (removed >= 10) comboMsg = 'Excellent!!';
        else if (removed >= 6) comboMsg = 'Great!';
        
        const newEffect = {
          id: Date.now(),
          text: `${comboMsg} +${removed}`,
          x: dragEnd.x,
          y: dragEnd.y
        };
        setFloatingTexts(prev => [...prev, newEffect]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== newEffect.id));
        }, 600);

        if (engine.getRemainingApples() === 0) {
          onFinish(engine.getScore());
        } else if (!engine.hasAvailableMoves(config.clearType)) {
           setTimeout(() => onFinish(engine.getScore()), 1000);
        }
      }
    }
    setSelection(null);
    setCurrentSum(0);
  };

  const formatTime = (seconds) => {
    if (config.timeMode === 'infinite') return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 70% 0%, rgba(244,162,97,0.12), transparent 60%), var(--paper)`,
      padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      
      <HUD
        score={score}
        time={formatTime(timeLeft)}
        warn={timeLeft <= 10 && config.timeMode !== 'infinite'}
        mode={`${config.cols}×${config.rows} · ${config.clearType === 'original' ? '오리지널' : '10의 배수'}`}
        onThemeToggle={onThemeToggle}
        themeLabel={theme}
        onQuit={onQuit}
      />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', position: 'relative' }}>
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown} 
            onPointerMove={handlePointerMove}
            style={{ position: 'relative', touchAction: 'none' }}
          >
             {board.length > 0 && <GameGrid board={board} cellSize={APPLE_SIZE} selection={selection} />}
             
             {/* Pixel-based Selection Rectangle */}
             {isDragging && (
               <div style={{
                 position: 'absolute',
                 left: Math.min(dragStart.x, dragEnd.x),
                 top: Math.min(dragStart.y, dragEnd.y),
                 width: Math.abs(dragEnd.x - dragStart.x),
                 height: Math.abs(dragEnd.y - dragStart.y),
                 border: '2px solid var(--leaf-light)',
                 background: 'rgba(82,183,136,0.12)',
                 borderRadius: 8,
                 pointerEvents: 'none'
               }} />
             )}

             {/* Sum Indicator */}
             {isDragging && currentSum > 0 && (
               <div style={{
                 position: 'absolute',
                 left: dragEnd.x + 12,
                 top: dragEnd.y - 24,
                 padding: '4px 10px',
                 background: (config.clearType === 'original' ? currentSum === 10 : (currentSum % 10 === 0 && currentSum <= 50)) ? 'var(--leaf)' : 'var(--ink)',
                 color: '#fff',
                 borderRadius: 8,
                 fontFamily: 'var(--font-num)',
                 fontSize: 16,
                 fontWeight: 700,
                 pointerEvents: 'none',
                 whiteSpace: 'nowrap',
                 boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                 zIndex: 100
               }}>
                 ∑ {currentSum} {(config.clearType === 'original' ? currentSum === 10 : (currentSum % 10 === 0 && currentSum <= 50)) ? '✓' : ''}
               </div>
             )}

             {/* Combo Text Effects */}
             {floatingTexts.map(t => (
               <div key={t.id} className="combo-text" style={{
                 position: 'absolute',
                 left: t.x,
                 top: t.y,
                 pointerEvents: 'none'
               }}>
                 {t.text}
               </div>
             ))}
          </div>
        </div>

        <aside style={{
          width: 200, display: 'flex', flexDirection: 'column', gap: 14,
          padding: 16, background: 'var(--paper-warm)', borderRadius: 16,
          border: '1px solid var(--hairline)', height: '100%'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>PROGRESS</div>
            <div style={{
              height: 6, background: 'var(--paper)', borderRadius: 999, marginTop: 6, overflow: 'hidden',
              border: '1px solid var(--hairline)'
            }}>
              <div style={{
                width: `${Math.round((score / (config.rows * config.cols)) * 100)}%`,
                height: '100%', background: 'var(--apple)', borderRadius: 999
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-soft)' }}>
              <span>{score} / {config.rows * config.cols}</span>
              <span>{Math.round((score / (config.rows * config.cols)) * 100)}%</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--hairline)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>가이드</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              <AppleCell n={3} size={28} shape="realistic" leaf={false}/>
              <AppleCell n={7} size={28} shape="realistic" leaf={false}/>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
              3 + 7 = <strong style={{ color: 'var(--apple)' }}>10</strong>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppleMascot size={56} mood={timeLeft <= 10 && config.timeMode !== 'infinite' ? "panic" : "happy"}/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.3 }}>
              <strong style={{ color: 'var(--ink)' }}>토토:</strong><br/>
              {timeLeft <= 10 && config.timeMode !== 'infinite' ? "빨리, 빨리!!" : "좋은 페이스야!"}
            </div>
          </div>
        </aside>
      </div>

      <button onClick={() => onFinish(engine.getScore())} style={{
         position: 'absolute', bottom: 20, right: 20, padding: '10px 20px',
         background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 12,
         cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700
      }}>그만하기</button>
    </div>
  );
}

Object.assign(window, { GameScreen });
 GameScreen });
