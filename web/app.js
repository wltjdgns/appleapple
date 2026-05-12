/**
 * app.js - 웹 UI 및 인터랙션 제어
 */
let engine;
let canvas, ctx;
let isDragging = false;
let startX, startY, endX, endY;
let timeLeft = 120;
let timerInterval;

const APPLE_SIZE = 40;
const PADDING = 10;

function startGame(mode) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-container').style.display = 'block';

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    let rows = parseInt(document.getElementById('rowsInput').value) || 17;
    let cols = parseInt(document.getElementById('colsInput').value) || 10;

    engine = new GameEngine(rows, cols);

    // 보드 생성
    let boardData;
    if (mode === 'perfect') {
        boardData = SeedGenerator.perfectGen(rows, cols);
    } else {
        boardData = SeedGenerator.randomGen(rows, cols);
    }
    engine.initBoard(boardData);

    // 캔버스 크기 조절
    canvas.width = cols * APPLE_SIZE + PADDING * 2;
    canvas.height = rows * APPLE_SIZE + PADDING * 2;

    // 타이머 설정
    if (mode === 'infinite') {
        document.getElementById('timer').innerText = 'Infinite';
    } else {
        timeLeft = 120;
        startTimer();
    }

    render();
    setupEvents();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`게임 종료! 최종 점수: ${engine.getScore()}`);
            location.reload();
        }
    }, 1000);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const board = engine.getBoard();

    for (let r = 0; r < engine.rows; r++) {
        for (let c = 0; c < engine.cols; c++) {
            const val = board[r][c];
            if (val === 0) continue;

            const x = c * APPLE_SIZE + PADDING;
            const y = r * APPLE_SIZE + PADDING;

            // 사과 그리기 (간단한 원형)
            ctx.beginPath();
            ctx.arc(x + APPLE_SIZE/2, y + APPLE_SIZE/2, APPLE_SIZE/2 - 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ff4d4d';
            ctx.fill();

            // 숫자 그리기
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + APPLE_SIZE/2, y + APPLE_SIZE/2);
        }
    }

    // 드래그 영역 표시
    if (isDragging) {
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        ctx.fillStyle = 'rgba(0, 100, 255, 0.1)';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
    }

    document.getElementById('score').innerText = `Score: ${engine.getScore()}`;
    requestAnimationFrame(render);
}

function setupEvents() {
    const getCoords = e => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startAction = e => {
        isDragging = true;
        const coords = getCoords(e);
        startX = coords.x;
        startY = coords.y;
        endX = startX;
        endY = startY;
    };

    const moveAction = e => {
        if (!isDragging) return;
        const coords = getCoords(e);
        endX = coords.x;
        endY = coords.y;
    };

    const endAction = () => {
        if (!isDragging) return;
        isDragging = false;

        // 드래그 방향에 상관없이 최소/최대 좌표 구함
        const left = Math.min(startX, endX) - PADDING;
        const top = Math.min(startY, endY) - PADDING;
        const right = Math.max(startX, endX) - PADDING;
        const bottom = Math.max(startY, endY) - PADDING;

        // 인덱스 계산 (셀의 절반 이상이 포함되면 선택된 것으로 간주)
        const c1 = Math.round(left / APPLE_SIZE);
        const r1 = Math.round(top / APPLE_SIZE);
        const c2 = Math.round((right - APPLE_SIZE) / APPLE_SIZE);
        const r2 = Math.round((bottom - APPLE_SIZE) / APPLE_SIZE);

        // 유효 범위 내에서 평가
        const validR1 = Math.max(0, Math.min(r1, engine.rows - 1));
        const validC1 = Math.max(0, Math.min(c1, engine.cols - 1));
        const validR2 = Math.max(validR1, Math.min(r2 + 1, engine.rows - 1));
        const validC2 = Math.max(validC1, Math.min(c2 + 1, engine.cols - 1));

        engine.evaluateSelection(validR1, validC1, validR2, validC2);
    };

    canvas.addEventListener('mousedown', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('mouseup', endAction);

    // 터치 이벤트 지원
    canvas.addEventListener('touchstart', e => { e.preventDefault(); startAction(e); });
    window.addEventListener('touchmove', e => { moveAction(e); });
    window.addEventListener('touchend', endAction);
}
