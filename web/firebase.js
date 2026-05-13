/**
 * firebase.js - Firebase 인증 및 Firestore 연동 (v8 Compat 버전)
 * 로컬 file:// 프로토콜 호환성을 위해 전역 firebase 객체를 사용합니다.
 */

// TODO: Firebase Console에서 발급받은 설정값으로 교체하세요.
const firebaseConfig = {
  apiKey: "AIzaSyCxi4KjOT23jBU1365MMFT5HdeI2OOKgZs",
  authDomain: "appletjdgns.firebaseapp.com",
  projectId: "appletjdgns",
  storageBucket: "appletjdgns.firebasestorage.app",
  messagingSenderId: "1091859124353",
  appId: "1:1091859124353:web:db8b3cd581a6c778e53d80"
};

// 초기화
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;
let isGuest = false;
let guestRecords = {}; // 게스트용 임시 메모리 기록

// 인증 상태 감시 (글로벌 상태만 유지)
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        isGuest = false;
        ensureUserDocument(user);
    } else if (!isGuest) {
        currentUser = null;
    }
});

function updateUIForLogin(name) {
    // React에서 처리하므로 삭제
}

function updateUIForLogout() {
    // React에서 처리하므로 삭제
}

// 게스트 로그인 함수
window.loginAsGuest = () => {
    let nickname = document.getElementById('guest-name').value.trim();
    if (!nickname) {
        nickname = "Guest_" + Math.floor(Math.random() * 9000 + 1000);
    }
    
    isGuest = true;
    currentUser = { uid: 'guest', displayName: nickname };
    guestRecords = {}; // 세션 초기화
    
    updateUIForLogin(nickname);
};

async function ensureUserDocument(user) {
    const userRef = db.collection('users').doc(user.uid);
    try {
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            await userRef.set({
                displayName: user.displayName,
                email: user.email || '',
                records: {}
            });
        }
    } catch (e) {
        console.error("Error ensuring user document:", e);
    }
}

// 로그인 함수
window.login = async () => {
    try {
        isGuest = false;
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("로그인에 실패했습니다. (로컬 환경에서는 보안 정책으로 인해 작동하지 않을 수 있습니다.)");
    }
};

