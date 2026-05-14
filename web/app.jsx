const { useState, useEffect, useRef } = React;

const PALETTES = {
  original: {
    '--paper': '#F8FBF2', '--paper-warm': '#EAF2DA', '--paper-dark': '#D6E4B8', '--hairline': '#C3D2A4',
    '--apple': '#ff3333', '--apple-deep': '#A91D29', '--apple-bright': '#FF6B6B',
    '--leaf': '#1B4332', '--leaf-light': '#74C69D', '--gold': '#F4A261', '--honey': '#FFD166',
    '--ink': '#1B2410', '--ink-soft': '#3D4C24', '--ink-mute': '#7B8868'
  },
  warm: {
    '--paper': '#F8FBF2', '--paper-warm': '#EAF2DA', '--paper-dark': '#D6E4B8', '--hairline': '#C3D2A4',
    '--apple': '#e56f5b', '--apple-deep': '#A91D29', '--apple-bright': '#FF6B6B',
    '--leaf': '#1B4332', '--leaf-light': '#74C69D', '--gold': '#F4A261', '--honey': '#FFD166',
    '--ink': '#1B2410', '--ink-soft': '#3D4C24', '--ink-mute': '#7B8868'
  },
  custom: {
    '--paper': '#F8FBF2', '--paper-warm': '#EAF2DA', '--paper-dark': '#D6E4B8', '--hairline': '#C3D2A4',
    '--apple': '#ff3333', '--apple-deep': '#A91D29', '--apple-bright': '#FF6B6B',
    '--leaf': '#1B4332', '--leaf-light': '#74C69D', '--gold': '#F4A261', '--honey': '#FFD166',
    '--ink': '#1B2410', '--ink-soft': '#3D4C24', '--ink-mute': '#7B8868'
  }
};

