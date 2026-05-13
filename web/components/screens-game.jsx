// Game scene with engine integration

function GameGrid({ board, cellSize = 36, selection = null, cleared = new Set() }) {
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
        const isGhost = n === 0 || cleared.has(key);
        const isSelected = selection && r >= selection.r1 && r <= selection.r2 && c >= selection.c1 && c <= selection.c2;
        return <AppleCell key={key} n={n} size={cellSize} shape="realistic" ghost={isGhost} selected={isSelected} />;
      }))}

      {/* drag overlay visual helper */}
      {selection && (
        <div style={{
          position: 'absolute',
          left: 18 + selection.c1 * (cellSize + gap),
          top: 18 + selection.r1 * (cellSize + gap),
          width: (selection.c2 - selection.c1 + 1) * (cellSize + gap) - gap,
          height: (selection.r2 - selection.r1 + 1) * (cellSize + gap) - gap,
          border: '2.5px solid var(--leaf-light)', borderRadius: 10,
          background: 'rgba(82,183,136,0.12)',
          pointerEvents: 'none', boxSizing: 'border-box'
        }}/>
      )}
    </div>
  );
}

function HUD({ score, time, warn = false, mode, combo = 0 }) {
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
          {combo > 0 && <div style={{ fontFamily: 'var(--font-num)', fontSize: 16, color: 'var(--apple)', fontWeight: 800 }}>COMBO ×{combo}</div>}
        </div>
        <button id="quit-btn" style={{
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

function GameScreen({ engine, config, onQuit, onFinish }) {
  const [board, setBoard] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(120);
  const [selection, setSelection] = React.useState(null);
  const [combo, setCombo] = React.useState(0);
  const [floatingTexts, setFloatingTexts] = React.useState([]);
  const canvasRef = React.useRef(null);
  const requestRef = React.useRef();

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
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [config.timeMode]);

  const handleDragStart = (r, c) => {
    setSelection({ r1: r, c1: c, r2: r, c2: c });
  };

  const handleDragMove = (r, c) => {
    if (selection) {
      setSelection(prev => ({
        r1: Math.min(prev.r1, r),
        c1: Math.min(prev.c1, c),
        r2: Math.max(prev.r2, r),
        c2: Math.max(prev.c2, c),
      }));
    }
  };

  const handleDragEnd = () => {
    if (selection) {
      const beforeApples = engine.getRemainingApples();
      if (engine.evaluateSelection(selection.r1, selection.c1, selection.r2, selection.c2, config.clearType)) {
        const removed = beforeApples - engine.getRemainingApples();
        setBoard([...engine.getBoard().map(r => [...r])]);
        setScore(engine.getScore());
        // Combo logic could be added here
        if (engine.getRemainingApples() === 0) {
          onFinish();
        } else if (!engine.hasAvailableMoves(config.clearType)) {
           setTimeout(onFinish, 1000);
        }
      }
      setSelection(null);
    }
  };

  const formatTime = (seconds) => {
    if (config.timeMode === 'infinite') return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Drag event delegation for the grid
  const handleGridPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 18; // PADDING
    const y = e.clientY - rect.top - 18;
    const c = Math.floor(x / 40); // CellSize(36) + Gap(4)
    const r = Math.floor(y / 40);
    if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
      handleDragStart(r, c);
    }
  };

  const handleGridPointerMove = (e) => {
    if (!selection) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 18;
    const y = e.clientY - rect.top - 18;
    const c = Math.floor(x / 40);
    const r = Math.floor(y / 40);
    if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
      handleDragMove(r, c);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 70% 0%, rgba(244,162,97,0.12), transparent 60%), var(--paper)`,
      padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }} onPointerUp={handleDragEnd}>
      
      <HUD
        score={score}
        time={formatTime(timeLeft)}
        warn={timeLeft <= 10 && config.timeMode !== 'infinite'}
        mode={`${config.cols}×${config.rows} · ${config.clearType === 'original' ? '오리지널' : '10의 배수'}`}
      />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
          <div onPointerDown={handleGridPointerDown} onPointerMove={handleGridPointerMove}>
             {board.length > 0 && <GameGrid board={board} cellSize={36} selection={selection} />}
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
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)', marginTop: 8, lineHeight: 1.4 }}>
              드래그한 영역의 합이 10일 때 사과들이 사라져요.
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

      <button onClick={onQuit} style={{
         position: 'absolute', bottom: 20, right: 20, padding: '10px 20px',
         background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 12,
         cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700
      }}>그만하기</button>
    </div>
  );
}

Object.assign(window, { GameScreen });
