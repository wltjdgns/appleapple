# 사과게임(Apple Game) 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 플랫폼 독립적인 게임 엔진을 시작으로 웹 기반 사과게임을 완성하고 GitHub Pages에 호스팅 가능한 상태로 만듦.

**Architecture:** 핵심 로직(Core)과 UI 레이어(Web)를 엄격히 분리. 행렬 연산 최적화를 위해 SAT(Summed-Area Table) 사용.

**Tech Stack:** Pure JavaScript, HTML5 Canvas, CSS Grid/Flexbox.

---

### Task 1: Core Engine 구현 (`/core/engine.js`)

**Files:**
- Create: `E:\apple\core\engine.js`

- [ ] **Step 1: GameEngine 클래스 기본 구조 작성**
  - 생성자에서 rows, cols 초기화 및 보드 생성.
  - NumPy 스타일 행렬 연산을 위한 `sumTable` 속성 정의.

- [ ] **Step 2: SAT(Summed-Area Table) 생성 메서드 구현**
  - `updateSumTable()`: 2D 배열을 순회하며 누적 합 테이블 갱신.

- [ ] **Step 3: 영역 합계 계산 메서드 구현**
  - `getSum(x1, y1, x2, y2)`: SAT를 이용하여 $O(1)$로 영역 합 반환.

- [ ] **Step 4: 선택 영역 평가 메서드 구현**
  - `evaluateSelection(x1, y1, x2, y2)`: 합이 10이면 해당 영역을 0으로 만들고 점수 반환.

---

### Task 2: 시드 생성기 구현 (`/core/generator.js`)

**Files:**
- Create: `E:\apple\core\generator.js`

- [ ] **Step 1: SeedGenerator 클래스 작성**
  - 기본 랜덤 생성(`randomGen`) 구현.

- [ ] **Step 2: n-Sum 분할 알고리즘 구현**
  - `perfectGen()`: 보드를 직사각형으로 분할하고 합이 10이 되도록 숫자 배치.

---

### Task 3: 웹 프론트엔드 초기화 (`/web/index.html`, `/web/app.js`)

**Files:**
- Create: `E:\apple\web\index.html`
- Create: `E:\apple\web\app.js`

- [ ] **Step 1: HTML5 Canvas 레이아웃 작성**
  - 모드 선택 화면 및 게임 캔버스 영역 정의.

- [ ] **Step 2: Canvas 렌더링 엔진 작성**
  - `app.js`에서 사과와 숫자를 그리는 로직 구현.

- [ ] **Step 3: 드래그 인터랙션 구현**
  - 마우스/터치 이벤트를 좌표로 변환하여 `GameEngine`과 연동.

---

### Task 4: 게임 모드 및 상태 관리 완성

- [ ] **Step 1: 타이머 및 점수 UI 연동**
- [ ] **Step 2: 모드별 설정(일반, 무한, 거대) 반영**
- [ ] **Step 3: 최종 폴리싱 및 테스트**
