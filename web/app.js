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
let gameStartTime = 0;
let currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };

// 사운드 관리 (무료 라이브러리 소스 시뮬레이션)
const sounds = {
    bgm: new Audio('https://assets.mixkit.co/music/preview/mixkit-funny-puzzler-317.mp3'),
    pop: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-alert-2358.wav'),
    clear: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chime-2035.wav')
};
sounds.bgm.loop = true;

const APPLE_SIZE = 44;
const PADDING = 10;

// 화면 전환 함수
window.showScene = function(sceneId) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
    
    // 게임 화면이나 결과 화면이 아니면 BGM 정지
    if (sceneId !== 'scene-game' && sceneId !== 'scene-result') {
        sounds.bgm.pause();
    }
};

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
    gameStartTime = Date.now();

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

    // 사운드 재생
    sounds.bgm.currentTime = 0;
    sounds.bgm.play().catch(e => console.log("Audio play deferred by browser policy"));

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
            finishGame();
        }
    }, 1000);
}

/**
 * 게임 종료 통합 처리 함수
 */
function finishGame() {
    sounds.bgm.pause();
    const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const score = engine.getScore();
    
    // 기록 저장 호출 (Firebase)
    if (window.saveGameRecord) {
        window.saveGameRecord(gameConfig, score, playTime);
    }

    // 결과 화면 노출
    document.getElementById('final-score').innerText = score;
    document.getElementById('result-badge').innerText = document.getElementById('game-badge').innerText;
    showScene('scene-result');
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer').innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function render() {
    const isActive = document.getElementById('scene-game').classList.contains('active');
    const isResult = document.getElementById('scene-result').classList.contains('active');
    if (!engine || (!isActive && !isResult)) return;

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
            } else {
                ctx.shadowBlur = 0;
            }

            drawApple(ctx, x + APPLE_SIZE / 2, y + APPLE_SIZE / 2, APPLE_SIZE / 2 - 3, val, isSelected);
        }
    }

    if (isDragging) {
        const minX = Math.min(startX, endX);
        const minY = Math.min(startY, endY);
        const w = Math.abs(endX - startX);
        const h = Math.abs(endY - startY);
        
        ctx.strokeStyle = '#52B788';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(minX, minY, w, h, 10);
        } else {
            ctx.rect(minX, minY, w, h);
        }
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(82, 183, 136, 0.12)';
        ctx.fill();

        if (currentSelection.sum > 0) {
            const isMatch = gameConfig.clearType === 'multiples' 
                ? (currentSelection.sum % 10 === 0 && currentSelection.sum <= 50) 
                : (currentSelection.sum === 10);
                
            const textBgColor = isMatch ? '#2D6A4F' : '#1F1812';
            const textString = '∑ ' + currentSelection.sum + (isMatch ? ' ✓' : '');
            
            ctx.font = 'bold 16px "Pretendard"';
            const textWidth = ctx.measureText(textString).width;
            
            ctx.fillStyle = textBgColor;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(endX + 8, endY - 20, textWidth + 20, 30, 8);
            } else {
                ctx.rect(endX + 8, endY - 20, textWidth + 20, 30);
            }
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillText(textString, endX + 18, endY - 5);
        }
    }

    document.getElementById('score').innerText = engine.getScore();
    requestAnimationFrame(render);
}

/**
 * apple_image.png 스타일의 사과 렌더링
 */
function drawApple(ctx, cx, cy, r, value, isSelected) {
    ctx.save();
    
    // Selection ring
    if (isSelected) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = r * 0.2;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.7);
    ctx.quadraticCurveTo(cx + r*0.1, cy - r*1.0, cx + r*0.2, cy - r*0.9);
    ctx.strokeStyle = '#6B4226'; // var(--bark)
    ctx.lineWidth = r * 0.15;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.moveTo(cx + r*0.1, cy - r*0.9);
    ctx.quadraticCurveTo(cx + r*0.6, cy - r*1.1, cx + r*0.7, cy - r*0.6);
    ctx.quadraticCurveTo(cx + r*0.4, cy - r*0.5, cx + r*0.1, cy - r*0.9);
    ctx.fillStyle = '#2D6A4F'; // var(--leaf)
    ctx.fill();

    // Body (gradient) - 원형에 가깝게
    const gradient = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.1, cx, cy, r*1.2);
    gradient.addColorStop(0, '#F25C54'); // var(--apple-bright)
    gradient.addColorStop(0.55, '#D62828'); // var(--apple)
    gradient.addColorStop(1, '#9B1C1C'); // var(--apple-deep)
    
    ctx.beginPath();
    // 완전히 원형에 가깝게 처리
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Highlight
    ctx.save();
    ctx.beginPath();
    ctx.translate(cx - r*0.4, cy - r*0.4);
    ctx.rotate(-45 * Math.PI / 180);
    ctx.ellipse(0, 0, r*0.3, r*0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
    ctx.restore();

    // Number - 고딕체, 가독성 향상
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${Math.floor(r * 1.3)}px "Pretendard", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 그림자를 진하게 주어 가독성을 높임
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    
    // 텍스트 테두리 (가독성 추가)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeText(value, cx, cy + r*0.05);
    ctx.fillText(value, cx, cy + r*0.05);
    
    ctx.restore();
}

function showComboText(removedCount, x, y) {
    const layer = document.getElementById('combo-layer');
    const el = document.createElement('div');
    el.className = 'combo-text';
    
    let text = 'Good!';
    if (removedCount >= 10) text = 'Excellent!!';
    else if (removedCount >= 6) text = 'Great!';
    
    el.innerText = `${text} +${removedCount}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    layer.appendChild(el);
    
    setTimeout(() => el.remove(), 600);
    
    // 타격 효과음
    const pop = sounds.pop.cloneNode();
    pop.volume = 0.5;
    pop.play();
}

function quitGame() {
    clearInterval(timerInterval);
    finishGame("게임을 중단했습니다.");
}

function setupEvents() {
    const getCoords = e => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
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

        const beforeApples = engine.getRemainingApples();
        if (engine.evaluateSelection(currentSelection.r1, currentSelection.c1, currentSelection.r2, currentSelection.c2, gameConfig.clearType)) {
            const removed = beforeApples - engine.getRemainingApples();
            showComboText(removed, endX, endY);
            
            if (engine.getRemainingApples() === 0) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    sounds.clear.play();
                    finishGame("모든 사과를 제거했습니다!");
                }, 100);
            } else if (!engine.hasAvailableMoves(gameConfig.clearType)) {
                // 더 이상 가능한 수가 없을 때 자동 종료
                clearInterval(timerInterval);
                setTimeout(() => {
                    finishGame("더 이상 제거할 수 있는 사과가 없습니다!");
                }, 500);
            }
        }
        currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };
    };

    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('mouseup', endAction);

    canvas.addEventListener('touchstart', e => { e.preventDefault(); startAction(e); }, { passive: false });
    window.addEventListener('touchmove', e => { moveAction(e); }, { passive: false });
    window.addEventListener('touchend', endAction);
}
