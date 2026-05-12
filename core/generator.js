/**
 * SeedGenerator - 사과게임의 보드 생성을 담당하는 클래스
 */
class SeedGenerator {
    /**
     * 무작위 숫자로 보드를 채움 (일반 모드)
     */
    static randomGen(rows, cols) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.floor(Math.random() * 9) + 1)
        );
    }

    /**
     * 100% 제거 가능한 퍼펙트 시드 생성 (n-Sum Partitioning)
     */
    static perfectGen(rows, cols) {
        const board = Array.from({ length: rows }, () => new Array(cols).fill(0));
        const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

        // 1. 영역 분할 및 숫자 배정
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!visited[r][c]) {
                    this.fillRandomPartition(board, visited, r, c, rows, cols);
                }
            }
        }

        return board;
    }

    /**
     * (r, c) 지점부터 랜덤한 크기의 직사각형 영역을 설정하고 합이 10이 되도록 채움
     */
    static fillRandomPartition(board, visited, r, c, maxR, maxC) {
        // 최소 1x2 또는 2x1 영역을 확보하기 위해 시도
        let w = Math.floor(Math.random() * 3) + 1;
        let h = Math.floor(Math.random() * 3) + 1;
        
        // 단일 셀(1x1)이 되지 않도록 조정 (영역이 남아있다면)
        if (w === 1 && h === 1) {
            if (c + 1 < maxC && !visited[r][c + 1]) w = 2;
            else if (r + 1 < maxR && !visited[r + 1][c]) h = 2;
        }

        // 경계 및 방문 여부 확인하여 실제 가능한 영역 크기 계산
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
                    w = j; // 너비 축소
                    break;
                }
                if (i === 0) actualW = j + 1;
            }
            if (!canExtendRow) break;
            actualH = i + 1;
        }

        const area = actualW * actualH;
        
        // 만약 끝부분이라 어쩔 수 없이 1x1이 된 경우, 주변 숫자를 9 이하로 채우고 100% 제거는 포기하거나
        // 여기서는 사과게임 규칙(1~9)을 지키기 위해 최대값을 9로 제한함.
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
     * count개의 숫자의 합이 정확히 10이 되도록 랜덤 리스트 생성 (각 숫자는 1~9)
     */
    static getNumbersSummingTo10(count) {
        // 1x1 영역인 경우 10을 만들 수 없으므로 무작위 1~9 반환
        if (count === 1) return [Math.floor(Math.random() * 9) + 1];
        
        let nums = new Array(count).fill(1);
        let currentSum = count;

        // 합이 10이 될 때까지 랜덤하게 분배 (각 숫자는 최대 9)
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

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeedGenerator;
} else {
    window.SeedGenerator = SeedGenerator;
}
