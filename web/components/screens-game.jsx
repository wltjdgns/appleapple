// Game scene components

function HUD({ score, time, warn, mode, onStyleToggle, onQuit, musicEnabled, onMusicToggle }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 20px', background: 'var(--ink)', borderRadius: 18, color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.6, letterSpacing: '0.1em' }}>SCORE</span>
          <span style={{ fontSize: 28, fontFamily: 'var(--font-num)', fontWeight: 800, lineHeight: 1 }}>{score}</span>
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.6, letterSpacing: '0.1em' }}>TIME</span>
          <span style={{ 
            fontSize: 28, fontFamily: 'var(--font-num)', fontWeight: 800, lineHeight: 1,
            color: warn ? '#ff4d4d' : '#fff'
          }}>{time}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
         <button onClick={onMusicToggle} style={{
           padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
           background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer',
           fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8
         }}>
           🎵 {musicEnabled ? 'ON' : 'OFF'}
         </button>
         <button onClick={onStyleToggle} style={{
           padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
           background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer',
           fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8
         }}>
           🎨 스타일
         </button>
      </div>
    </div>
  );
}

function GameGrid({ board, cellSize, selection, appleShape }) {
  const GAP = 2;
  const rows = board.length;
  const cols = board[0].length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap: GAP,
      padding: 4,
      background: 'var(--paper-dark)',
      borderRadius: 12,
      border: '2px solid var(--hairline)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    }}>
      {board.map((row, r) => row.map((apple, c) => {
        const isSelected = selection && 
          r >= selection.r1 && r <= selection.r2 && 
          c >= selection.c1 && c <= selection.c2;
        
        return (
          <div key={`${r}-${c}`} style={{ position: 'relative' }}>
            {apple > 0 ? (
              <AppleCell 
                n={apple} 
                size={cellSize} 
                shape={appleShape || "realistic"} 
                selected={isSelected} 
              />
            ) : (
              <div style={{ width: cellSize, height: cellSize }} />
            )}
          </div>
        );
      }))}
    </div>
  );
}

