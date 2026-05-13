const { useState, useEffect, useRef } = React;

const PALETTES = {
  original: {
    '--paper': '#F8FBF2', '--paper-warm': '#EAF2DA', '--paper-dark': '#D6E4B8', '--hairline': '#C3D2A4',
    '--apple': '#E63946', '--apple-deep': '#A91D29', '--apple-bright': '#FF6B6B',
    '--leaf': '#1B4332', '--leaf-light': '#74C69D', '--gold': '#F4A261', '--honey': '#FFD166',
    '--ink': '#1B2410', '--ink-soft': '#3D4C24', '--ink-mute': '#7B8868'
  },
  warm: {
    '--paper': '#FFF9EB', '--paper-warm': '#F9F1D8', '--paper-dark': '#EDDFC2', '--hairline': '#E2D1B0',
    '--apple': '#D62828', '--apple-deep': '#9B1C1C', '--apple-bright': '#F25C54',
    '--leaf': '#386641', '--leaf-light': '#6A994E', '--gold': '#F4A261', '--honey': '#FFD166',
    '--ink': '#2B1E16', '--ink-soft': '#5C4336', '--ink-mute': '#9C8476'
  }
};

function App() {
  const [screen, setScreen] = useState('main');
  const [theme, setTheme] = useState('original');
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
  const [lbFilters, setLbFilters] = useState({ time: '120', size: '17x10' });
  const [finalScore, setFinalScore] = useState(0);

  // Apply theme to :root
  useEffect(() => {
    const vars = PALETTES[theme];
    for (const [k, v] of Object.entries(vars)) {
      document.documentElement.style.setProperty(k, v);
    }
  }, [theme]);

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

  const finishGame = (score) => {
    setFinalScore(score);
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
    const targetModeKey = `${lbFilters.time}_${lbFilters.size}_random_original`;
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
      rankingData.sort((a, b) => b.highScore - a.highScore);
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
            onThemeToggle={() => setTheme(t => t === 'original' ? 'warm' : 'original')}
            onQuit={() => setScreen('main')}
            onFinish={() => finishGame(engine.getScore())}
          />
        );
      case 'result':
        return (
          <ResultScreen
            score={finalScore}
            config={gameConfig}
            onRestart={startGame}
            onNewSettings={() => setScreen('settings')}
            onMain={() => setScreen('main')}
          />
        );
      case 'records':
        return <RecordsScreen records={records} onMain={() => setScreen('main')} />;
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
        return <MainScreen user={user} onStart={() => setScreen('settings')} onLogin={handleLogin} />;
    }
  })();

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1B2410'
    }}>
      <div style={{
        position: 'relative',
        width: 'min(100vw, 1280px)',
        aspectRatio: '16 / 10',
        maxHeight: '100vh',
        background: 'var(--paper)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        overflow: 'hidden'
      }}>
        {screenComponent}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
