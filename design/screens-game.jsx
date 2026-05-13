// Game scene variants — the hero artboards

// Deterministic 17x10 board pattern
const BOARD_17x10 = (() => {
  const rows = 10, cols = 17;
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const b = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(Math.floor(rand() * 9) + 1);
    b.push(row);
  }
  return b;
})();

function GameGrid({ board = BOARD_17x10, cellSize = 36, gap = 4, shape = "realistic",
                    cleared = new Set(), selection = null, ghost = new Set() }) {
  const rows = board.length, cols = board[0].length;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap: gap,
      background: 'var(--paper)',
      padding: 18, borderRadius: 18,
      border: '1.5px solid var(--ink)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px rgba(107,66,38,0.10)',
      position: 'relative'
    }}>
      {board.map((row, r) => row.map((n, c) => {
        const key = `${r}-${c}`;
        const isCleared = cleared.has(key);
        const isGhost = ghost.has(key);
        const inSelection = selection &&
          r >= selection.r1 && r <= selection.r2 &&
          c >= selection.c1 && c <= selection.c2;
        return (
          <div key={key} style={{ position: 'relative' }}>
            {isCleared ? (
              <div style={{ width: cellSize, height: cellSize }}/>
            ) : (
              <AppleCell n={n} size={cellSize} shape={shape}
                         selected={inSelection} ghost={isGhost} />
            )}
          </div>
        );
      }))}
      {/* selection rectangle */}
      {selection && (() => {
        const left = 18 + selection.c1 * (cellSize + gap);
        const top = 18 + selection.r1 * (cellSize + gap);
        const w = (selection.c2 - selection.c1 + 1) * (cellSize + gap) - gap;
        const h = (selection.r2 - selection.r1 + 1) * (cellSize + gap) - gap;
        // Compute sum
        let sum = 0;
        for (let r = selection.r1; r <= selection.r2; r++)
          for (let c = selection.c1; c <= selection.c2; c++) sum += board[r][c];
        const valid = sum === 10;
        return (
          <>
            <div style={{
              position: 'absolute', left, top, width: w, height: h,
              border: `2.5px solid ${valid ? 'var(--leaf-light)' : 'var(--gold)'}`,
              borderRadius: 10,
              background: valid ? 'rgba(82,183,136,0.12)' : 'rgba(244,162,97,0.10)',
              pointerEvents: 'none', boxSizing: 'border-box',
              boxShadow: valid ? '0 0 0 4px rgba(82,183,136,0.18)' : 'none'
            }}/>
            <div style={{
              position: 'absolute', left: left + w + 8, top: top - 4,
              padding: '4px 10px', borderRadius: 8,
              background: valid ? 'var(--leaf)' : 'var(--ink)',
              color: '#fff', fontFamily: 'var(--font-num)', fontSize: 16, lineHeight: 1,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.20)'
            }}>
              ∑ {sum}{valid && ' ✓'}
            </div>
          </>
        );
      })()}
    </div>
  );
}

