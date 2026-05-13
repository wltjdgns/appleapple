/**
 * SeedGenerator - 사과게임의 보드 생성을 담당하는 클래스
 */
class SeedGenerator {
    /**
     * Rejection Sampling 방식을 이용한 보드 생성 (표준 모드)
     */
    static randomGen(rows, cols) {
        while (true) {
            let sum = 0;
            const board = [];
            for (let r = 0; r < rows; r++) {
                const row = [];
                for (let c = 0; c < cols; c++) {
                    const val = Math.floor(Math.random() * 9) + 1;
                    row.push(val);
                    sum += val;
                }
                board.push(row);
            }

            if (sum % 10 === 0) {
                return board;
            }
        }
    }

    /**
     * 가변 크기에 대응하는 퍼펙트 시드 생성 (n-Sum Partitioning)
     */
    static perfectGen(rows, cols) {
        const board = Array.from({ length: rows }, () => new Array(cols).fill(0));
        const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!visited[r][c]) {
                    this.fillRandomPartition(board, visited, r, c, rows, cols);
                }
            }
        }

        return board;
    }

    static fillRandomPartition(board, visited, r, c, maxR, maxC) {
        // 랜덤한 직사각형 크기 결정 (최대 3x3)
        let w = Math.floor(Math.random() * 3) + 1;
        let h = Math.floor(Math.random() * 3) + 1;
        
        // 실제 가능한 영역 크기 계산
        let actualW = 0;
        let actualH = 0;

        for (let i = 0; i < h && r + i < maxR; i++) {
            let canExtendRow = true;
            for (let j = 0; j < w && c + j < maxC; j++) {
                if (visited[r + i][c + j]) {
                    if (j === 0) {
                        canExtendRow = false;
                        break;
                    }
                    w = j;
                    break;
                }
                if (i === 0) actualW = j + 1;
            }
            if (!canExtendRow) break;
            actualH = i + 1;
        }

        const area = actualW * actualH;
        const numbers = this.getNumbersSummingTo10(area);

        let idx = 0;
        for (let i = 0; i < actualH; i++) {
            for (let j = 0; j < actualW; j++) {
                board[r + i][c + j] = numbers[idx++];
                visited[r + i][c + j] = true;
            }
        }
    }

    /**
     * count개의 숫자의 합이 정확히 10(혹은 배수)이 되도록 생성
     */
    static getNumbersSummingTo10(count) {
        // 1x1인 경우 10을 만들 수 없으므로(숫자는 1~9), 인접한 다른 칸과 합쳐지길 기대하며 5를 기본으로 함
        if (count === 1) return [5];
        
        let nums = new Array(count).fill(1);
        let currentSum = count;

        while (currentSum < 10) {
            let randIdx = Math.floor(Math.random() * count);
            if (nums[randIdx] < 9) {
                nums[randIdx]++;
                currentSum++;
            }
        }
        
        return nums.sort(() => Math.random() - 0.5);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeedGenerator;
} else {
    window.SeedGenerator = SeedGenerator;
}