// 로그아웃 함수
window.logout = async () => {
    try {
        if (isGuest) {
            isGuest = false;
            currentUser = null;
            updateUIForLogout();
        } else {
            await auth.signOut();
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

/**
 * 게임 결과 저장
 */
window.saveGameRecord = async (config, score, playTime) => {
    if (!currentUser) return;

    const modeKey = `${config.timeMode}_${config.cols}x${config.rows}_${config.seedType}_${config.clearType}`;

    if (isGuest) {
        const prevRecord = guestRecords[modeKey] || { playCount: 0, highScore: 0, totalScore: 0, totalPlayTime: 0 };
        guestRecords[modeKey] = {
            playCount: prevRecord.playCount + 1,
            highScore: Math.max(prevRecord.highScore, score),
            totalScore: prevRecord.totalScore + score,
            totalPlayTime: prevRecord.totalPlayTime + playTime
        };
        console.log("Guest record saved in memory");
        return;
    }

    const userRef = db.collection('users').doc(currentUser.uid);
    try {
        const userSnap = await userRef.get();
        if (!userSnap.exists) return;

        const data = userSnap.data();
        const records = data.records || {};
        const prevRecord = records[modeKey] || { playCount: 0, highScore: 0, totalScore: 0, totalPlayTime: 0 };

        const updatedRecord = {
            playCount: prevRecord.playCount + 1,
            highScore: Math.max(prevRecord.highScore, score),
            totalScore: prevRecord.totalScore + score,
            totalPlayTime: prevRecord.totalPlayTime + playTime
        };

        const updateData = {};
        updateData[`records.${modeKey}`] = updatedRecord;
        await userRef.update(updateData);
        console.log("Record saved successfully to Firestore");
    } catch (error) {
        console.error("Failed to save record:", error);
    }
};

// 기록 불러오기 및 UI 렌더링
window.fetchAndShowRecords = async () => {
    if (!currentUser) return;
    
    if (window.showScene) window.showScene('scene-records');
    
    if (isGuest) {
        renderRecords(guestRecords);
        return;
    }

    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">불러오는 중...</td></tr>';
    try {
        const userRef = db.collection('users').doc(currentUser.uid);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
            renderRecords(userSnap.data().records || {});
        } else {
            recordsList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">기록이 없습니다.</td></tr>';
        }
    } catch (error) {
        console.error("Failed to fetch records:", error);
        recordsList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: red;">데이터를 불러오지 못했습니다.</td></tr>';
    }
};

function renderRecords(records) {
    const recordsList = document.getElementById('records-list');
    if (Object.keys(records).length === 0) {
        recordsList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">기록이 없습니다.</td></tr>';
        return;
    }

    recordsList.innerHTML = '';
    Object.entries(records).forEach(([key, record]) => {
        const parts = key.split('_');
        const time = parts[0];
        const size = parts[1];
        const type = parts[3];
        
        const avgScore = (record.totalScore / record.playCount).toFixed(1);
        const totalTimeMin = Math.floor(record.totalPlayTime / 60);
        const totalTimeSec = record.totalPlayTime % 60;

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f0f0f0';
        row.innerHTML = `
            <td style="padding: 12px;">
                <div style="font-weight: 600;">${size}</div>
                <div style="font-size: 0.75rem; color: #888;">${time === 'infinite' ? '무한' : '2분'} | ${type === 'original' ? '오리지널' : '10의배수'}</div>
            </td>
            <td style="padding: 12px;">${record.playCount}</td>
            <td style="padding: 12px; color: #ff4d4d; font-weight: 700;">${record.highScore}</td>
            <td style="padding: 12px;">${avgScore}</td>
            <td style="padding: 12px;">${totalTimeMin}분 ${totalTimeSec}초</td>
        `;
        recordsList.appendChild(row);
    });
}

// 글로벌 랭킹 조회
window.fetchAndShowLeaderboard = async () => {
    if (window.showScene) window.showScene('scene-leaderboard');
    
    const timeFilter = document.getElementById('lb-time') ? document.getElementById('lb-time').value : '120';
    const sizeFilter = document.getElementById('lb-size') ? document.getElementById('lb-size').value : '17x10';
    const sortFilter = document.getElementById('lb-sort') ? document.getElementById('lb-sort').value : 'highScore';
    
    // 조건: 시간_크기_랜덤_오리지널 (기본 모드 가정)
    const targetModeKey = `${timeFilter}_${sizeFilter}_random_original`;
    
    const lbList = document.getElementById('leaderboard-list');
    lbList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">랭킹 데이터를 불러오는 중...</td></tr>';
    
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
                    playCount: record.playCount || 0,
                    totalPlayTime: record.totalPlayTime || 0
                });
            }
        });
        
        if (rankingData.length === 0) {
            lbList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">해당 모드의 랭킹 기록이 없습니다.</td></tr>';
            return;
        }
        
        // 정렬
        rankingData.sort((a, b) => b[sortFilter] - a[sortFilter]);
        
        lbList.innerHTML = '';
        rankingData.forEach((data, index) => {
            let rankIcon = `${index + 1}위`;
            if (index === 0) rankIcon = '🥇 1위';
            if (index === 1) rankIcon = '🥈 2위';
            if (index === 2) rankIcon = '🥉 3위';
            
            const totalTimeMin = Math.floor(data.totalPlayTime / 60);
            const totalTimeSec = data.totalPlayTime % 60;
            
            const isHighlight = sortFilter === 'highScore';
            const scoreColor = isHighlight ? '#ff4d4d' : '#333';
            const scoreWeight = isHighlight ? '700' : 'normal';

            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #f0f0f0';
            row.innerHTML = `
                <td style="padding: 12px; font-weight: bold;">${rankIcon}</td>
                <td style="padding: 12px;">${data.name}</td>
                <td style="padding: 12px; color: ${scoreColor}; font-weight: ${scoreWeight};">${data.highScore}</td>
                <td style="padding: 12px;">${data.playCount}</td>
                <td style="padding: 12px;">${totalTimeMin}분 ${totalTimeSec}초</td>
            `;
            lbList.appendChild(row);
        });
        
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        lbList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: red;">데이터를 불러오지 못했습니다.</td></tr>';
    }
};
