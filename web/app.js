/**
 * app.js - 웹 UI 및 인터랙션 제어
 * 개편된 UI 시나리오(Main -> Settings -> Game) 반영 및 확장 옵션 지원
 */
let engine;
let canvas, ctx;
let isDragging = false;
let startX, startY, endX, endY;
let timeLeft = 120;
let timerInterval;
let gameConfig = {};
let currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };

const APPLE_SIZE = 44;
const PADDING = 10;

// 화면 전환 함수
function showScene(sceneId) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
}

function startGame() {
    // 설정값 가져오기
    const timeMode = document.getElementById('timeMode').value;
    const rows = parseInt(document.getElementById('rowsInput').value) || 10;
    const cols = parseInt(document.getElementById('colsInput').value) || 17;
    const seedType = document.getElementById('seedType').value;
    const clearType = document.getElementById('clearType').value;

    gameConfig = {
        timeMode,
        rows: Math.min(Math.max(rows, 5), 50),
        cols: Math.min(Math.max(cols, 5), 50),
        seedType,
        clearType
    };

    // UI 업데이트
    showScene('scene-game');
    const badgeText = `${gameConfig.cols}x${gameConfig.rows} | ${clearType === 'original' ? '오리지널' : '10의 배수'}`;
    document.getElementById('game-badge').innerText = badgeText;

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // 엔진 초기화
    engine = new GameEngine(gameConfig.rows, gameConfig.cols);

    let boardData;
    if (gameConfig.seedType === 'perfect') {
        boardData = SeedGenerator.perfectGen(gameConfig.rows, gameConfig.cols);
    } else {
        boardData = SeedGenerator.randomGen(gameConfig.rows, gameConfig.cols);
    }
    engine.initBoard(boardData);

    // 캔버스 크기 조정
    canvas.width = gameConfig.cols * APPLE_SIZE + PADDING * 2;
    canvas.height = gameConfig.rows * APPLE_SIZE + PADDING * 2;

    // 타이머 설정
    if (gameConfig.timeMode === 'infinite') {
        document.getElementById('timer').innerText = '∞';
        document.getElementById('timer').classList.remove('timer-warning');
        clearInterval(timerInterval);
    } else {
        timeLeft = parseInt(gameConfig.timeMode);
        startTimer();
    }

    setupEvents();
    render();
}

function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 10) {
            document.getElementById('timer').classList.add('timer-warning');
        } else {
            document.getElementById('timer').classList.remove('timer-warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`게임 종료! 최종 점수: ${engine.getScore()}`);
            showScene('scene-settings');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer').innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function render() {
    if (!engine || !document.getElementById('scene-game').classList.contains('active')) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const board = engine.getBoard();

    for (let r = 0; r < engine.rows; r++) {
        for (let c = 0; c < engine.cols; c++) {
            const val = board[r][c];
            if (val === 0) continue;

            const x = c * APPLE_SIZE + PADDING;
            const y = r * APPLE_SIZE + PADDING;

            const isSelected = isDragging && 
                               r >= currentSelection.r1 && r <= currentSelection.r2 && 
                               c >= currentSelection.c1 && c <= currentSelection.c2;

            if (isSelected) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
                ctx.fillStyle = '#ff6666';
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ff4d4d';
            }

            ctx.beginPath();
            ctx.arc(x + APPLE_SIZE/2, y + APPLE_SIZE/2, APPLE_SIZE/2 - 3, 0, Math.PI * 2);
            ctx.fill();

            // 꼭지
            ctx.fillStyle = '#4d2600';
            ctx.fillRect(x + APPLE_SIZE/2 - 2, y + 2, 4, 8);

            // 숫자
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + APPLE_SIZE/2, y + APPLE_SIZE/2 + 2);
        }
    }

    if (isDragging) {
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(0, 120, 255, 0.15)';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);

        if (currentSelection.sum > 0) {
            const isMatch = gameConfig.clearType === 'multiples' 
                ? (currentSelection.sum % 10 === 0 && currentSelection.sum <= 50) 
                : (currentSelection.sum === 10);
                
            ctx.fillStyle = isMatch ? '#00cc00' : '#0078ff';
            ctx.font = 'bold 24px Arial';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'white';
            ctx.fillText(currentSelection.sum, endX + 15, endY - 15);
            ctx.shadowBlur = 0;
        }
    }

    document.getElementById('score').innerText = engine.getScore();
    requestAnimationFrame(render);
}

function quitGame() {
    clearInterval(timerInterval);
    showScene('scene-settings');
}

function setupEvents() {
    const getCoords = e => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // CSS scale 반영 (캔버스 크기가 화면보다 클 경우 대비)
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const updateSelection = () => {
        const left = Math.min(startX, endX) - PADDING;
        const top = Math.min(startY, endY) - PADDING;
        const right = Math.max(startX, endX) - PADDING;
        const bottom = Math.max(startY, endY) - PADDING;

        let r1 = 1000, c1 = 1000, r2 = -1, c2 = -1;
        let found = false;

        for (let r = 0; r < engine.rows; r++) {
            for (let c = 0; c < engine.cols; c++) {
                const centerX = c * APPLE_SIZE + APPLE_SIZE / 2;
                const centerY = r * APPLE_SIZE + APPLE_SIZE / 2;

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
            currentSelection = { r1, c1, r2, c2, sum: engine.getAreaSum(r1, c1, r2, c2) };
        } else {
            currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };
        }
    };

    const startAction = e => {
        isDragging = true;
        const coords = getCoords(e);
        startX = coords.x;
        startY = coords.y;
        endX = startX;
        endY = startY;
        updateSelection();
    };

    const moveAction = e => {
        if (!isDragging) return;
        const coords = getCoords(e);
        endX = coords.x;
        endY = coords.y;
        updateSelection();
    };

    const endAction = () => {
        if (!isDragging) return;
        isDragging = false;

        if (engine.evaluateSelection(currentSelection.r1, currentSelection.c1, currentSelection.r2, currentSelection.c2, gameConfig.clearType)) {
            if (engine.getRemainingApples() === 0) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert(`축하합니다! 모든 사과를 제거했습니다. 최종 점수: ${engine.getScore()}`);
                    showScene('scene-settings');
                }, 100);
            }
        }
        currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };
    };

    // 기존 이벤트 제거 후 등록 (중복 방지)
    canvas.replaceWith(canvas.cloneNode(true));
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('mouseup', endAction);

    canvas.addEventListener('touchstart', e => { e.preventDefault(); startAction(e); }, { passive: false });
    window.addEventListener('touchmove', e => { moveAction(e); }, { passive: false });
    window.addEventListener('touchend', endAction);
}
