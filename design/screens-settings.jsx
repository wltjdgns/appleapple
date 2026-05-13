// Settings scene variants

function SettingsA() {
  // Stacked card form
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      display: 'grid', gridTemplateColumns: '1fr 460px',
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      {/* Left: preview */}
      <div style={{
        background: 'var(--paper-warm)', padding: 48, position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ← 메인으로 · BACK
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--ink)', fontWeight: 700, letterSpacing: '-0.03em', marginTop: 16, lineHeight: 1 }}>
            오늘의<br/>한 바구니<br/>준비.
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', marginTop: 18, maxWidth: 340, lineHeight: 1.5 }}>
            모드와 크기를 골라요. 오른쪽 미리보기에서 어떤 판에서 플레이할지 한눈에 확인할 수 있어요.
          </div>
        </div>

        {/* preview tile */}
        <div style={{
          background: 'var(--paper)', borderRadius: 18, padding: 20,
          border: '1.5px solid var(--ink)',
          boxShadow: '6px 6px 0 var(--ink)', alignSelf: 'flex-start'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14, paddingBottom: 12, borderBottom: '1px dashed var(--hairline)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              Preview · 17 × 10
            </div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 20, color: 'var(--apple)' }}>2:00</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 18px)', gap: 3 }}>
            {Array.from({length: 12 * 7}).map((_, i) => {
              const n = ((i * 13 + 3) % 9) + 1;
              return <AppleCell key={i} n={n} size={18} shape="realistic" leaf={false} />;
            })}
          </div>
          <div style={{ marginTop: 14, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>오리지널</strong> 룰셋 · 합이 정확히 10인 영역을 따요.
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        background: 'var(--paper)', padding: '48px 44px',
        display: 'flex', flexDirection: 'column', gap: 22,
        borderLeft: '1px solid var(--hairline)'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Step 02 / 03</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink)', fontWeight: 700, marginTop: 4 }}>게임 설정</div>
        </div>

        <FormField label="시간 모드" caption="얼마나 오래 따고 싶나요?">
          <SegmentGroup options={['2분 (제한)', '무한 시간']} selected={0} />
        </FormField>

        <FormField label="배열 크기" caption="가로 × 세로 — 5 to 50">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NumberInput value="17" label="가로" />
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 24, color: 'var(--ink-mute)' }}>×</span>
            <NumberInput value="10" label="세로" />
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              {['17×10','25×15','50×30'].map((p, i) => (
                <button key={p} style={{
                  padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '0.05em',
                  background: i === 0 ? 'var(--ink)' : 'transparent',
                  color: i === 0 ? 'var(--paper)' : 'var(--ink-soft)',
                  border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer'
                }}>{p}</button>
              ))}
            </div>
          </div>
        </FormField>

        <FormField label="클리어 가능 여부" caption="판이 100% 풀이 가능한가?">
          <SegmentGroup options={['랜덤 (일반)', '퍼펙트 시드']} selected={0} />
        </FormField>

        <FormField label="클리어 타입" caption="어떤 합으로 사라지게 할까?">
          <SegmentGroup options={['오리지널 (=10)', '10의 배수']} selected={0} />
        </FormField>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton variant="primary">게임 시작 →</PrimaryButton>
          <PrimaryButton variant="ghost">뒤로 가기</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, caption, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>{caption}</div>
      </div>
      {children}
    </div>
  );
}

function SegmentGroup({ options, selected }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      background: 'var(--paper-warm)', padding: 4, borderRadius: 12,
      border: '1px solid var(--hairline)'
    }}>
      {options.map((o, i) => (
        <button key={o} style={{
          padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          background: i === selected ? 'var(--paper)' : 'transparent',
          color: i === selected ? 'var(--ink)' : 'var(--ink-soft)',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          boxShadow: i === selected ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)' : 'none'
        }}>{o}</button>
      ))}
    </div>
  );
}

function NumberInput({ value, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: 'var(--paper-warm)', borderRadius: 10,
      border: '1.5px solid var(--hairline)', padding: '4px 6px 4px 12px',
      width: 96
    }}>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: 24, color: 'var(--ink)' }}>{value}</span>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', gap: 2 }}>
        <button style={{ width: 22, height: 16, fontSize: 10, padding: 0, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 4, cursor: 'pointer', lineHeight: 1 }}>▲</button>
        <button style={{ width: 22, height: 16, fontSize: 10, padding: 0, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 4, cursor: 'pointer', lineHeight: 1 }}>▼</button>
      </div>
    </div>
  );
}