function GameScreen({ engine, config, theme, onThemeToggle, customColor, onCustomColorChange, appleShape, onAppleShapeChange, onQuit, onFinish, musicEnabled, onMusicToggle }) {
  const [board, setBoard] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = React.useState({ x: 0, y: 0 });
  const [selection, setSelection] = React.useState(null);
  const [currentSum, setCurrentSum] = React.useState(0);
  const [floatingTexts, setFloatingTexts] = React.useState([]);
  const [appleSize, setAppleSize] = React.useState(40);
  const [styleModalOpen, setStyleModalOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  const GAP = 2;
  const PADDING = 4;

  React.useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const maxW = rect.width - PADDING * 2;
      const maxH = rect.height - PADDING * 2;
      
      let newSize = Math.min(
        (maxW - (config.cols - 1) * GAP) / config.cols,
        (maxH - (config.rows - 1) * GAP) / config.rows
      );
      
      newSize = Math.max(16, Math.min(newSize, 70));
      setAppleSize(Math.floor(newSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    const timer = setTimeout(updateSize, 50);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [config.cols, config.rows]);

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
          onFinish(engine.getScore(), 'timeover');
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
        const centerX = PADDING + c * (appleSize + GAP) + appleSize / 2;
        const centerY = PADDING + r * (appleSize + GAP) + appleSize / 2;

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
        
        // 콤보 메시지 로직 (사용자 요청: 2개 good, 3개 great, 4개 excellent)
        let comboMsg = '';
        if (removed >= 4) comboMsg = 'Excellent!!';
        else if (removed === 3) comboMsg = 'Great!';
        else if (removed === 2) comboMsg = 'Good!';
        
        if (comboMsg) {
          const newEffect = {
            id: Date.now(),
            text: `${comboMsg} +${removed}`,
            x: dragEnd.x,
            y: dragEnd.y
          };
          setFloatingTexts(prev => [...prev, newEffect]);
          setTimeout(() => {
            setFloatingTexts(prev => prev.filter(t => t.id !== newEffect.id));
          }, 800);
        }

        if (engine.getRemainingApples() === 0) {
          onFinish(engine.getScore(), 'clear');
        } else if (!engine.hasAvailableMoves(config.clearType)) {
           const endEffect = {
             id: Date.now() + 1,
             text: `No More Moves!`,
             x: containerRef.current.getBoundingClientRect().width / 2 - 50,
             y: containerRef.current.getBoundingClientRect().height / 2
           };
           setFloatingTexts(prev => [...prev, endEffect]);
           setTimeout(() => onFinish(engine.getScore(), 'nomoves'), 1500);
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
      padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 12,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'
    }} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      
      <HUD
        score={score}
        time={formatTime(timeLeft)}
        warn={timeLeft <= 10 && config.timeMode !== 'infinite'}
        mode={`${config.cols}×${config.rows}`}
        onStyleToggle={() => setStyleModalOpen(!styleModalOpen)}
        onQuit={onQuit}
        musicEnabled={musicEnabled}
        onMusicToggle={onMusicToggle}
      />

      {styleModalOpen && (
        <div style={{
          position: 'absolute', top: 90, right: 32, background: 'var(--paper-warm)', padding: 20, 
          borderRadius: 16, border: '1.5px solid var(--ink)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
          zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 260
        }}>
          
          {/* Shape Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 14 }}>🍎 사과 모양</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => onAppleShapeChange('realistic')}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12, 
                  border: `2px solid ${appleShape === 'realistic' ? 'var(--apple)' : 'var(--hairline)'}`,
                  background: 'var(--paper)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: appleShape === 'realistic' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <AppleCell n={1} size={36} shape="realistic" leaf={true} />
                <span style={{ fontSize: 13, fontWeight: appleShape === 'realistic' ? 700 : 500, color: 'var(--ink)' }}>2D</span>
              </button>
              <button 
                onClick={() => onAppleShapeChange('3d')}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12, 
                  border: `2px solid ${appleShape === '3d' ? 'var(--apple)' : 'var(--hairline)'}`,
                  background: 'var(--paper)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: appleShape === '3d' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <AppleCell n={1} size={36} shape="3d" leaf={true} />
                <span style={{ fontSize: 13, fontWeight: appleShape === '3d' ? 700 : 500, color: 'var(--ink)' }}>3D</span>
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 14 }}>🎨 사과 색상</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => onThemeToggle('original')}
                style={{
                  flex: '0 0 auto', padding: '0 12px', height: 44, borderRadius: 12, 
                  border: `2px solid ${theme === 'original' ? '#ff3333' : 'var(--hairline)'}`,
                  background: 'var(--paper)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ff3333' }}></div>
              </button>
              <button 
                onClick={() => onThemeToggle('warm')}
                style={{
                  flex: '0 0 auto', padding: '0 12px', height: 44, borderRadius: 12, 
                  border: `2px solid ${theme === 'warm' ? '#e56f5b' : 'var(--hairline)'}`,
                  background: 'var(--paper)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e56f5b' }}></div>
              </button>
              <div 
                style={{
                  flex: 1, padding: '0 10px', height: 44, borderRadius: 12, 
                  border: `2px solid ${theme === 'custom' ? customColor : 'var(--hairline)'}`,
                  background: 'var(--paper)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  position: 'relative', overflow: 'hidden'
                }}
                onClick={() => onThemeToggle('custom')}
              >
                <div style={{
                   position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
                   background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)'
                }}/>
                <input 
                  type="color" 
                  value={customColor} 
                  onChange={(e) => {
                    onCustomColorChange(e.target.value);
                    onThemeToggle('custom');
                  }}
                  style={{ width: 28, height: 28, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', zIndex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: theme === 'custom' ? 700 : 500, color: 'var(--ink)', whiteSpace: 'nowrap', zIndex: 1 }}>사용자 지정</span>
              </div>
            </div>
          </div>

          <button onClick={() => setStyleModalOpen(false)} style={{
            marginTop: 4, padding: '12px', background: 'var(--ink)', color: '#fff', 
            borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15
          }}>닫기</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', position: 'relative' }}>
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown} 
          onPointerMove={handlePointerMove}
          style={{ position: 'relative', touchAction: 'none' }}
        >
           {board.length > 0 && <GameGrid board={board} cellSize={appleSize} selection={selection} appleShape={appleShape} />}
           
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

           {/* Sum Indicator (복구) */}
           {isDragging && currentSum > 0 && (
             <div style={{
               position: 'absolute',
               left: dragEnd.x + 12,
               top: dragEnd.y - 24,
               padding: '4px 10px',
               background: (config.clearType === 'original' ? currentSum === 10 : (currentSum % 10 === 0 && currentSum <= 50)) ? 'var(--leaf)' : 'var(--ink)',
               color: '#fff',
               borderRadius: 8,
               fontFamily: 'var(--font-num)', fontSize: 16, fontWeight: 700,
               pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: '4px 4px 0 rgba(0,0,0,0.2)', zIndex: 100
             }}>
               {currentSum} {(config.clearType === 'original' ? currentSum === 10 : (currentSum % 10 === 0 && currentSum <= 50)) ? '✓' : ''}
             </div>
           )}

           {floatingTexts.map(t => (
             <div key={t.id} className="combo-text" style={{ 
               position: 'absolute', left: t.x, top: t.y, pointerEvents: 'none',
               animation: 'floatUp 0.8s ease-out forwards',
               fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
               color: 'var(--apple)', textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff',
               zIndex: 200
             }}>
               {t.text}
             </div>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
      `}</style>

      {/* Game Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, paddingBottom: 10 }}>
        <button onClick={() => onFinish(engine.getScore(), 'quit')} style={{
           padding: '14px 32px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 16,
           cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>그만하기</button>
        <button onClick={onQuit} style={{
           padding: '14px 32px', background: 'var(--paper-warm)', color: 'var(--ink)', border: '1.5px solid var(--hairline)', borderRadius: 16,
           cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18
        }}>나가기</button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppleMascot size={48} mood={timeLeft <= 10 && config.timeMode !== 'infinite' ? "panic" : "happy"}/>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.3, background: 'var(--paper)', padding: '6px 12px', borderRadius: 12, border: '1px solid var(--hairline)' }}>
            <strong style={{ color: 'var(--ink)' }}>토토:</strong> {timeLeft <= 10 && config.timeMode !== 'infinite' ? "빨리, 빨리!!" : "좋은 페이스야!"}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GameScreen });
