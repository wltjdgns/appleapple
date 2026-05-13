/**
 * GameEngine - 사과게임의 핵심 로직을 담당하는 클래스
 * 플랫폼 독립적이며, NumPy 스타일의 행렬 연산을 모방한 SAT(Summed-Area Table)를 사용하여 성능을 최적화함.
 */
class GameEngine {
    constructor(rows = 17, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.board = [];
        this.score = 0;
        this.sumTable = []; // SAT (Summed-Area Table)
    }

    /**
     * 보드를 초기화하고 난수를 채움
     * @param {number[][]} customBoard 외부에서 주입할 보드 데이터 (선택사항)
     */
    initBoard(customBoard = null) {
        if (customBoard) {
            this.board = customBoard.map(row => [...row]);
            this.rows = customBoard.length;
            this.cols = customBoard[0].length;
        } else {
            this.board = Array.from({ length: this.rows }, () =>
                Array.from({ length: this.cols }, () => Math.floor(Math.random() * 9) + 1)
            );
        }
        this.updateSumTable();
    }

    /**
     * Summed-Area Table (Integral Image)을 업데이트함.
     * O(rows * cols) 시간 복잡도.
     */
    updateSumTable() {
        const rows = this.rows;
        const cols = this.cols;
        this.sumTable = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                this.sumTable[i][j] = this.board[i - 1][j - 1] +
                                     this.sumTable[i - 1][j] +
                                     this.sumTable[i][j - 1] -
                                     this.sumTable[i - 1][j - 1];
            }
        }
    }

    /**
     * 특정 영역 (r1, c1)부터 (r2, c2)까지의 합계를 O(1)로 반환함.
     * @param {number} r1 시작 행
     * @param {number} c1 시작 열
     * @param {number} r2 끝 행
     * @param {number} c2 끝 열
     * @returns {number} 영역 합계
     */
    getAreaSum(r1, c1, r2, c2) {
        // 인덱스 정규화 (r1, c1이 항상 작도록)
        const startRow = Math.min(r1, r2);
        const endRow = Math.max(r1, r2);
        const startCol = Math.min(c1, c2);
        const endCol = Math.max(c1, c2);

        return this.sumTable[endRow + 1][endCol + 1] -
               this.sumTable[startRow][endCol + 1] -
               this.sumTable[endRow + 1][startCol] +
               this.sumTable[startRow][startCol];
    }

    /**
     * 선택된 영역의 사과들을 평가하고 합이 조건에 맞으면 제거함.
     * @param {number} r1, c1, r2, c2 영역 좌표
     * @param {string} clearType 'original' (합계 10) 또는 'multiples' (10의 배수)
     * @returns {boolean} 제거 성공 여부
     */
    evaluateSelection(r1, c1, r2, c2, clearType = 'original') {
        const sum = this.getAreaSum(r1, c1, r2, c2);
        
        const isMatch = clearType === 'multiples' 
            ? (sum % 10 === 0 && sum > 0 && sum <= 50) 
            : (sum === 10);

        if (isMatch) {
            const startRow = Math.min(r1, r2);
            const endRow = Math.max(r1, r2);
            const startCol = Math.min(c1, c2);
            const endCol = Math.max(c1, c2);

            let removedCount = 0;
            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    if (this.board[r][c] !== 0) {
                        this.board[r][c] = 0;
                        removedCount++;
                    }
                }
            }
            this.score += removedCount;
            this.updateSumTable(); // 보드 변경 후 테이블 갱신
            return true;
        }
        return false;
    }

    /**
     * 현재 보드에 남은 사과의 총 개수를 반환함.
     */
    getRemainingApples() {
        let count = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] !== 0) count++;
            }
        }
        return count;
    }

    /**
     * 현재 보드 상태 반환
     */
    getBoard() {
        return this.board;
    }

    /**
     * 현재 점수 반환
     */
    getScore() {
        return this.score;
    }
}

// 모듈 익스포트 (웹 환경과 Node 환경 모두 지원)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
} else {
    window.GameEngine = GameEngine;
}
