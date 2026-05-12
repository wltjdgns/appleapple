/**
 * app.js - 웹 UI 및 인터랙션 제어
 * 드래그 감도 및 실시간 피드백 개선 버전
 */
let engine;
let canvas, ctx;
let isDragging = false;
let startX, startY, endX, endY;
let timeLeft = 120;
let timerInterval;
let currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };

const APPLE_SIZE = 44;
const PADDING = 10;

function startGame(mode) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-container').style.display = 'block';

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    let rows = parseInt(document.getElementById('rowsInput').value) || 10;
    let cols = parseInt(document.getElementById('colsInput').value) || 17;

    engine = new GameEngine(rows, cols);

    let boardData;
    if (mode === 'perfect') {
        boardData = SeedGenerator.perfectGen(rows, cols);
    } else {
        boardData = SeedGenerator.randomGen(rows, cols);
    }
    engine.initBoard(boardData);

    canvas.width = cols * APPLE_SIZE + PADDING * 2;
    canvas.height = rows * APPLE_SIZE + PADDING * 2;

    if (mode === 'infinite') {
        document.getElementById('timer').innerText = 'Infinite';
    } else {
        timeLeft = 120;
        startTimer();
    }

    setupEvents();
    requestAnimationFrame(render);
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

    // 1. 사과 렌더링
    for (let r = 0; r < engine.rows; r++) {
        for (let c = 0; c < engine.cols; c++) {
            const val = board[r][c];
            if (val === 0) continue;

            const x = c * APPLE_SIZE + PADDING;
            const y = r * APPLE_SIZE + PADDING;

            // 선택된 사과 하이라이트
            const isSelected = isDragging && 
                               r >= currentSelection.r1 && r <= currentSelection.r2 && 
                               c >= currentSelection.c1 && c <= currentSelection.c2;

            if (isSelected) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
                ctx.fillStyle = '#ff6666'; // 선택 시 약간 더 밝은 빨강
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ff4d4d';
            }

            ctx.beginPath();
            ctx.arc(x + APPLE_SIZE/2, y + APPLE_SIZE/2, APPLE_SIZE/2 - 3, 0, Math.PI * 2);
            ctx.fill();

            // 꼭지 그리기
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

    // 2. 드래그 영역 및 합계 표시
    if (isDragging) {
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // 점선 효과
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(0, 120, 255, 0.15)';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);

        // 현재 합계 표시 (마우스 근처)
        if (currentSelection.sum > 0) {
            ctx.fillStyle = currentSelection.sum === 10 ? '#00cc00' : '#0078ff';
            ctx.font = 'bold 24px Arial';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'white';
            ctx.fillText(currentSelection.sum, endX + 15, endY - 15);
            ctx.shadowBlur = 0;
        }
    }

    document.getElementById('score').innerText = `Score: ${engine.getScore()}`;
    requestAnimationFrame(render);
}

function quitGame() {
    clearInterval(timerInterval);
    location.reload();
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

    const updateSelection = () => {
        const left = Math.min(startX, endX) - PADDING;
        const top = Math.min(startY, endY) - PADDING;
        const right = Math.max(startX, endX) - PADDING;
        const bottom = Math.max(startY, endY) - PADDING;

        // 중심점 기반 선택 로직
        // 셀의 중심이 드래그 사각형 안에 있는지 확인
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

        if (currentSelection.sum === 10) {
            engine.evaluateSelection(currentSelection.r1, currentSelection.c1, currentSelection.r2, currentSelection.c2);
            
            if (engine.getRemainingApples() === 0) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert(`축하합니다! 모든 사과를 제거했습니다. 최종 점수: ${engine.getScore()}`);
                    location.reload();
                }, 100);
            }
        }
        currentSelection = { r1: -1, c1: -1, r2: -1, c2: -1, sum: 0 };
    };

    canvas.addEventListener('mousedown', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('mouseup', endAction);

    canvas.addEventListener('touchstart', e => { e.preventDefault(); startAction(e); }, { passive: false });
    window.addEventListener('touchmove', e => { moveAction(e); }, { passive: false });
    window.addEventListener('touchend', endAction);
}