function App() {
  const [screen, setScreen] = useState('main');
  const [theme, setTheme] = useState('original');
  const [customColor, setCustomColor] = useState('#ff3333');
  const [appleShape, setAppleShape] = useState('realistic');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [gameConfig, setGameConfig] = useState({
    timeMode: '120',
    cols: 17,
    rows: 10,
    seedType: 'random',
    clearType: 'original'
  });
  const [engine, setEngine] = useState(null);
  const [records, setRecords] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbFilters, setLbFilters] = useState({ time: '120', size: '17x10', sort: 'highScore', clearType: 'original' });
  const [finalScore, setFinalScore] = useState(0);
  const [finishReason, setFinishReason] = useState('quit');

  // Apply theme to :root
  useEffect(() => {
    const activeTheme = screen === 'game' ? theme : 'original';
    const vars = PALETTES[activeTheme] || PALETTES['original'];
    for (const [k, v] of Object.entries(vars)) {
      document.documentElement.style.setProperty(k, v);
    }
    if (activeTheme === 'custom') {
      document.documentElement.style.setProperty('--apple', customColor);
      // Darken color slightly for apple-deep
      document.documentElement.style.setProperty('--apple-deep', '#8B0000'); // generic deep for custom
    }
  }, [theme, customColor, screen]);

  // Firebase Auth integration
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        // If guest mode is active, currentUser is set in firebase.js
        if (isGuest && currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginAsGuest = (name) => {
    const nickname = name?.trim() || "Guest_" + Math.floor(Math.random() * 9000 + 1000);
    isGuest = true;
    currentUser = { uid: 'guest', displayName: nickname };
    setUser(currentUser);
    setScreen('main');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setScreen('main');
  };

  const startGame = () => {
    const newEngine = new GameEngine(gameConfig.rows, gameConfig.cols);
    let boardData;
    if (gameConfig.seedType === 'perfect') {
      boardData = SeedGenerator.perfectGen(gameConfig.rows, gameConfig.cols);
    } else {
      boardData = SeedGenerator.randomGen(gameConfig.rows, gameConfig.cols);
    }
    newEngine.initBoard(boardData);
    setEngine(newEngine);
    setScreen('game');
  };

  const finishGame = (score, reason = 'quit') => {
    setFinalScore(score);
    setFinishReason(reason);
    const playTime = 120; 
    if (window.saveGameRecord) {
      window.saveGameRecord(gameConfig, score, playTime);
    }
    setScreen('result');
  };

  const fetchRecords = async () => {
    if (!user) return;
    if (isGuest) {
      setRecords(guestRecords);
    } else {
      const userRef = db.collection('users').doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        setRecords(userSnap.data().records || {});
      }
    }
    setScreen('records');
  };

  const fetchLeaderboard = async () => {
    const targetModeKey = `${lbFilters.time}_${lbFilters.size}_random_${lbFilters.clearType}`;
    try {
      const usersSnap = await db.collection('users').get();
      let rankingData = [];
      usersSnap.forEach(doc => {
        const data = doc.data();
        if (data.records && data.records[targetModeKey]) {
          const record = data.records[targetModeKey];
          rankingData.push({
            name: data.displayName || '익명 유저',
            highScore: record.highScore || 0,
            playCount: record.playCount || 0
          });
        }
      });
      rankingData.sort((a, b) => b[lbFilters.sort] - a[lbFilters.sort]);
      setLeaderboard(rankingData);
    } catch (e) {
      console.error(e);
    }
    setScreen('leaderboard');
  };

  const screenComponent = (() => {
    switch (screen) {
      case 'main':
        return (
          <MainScreen
            user={user}
            appleShape={appleShape}
            onStart={() => setScreen('settings')}
            onRecords={fetchRecords}
            onLeaderboard={fetchLeaderboard}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onLoginAsGuest={handleLoginAsGuest}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            config={gameConfig}
            onChange={(key, val) => setGameConfig(prev => ({ ...prev, [key]: val }))}
            theme={theme}
            onThemeChange={(val) => setTheme(val)}
            customColor={customColor}
            onCustomColorChange={(val) => setCustomColor(val)}
            appleShape={appleShape}
            onAppleShapeChange={(val) => setAppleShape(val)}
            musicEnabled={musicEnabled}
            onMusicToggle={() => setMusicEnabled(!musicEnabled)}
            onStart={startGame}
            onBack={() => setScreen('main')}
          />
        );
      case 'game':
        return (
          <GameScreen
            engine={engine}
            config={gameConfig}
            theme={theme}
            onThemeToggle={(val) => setTheme(val || (theme === 'original' ? 'warm' : 'original'))}
            customColor={customColor}
            onCustomColorChange={(val) => setCustomColor(val)}
            appleShape={appleShape}
            onAppleShapeChange={(val) => setAppleShape(val)}
            musicEnabled={musicEnabled}
            onMusicToggle={() => setMusicEnabled(!musicEnabled)}
            onQuit={() => setScreen('main')}
            onFinish={(score, reason) => finishGame(score, reason)}
          />
        );
      case 'result':
        return (
          <ResultScreen
            score={finalScore}
            config={gameConfig}
            reason={finishReason}
            appleShape={appleShape}
            onRestart={startGame}
            onNewSettings={() => setScreen('settings')}
            onMain={() => setScreen('main')}
            onLeaderboard={fetchLeaderboard}
          />
        );
      case 'records':
        return <RecordsScreen records={records} appleShape={appleShape} onMain={() => setScreen('main')} />;
      case 'leaderboard':
        return (
          <LeaderboardScreen 
            leaderboard={leaderboard} 
            filters={lbFilters}
            onFilterChange={(k, v) => setLbFilters(prev => ({...prev, [k]: v}))}
            onRefresh={fetchLeaderboard}
            onMain={() => setScreen('main')} 
          />
        );
      default:
        return <MainScreen user={user} appleShape={appleShape} onStart={() => setScreen('settings')} onLogin={handleLogin} />;
    }
  })();

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--paper)'
    }}>
      {musicEnabled && (
        <iframe
          width="1"
          height="1"
          src="https://www.youtube.com/embed/ni1iFd-qhZI?autoplay=1&loop=1&playlist=ni1iFd-qhZI&list=PLNO8mbP5cc3EWK2anVhCoRTz5ggHUyRNn"
          allow="autoplay"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      )}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--paper)',
        overflow: 'hidden'
      }}>
        {screenComponent}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