// HUD
function HUD({ score = 0, time = '01:47', mode = '17×10 · 오리지널', warn = false, combo = null }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24,
      padding: '14px 22px', background: 'var(--paper)', borderRadius: 16,
      border: '1.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
      fontFamily: 'var(--font-body)'
    }}>
      {/* score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>SCORE</div>
          <div style={{ fontFamily: 'var(--font-num)', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>{score}</div>
        </div>
        {combo && (
          <div style={{
            padding: '6px 12px', borderRadius: 10, background: 'var(--apple)', color: '#fff',
            fontFamily: 'var(--font-num)', fontSize: 18, transform: 'rotate(-3deg)',
            boxShadow: '2px 2px 0 var(--ink)'
          }}>×{combo} COMBO!</div>
        )}
      </div>

      {/* timer */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: warn ? 'var(--apple)' : 'var(--ink-mute)', textTransform: 'uppercase' }}>
          {warn ? '⚠ HURRY' : 'TIME'}
        </div>
        <div style={{
          fontFamily: 'var(--font-num)', fontSize: 56,
          color: warn ? 'var(--apple)' : 'var(--ink)', lineHeight: 1,
          letterSpacing: '0.02em'
        }}>{time}</div>
      </div>

      {/* mode + quit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>MODE</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>{mode}</div>
        </div>
        <button style={{
          padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          background: 'transparent', color: 'var(--ink-soft)',
          border: '1px solid var(--hairline)', borderRadius: 8, cursor: 'pointer'
        }}>나가기</button>
      </div>
    </div>
  );
}

// ─── A: normal play with active selection ────────────────────────────────
function GameA() {
  // Mid-drag selection at (4,3)-(5,5) — pre-arrange the board so sum=10
  // We'll just illustrate using the deterministic board with selection rectangle
  const sel = { r1: 4, c1: 3, r2: 5, c2: 5 };
  // Override those cells to sum to 10
  const board = BOARD_17x10.map(r => [...r]);
  // 2,1,2 / 1,3,1 = 10
  board[4][3] = 2; board[4][4] = 1; board[4][5] = 2;
  board[5][3] = 1; board[5][4] = 3; board[5][5] = 1;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 70% 0%, rgba(244,162,97,0.12), transparent 60%), var(--paper)`,
      padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      <HUD score={47} time="01:34" mode="17×10 · 오리지널" />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1 }}>
        {/* board */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GameGrid board={board} cellSize={36} selection={sel} />
        </div>

        {/* side panel */}
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
              <div style={{ width: '27%', height: '100%', background: 'var(--apple)', borderRadius: 999 }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-soft)' }}>
              <span>47 / 170</span>
              <span>27%</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--hairline)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>BEST COMBO</div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 28, color: 'var(--apple)', lineHeight: 1, marginTop: 4 }}>×4</div>
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
              드래그한 영역의 합이 정확히 10일 때 ✓ 사과들이 사라져요.
            </div>
          </div>

          {/* mascot peek */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppleMascot size={56} mood="happy"/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.3 }}>
              <strong style={{ color: 'var(--ink)' }}>토토:</strong><br/>좋은 페이스야!
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── B: tense final 10s ──────────────────────────────────────────────────
function GameB() {
  // Cleared scattered cells, no selection, panic state
  const cleared = new Set();
  // Simulate scatter
  for (let i = 0; i < 70; i++) {
    const r = (i * 13 + 1) % 10, c = (i * 7 + 4) % 17;
    cleared.add(`${r}-${c}`);
  }
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `radial-gradient(ellipse at 50% 50%, rgba(214,40,40,0.22), transparent 60%), var(--paper)`,
      padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden'
    }}>
      {/* pulse edges */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: 'inset 0 0 0 6px var(--apple), inset 0 0 80px rgba(214,40,40,0.35)',
        borderRadius: 0
      }}/>

      <HUD score={118} time="00:08" warn mode="17×10 · 오리지널" combo={3}/>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GameGrid board={BOARD_17x10} cellSize={36} cleared={cleared} />
        </div>

        <aside style={{
          width: 200, display: 'flex', flexDirection: 'column', gap: 14,
          padding: 16, background: 'var(--ink)', color: 'var(--paper)', borderRadius: 16,
          border: '1px solid var(--apple)', height: '100%',
          boxShadow: '0 0 0 4px rgba(214,40,40,0.25)'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--apple-bright)' }}>⚠ FINAL 10S</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, lineHeight: 1.05, marginTop: 8 }}>
              마지막<br/>스퍼트!
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(250,245,236,0.18)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>PROGRESS</div>
            <div style={{
              height: 6, background: 'rgba(250,245,236,0.15)', borderRadius: 999, marginTop: 6, overflow: 'hidden',
            }}>
              <div style={{ width: '70%', height: '100%', background: 'var(--apple-bright)', borderRadius: 999 }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.8 }}>
              <span>118 / 170</span>
              <span>70%</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(250,245,236,0.18)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>COMBO</div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 40, color: 'var(--apple-bright)', lineHeight: 1, marginTop: 4 }}>×3</div>
          </div>

          {/* mascot panic */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppleMascot size={56} mood="panic"/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, opacity: 0.9, lineHeight: 1.3 }}>
              <strong style={{ color: 'var(--apple-bright)' }}>토토:</strong><br/>"빨리, 빨리!!"
            </div>
          </div>
        </aside>
      </div>

      {/* floating combo text */}
      <div style={{
        position: 'absolute', left: '38%', top: '42%',
        fontFamily: 'var(--font-num)', fontSize: 84, color: 'var(--apple)',
        textShadow: '0 0 0 #fff, -3px -3px 0 #fff, 3px 3px 0 var(--ink)',
        WebkitTextStroke: '3px #fff',
        transform: 'rotate(-8deg)',
        pointerEvents: 'none'
      }}>+12</div>
    </div>
  );
}

