/**
 * firebase.js - Firebase 인증 및 Firestore 연동 모듈
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

// TODO: Firebase Console에서 발급받은 설정값으로 교체하세요.
const firebaseConfig = {
  apiKey: "AIzaSyCxi4KjOT23jBU1365MMFT5HdeI2OOKgZs",
  authDomain: "appletjdgns.firebaseapp.com",
  projectId: "appletjdgns",
  storageBucket: "appletjdgns.firebasestorage.app",
  messagingSenderId: "1091859124353",
  appId: "1:1091859124353:web:db8b3cd581a6c778e53d80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let isGuest = false;
let guestRecords = {}; // 게스트용 임시 메모리 기록

// 인증 상태 감시
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        isGuest = false;
        updateUIForLogin(user.displayName);
        ensureUserDocument(user);
    } else if (!isGuest) {
        currentUser = null;
        updateUIForLogout();
    }
});

function updateUIForLogin(name) {
    document.getElementById('user-name').innerText = name;
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('login-menu').classList.add('hidden');
    document.getElementById('logged-in-menu').classList.remove('hidden');
}

function updateUIForLogout() {
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('login-menu').classList.remove('hidden');
    document.getElementById('logged-in-menu').classList.add('hidden');
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
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            records: {}
        });
    }
}

// 로그인 함수
window.login = async () => {
    try {
        isGuest = false;
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("로그인에 실패했습니다.");
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
            await signOut(auth);
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

    const userRef = doc(db, 'users', currentUser.uid);
    try {
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();
        const records = data.records || {};
        const prevRecord = records[modeKey] || { playCount: 0, highScore: 0, totalScore: 0, totalPlayTime: 0 };

        const updatedRecord = {
            playCount: prevRecord.playCount + 1,
            highScore: Math.max(prevRecord.highScore, score),
            totalScore: prevRecord.totalScore + score,
            totalPlayTime: prevRecord.totalPlayTime + playTime
        };

        await updateDoc(userRef, {
            [`records.${modeKey}`]: updatedRecord
        });
        console.log("Record saved successfully");
    } catch (error) {
        console.error("Failed to save record:", error);
    }
};

// 기록 불러오기 및 UI 렌더링
window.fetchAndShowRecords = async () => {
    if (!currentUser) return;
    
    showScene('scene-records');
    
    if (isGuest) {
        renderRecords(guestRecords);
        return;
    }

    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center;">불러오는 중...</td></tr>';
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        renderRecords(userSnap.data().records || {});
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
        const [time, size, seed, type] = key.split('_');
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
