const { useState, useEffect, useRef } = React;

function App() {
  const [screen, setScreen] = useState('main');
  const [user, setUser] = useState(null);
  const [gameConfig, setGameConfig] = useState({
    timeMode: '120',
    cols: 17,
    rows: 10,
    seedType: 'random',
    clearType: 'original'
  });
  const [engine, setEngine] = useState(null);
  const [records, setRecords] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [finalScore, setFinalScore] = useState(0);

  // Firebase Auth integration
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else if (!isGuest) {
        setUser(null);
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
    loginAsGuest(); // Existing logic in firebase.js sets isGuest = true and currentUser
    setUser({ displayName: name || 'Guest' });
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
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
    const playTime = 120; // Simplified for now
    if (window.saveGameRecord) {
      window.saveGameRecord(gameConfig, score, playTime);
    }
    setScreen('result');
  };

  const showRecords = async () => {
    setScreen('records');
    // We could fetch records here and set state
  };

  const showLeaderboard = () => {
    setScreen('leaderboard');
  };

  const screenComponent = (() => {
    switch (screen) {
      case 'main':
        return (
          <MainScreen
            user={user}
            onStart={() => setScreen('settings')}
            onRecords={showRecords}
            onLeaderboard={showLeaderboard}
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
      default:
        return <MainScreen onStart={() => setScreen('settings')} />;
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