// ─── C: dark/sepia variant for visual exploration ────────────────────────
function GameC() {
  const sel = { r1: 2, c1: 8, r2: 4, c2: 10 };
  const board = BOARD_17x10.map(r => [...r]);
  // make selection sum 10
  board[2][8] = 1; board[2][9] = 1; board[2][10] = 2;
  board[3][8] = 1; board[3][9] = 1; board[3][10] = 1;
  board[4][8] = 1; board[4][9] = 1; board[4][10] = 1;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#1F1812',
      padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18,
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden',
      color: 'var(--paper)'
    }}>
      {/* HUD dark variant */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24,
        padding: '14px 22px', background: 'rgba(250,245,236,0.04)',
        borderRadius: 16, border: '1px solid rgba(250,245,236,0.12)'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--honey)', textTransform: 'uppercase' }}>SCORE</div>
          <div style={{ fontFamily: 'var(--font-num)', fontSize: 36, color: 'var(--paper)', lineHeight: 1 }}>92</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--honey)', textTransform: 'uppercase' }}>TIME</div>
          <div style={{ fontFamily: 'var(--font-num)', fontSize: 56, color: 'var(--honey)', lineHeight: 1, letterSpacing: '0.02em' }}>01:12</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--honey)', textTransform: 'uppercase' }}>MODE · 다크</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--paper)', fontWeight: 700 }}>25×15 · 10의 배수</div>
          </div>
          <button style={{
            padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: 'transparent', color: 'var(--paper)',
            border: '1px solid rgba(250,245,236,0.2)', borderRadius: 8, cursor: 'pointer'
          }}>나가기</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(17, 36px)`,
            gridTemplateRows: `repeat(10, 36px)`,
            gap: 4,
            background: 'rgba(250,245,236,0.04)',
            padding: 18, borderRadius: 18,
            border: '1px solid rgba(250,245,236,0.10)',
            position: 'relative'
          }}>
            {board.map((row, r) => row.map((n, c) => {
              const key = `${r}-${c}`;
              const inSel = r >= sel.r1 && r <= sel.r2 && c >= sel.c1 && c <= sel.c2;
              return <AppleCell key={key} n={n} size={36} shape="realistic" selected={inSel} />;
            }))}
            {(() => {
              const cellSize = 36, gap = 4;
              const left = 18 + sel.c1 * (cellSize + gap);
              const top = 18 + sel.r1 * (cellSize + gap);
              const w = (sel.c2 - sel.c1 + 1) * (cellSize + gap) - gap;
              const h = (sel.r2 - sel.r1 + 1) * (cellSize + gap) - gap;
              return (
                <>
                  <div style={{
                    position: 'absolute', left, top, width: w, height: h,
                    border: '2.5px solid var(--leaf-light)', borderRadius: 10,
                    background: 'rgba(82,183,136,0.18)',
                    boxShadow: '0 0 0 4px rgba(82,183,136,0.20), 0 0 40px rgba(82,183,136,0.35)',
                    pointerEvents: 'none', boxSizing: 'border-box'
                  }}/>
                  <div style={{
                    position: 'absolute', left: left + w + 8, top: top - 4,
                    padding: '4px 10px', borderRadius: 8,
                    background: 'var(--leaf-light)', color: '#1F1812',
                    fontFamily: 'var(--font-num)', fontSize: 16
                  }}>∑ 10 ✓</div>
                </>
              );
            })()}
          </div>
        </div>

        <aside style={{
          width: 200, display: 'flex', flexDirection: 'column', gap: 14,
          padding: 16, background: 'rgba(250,245,236,0.04)', borderRadius: 16,
          border: '1px solid rgba(250,245,236,0.10)', height: '100%'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--honey)' }}>DARK MODE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 8 }}>
              밤사과<br/>오케스트라
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(250,245,236,0.10)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>RULES</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, marginTop: 6, opacity: 0.85, lineHeight: 1.5 }}>
              합이 <strong style={{ color: 'var(--honey)' }}>10의 배수</strong>일 때 따집니다. 10, 20, 30…
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(250,245,236,0.10)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>PROGRESS</div>
            <div style={{ height: 6, background: 'rgba(250,245,236,0.15)', borderRadius: 999, marginTop: 6 }}>
              <div style={{ width: '24%', height: '100%', background: 'var(--honey)', borderRadius: 999 }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.8 }}>
              <span>92 / 375</span><span>24%</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppleMascot size={56} mood="sleepy"/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, opacity: 0.9, lineHeight: 1.3 }}>
              <strong style={{ color: 'var(--honey)' }}>토토:</strong><br/>"한밤의 따기."
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { GameA, GameB, GameC, GameGrid, HUD, BOARD_17x10 });