// ─── Option B: Card-deck mode pickers ────────────────────────────────────
function SettingsB() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper-warm)',
      padding: '36px 48px', display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'var(--font-body)', overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--apple-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>● 게임 설정 · CONFIGURE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--ink)', fontWeight: 700, marginTop: 4 }}>
            어떤 판을 깔까요?
          </div>
        </div>
        <button style={{
          padding: '10px 18px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em',
          textTransform: 'uppercase', background: 'transparent',
          color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 999, cursor: 'pointer'
        }}>← 뒤로</button>
      </div>

      {/* Time mode cards */}
      <SettingsRow label="시간 모드" hint="얼마나 길게 할까">
        <ChoiceCard active>
          <div style={{ fontFamily: 'var(--font-num)', fontSize: 56, color: 'var(--apple)', lineHeight: 1 }}>2:00</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 6 }}>제한 모드</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>120초의 압박</div>
        </ChoiceCard>
        <ChoiceCard>
          <div style={{ fontFamily: 'var(--font-num)', fontSize: 56, color: 'var(--ink)', lineHeight: 1 }}>∞</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 6 }}>무한 모드</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>천천히, 끝까지</div>
        </ChoiceCard>
      </SettingsRow>

      {/* Grid size */}
      <SettingsRow label="배열 크기" hint="5 × 5 부터 50 × 50까지">
        <ChoiceCard active sizeM>
          <MiniGrid cols={17} rows={10} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 8 }}>17 × 10 · 클래식</div>
        </ChoiceCard>
        <ChoiceCard sizeM>
          <MiniGrid cols={25} rows={15} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 8 }}>25 × 15 · 미디엄</div>
        </ChoiceCard>
        <ChoiceCard sizeM>
          <MiniGrid cols={50} rows={30} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 8 }}>50 × 30 · 거대</div>
        </ChoiceCard>
        <ChoiceCard sizeM>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-num)', fontSize: 28, color: 'var(--ink-soft)' }}>
            <span>17</span><span style={{ fontSize: 18, color: 'var(--ink-mute)' }}>×</span><span>10</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', fontWeight: 700, marginTop: 8 }}>커스텀</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>직접 입력</div>
        </ChoiceCard>
      </SettingsRow>

      {/* Two-up: seed + rule */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <SettingsRow label="클리어 가능 여부" hint="100% 풀 수 있는 판?">
          <ChoiceCard active sizeS>
            <div style={{ fontFamily: 'var(--font-en)', fontSize: 28, color: 'var(--ink)', fontStyle: 'italic' }}>random</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>랜덤 · 일반</div>
          </ChoiceCard>
          <ChoiceCard sizeS>
            <div style={{ fontFamily: 'var(--font-en)', fontSize: 28, color: 'var(--apple-deep)', fontStyle: 'italic' }}>perfect</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>퍼펙트 시드</div>
          </ChoiceCard>
        </SettingsRow>

        <SettingsRow label="클리어 타입" hint="어떤 합으로 사라지나">
          <ChoiceCard active sizeS>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 32, color: 'var(--apple)' }}>=10</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>오리지널</div>
          </ChoiceCard>
          <ChoiceCard sizeS>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 32, color: 'var(--ink)' }}>×10</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>10의 배수</div>
          </ChoiceCard>
        </SettingsRow>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
          현재 설정 · <strong style={{ color: 'var(--ink)' }}>17 × 10 · 오리지널 · 2:00 · 랜덤</strong>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <PrimaryButton variant="ghost">뒤로</PrimaryButton>
          <PrimaryButton variant="primary">게임 시작 →</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.005em' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-mute)' }}>{hint}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function ChoiceCard({ children, active = false, sizeS = false, sizeM = false }) {
  return (
    <div style={{
      background: active ? 'var(--paper)' : 'var(--paper)',
      padding: sizeS ? '14px 18px' : sizeM ? '14px' : '18px 22px',
      borderRadius: 14, cursor: 'pointer',
      border: active ? '2px solid var(--apple)' : '1.5px solid var(--hairline)',
      boxShadow: active
        ? '0 1px 0 rgba(155,28,28,0.10), 0 8px 20px rgba(155,28,28,0.12)'
        : '0 1px 0 rgba(0,0,0,0.04)',
      minWidth: sizeS ? 130 : sizeM ? 150 : 170,
      position: 'relative',
      transform: active ? 'translateY(-2px)' : 'none'
    }}>
      {active && (
        <div style={{
          position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: 999,
          background: 'var(--apple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700
        }}>✓</div>
      )}
      {children}
    </div>
  );
}

function MiniGrid({ cols, rows }) {
  const total = cols * rows;
  const cellW = Math.min(110 / cols, 70 / rows, 4);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellW}px)`,
      gap: cellW > 3 ? 1 : 0,
      width: cols * cellW + (cellW > 3 ? cols - 1 : 0),
      height: rows * cellW + (cellW > 3 ? rows - 1 : 0)
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          background: ((i * 7) % 4 === 0) ? 'var(--apple)' : 'var(--apple-bright)',
          borderRadius: cellW > 2 ? cellW / 2 : 0
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, { SettingsA, SettingsB });
