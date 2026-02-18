/* =========================================
   1. הגדרות Firebase
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    setDoc, 
    doc, 
    deleteDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzZVWudrgjb-Qi-ln5Qm0u4L0PUlwbjUc",
    authDomain: "physicsmaster-app.firebaseapp.com",
    projectId: "physicsmaster-app",
    storageBucket: "physicsmaster-app.firebasestorage.app",
    messagingSenderId: "389250837755",
    appId: "1:389250837755:web:c088a4021e28ce0132945e"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

/* =========================================
   2. משתנים גלובליים ומצב (State)
   ========================================= */
let pageMode = 'explanations'; 
let authMode = 'login';
let playerStats = { level:1, currentXP:0, xpNeeded:100 };

/* =========================================
   3. מערכת XP ורמות לכל משתמש
   ========================================= */
async function loadStats(user) {
    if(!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if(userSnapshot.exists() && userSnapshot.data().xpStats) {
        playerStats = userSnapshot.data().xpStats;
    } else {
        playerStats = { level:1, currentXP:0, xpNeeded:100 };
        await updateDoc(userDocRef, { xpStats: playerStats }).catch(async ()=>{
            await setDoc(userDocRef, { xpStats: playerStats }, { merge:true });
        });
    }
    updateXPUI();
}

async function saveStats(user) {
    if(!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { xpStats: playerStats });
}

function addXP(amount, user=null) {
    playerStats.currentXP += amount;
    let leveledUp = false;
    while(playerStats.currentXP >= playerStats.xpNeeded) {
        playerStats.currentXP -= playerStats.xpNeeded;
        playerStats.level++;
        playerStats.xpNeeded = Math.floor(playerStats.xpNeeded * 1.2);
        leveledUp = true;
    }
    if(user) saveStats(user);
    updateXPUI();
    if(leveledUp) triggerLevelUpEffect();
}

function updateXPUI() {
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');

    if(levelEl) levelEl.innerText = playerStats.level;
    if(xpEl) xpEl.innerText = Math.floor(playerStats.currentXP);
    if(neededEl) neededEl.innerText = playerStats.xpNeeded;
    if(barEl) barEl.style.width = ((playerStats.currentXP/playerStats.xpNeeded)*100) + '%';
}

function triggerLevelUpEffect() {
    const widget = document.querySelector('.level-circle');
    if(widget) {
        widget.classList.add('level-up-anim');
        const msg = document.createElement('div');
        msg.innerText = "Level Up! 🎉";
        msg.style.cssText = "position:fixed; bottom:100px; right:30px; background:#f59e0b; color:white; padding:10px 20px; border-radius:20px; font-weight:bold; z-index:3000; animation:slideIn 0.5s ease-out;";
        document.body.appendChild(msg);
        setTimeout(() => {
            widget.classList.remove('level-up-anim');
            msg.remove();
        }, 2000);
    }
}

/* =========================================
   4. Auth - Firebase
   ========================================= */
window.switchTab = (mode) => {
    authMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
    document.getElementById('name-field').style.display = mode === 'signup' ? 'block' : 'none';
    document.getElementById('auth-title').innerText = mode === 'signup' ? 'יצירת חשבון' : 'ברוכים הבאים';
    document.getElementById('auth-error').innerText = '';
};

window.handleLogout = () => {
    signOut(auth);
};

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    if(authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            const name = document.getElementById('auth-name') ? document.getElementById('auth-name').value : "";
            const errorEl = document.getElementById('auth-error');

            try {
                let userCredential;
                if (authMode === 'signup') {
                    userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                    await updateProfile(userCredential.user, { displayName: name });
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        role: 'student',
                        joinDate: new Date().toLocaleDateString('he-IL'),
                        uid: userCredential.user.uid,
                        xpStats: { level:1, currentXP:0, xpNeeded:100 }
                    });
                    alert("נרשמת בהצלחה! ברוכים הבאים.");
                } else {
                    userCredential = await signInWithEmailAndPassword(auth, email, pass);
                }
                document.getElementById('auth-modal').style.display = 'none';
            } catch (error) {
                console.error("Auth Error:", error);
                errorEl.innerText = "שגיאה: אימייל, סיסמה או בעיה בשרת.";
            }
        });
    }
});

/* =========================================
   5. Check Auth State & Load XP
   ========================================= */
onAuthStateChanged(auth, async (user) => {
    const authModal = document.getElementById('auth-modal');
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');

    if(user){
        // אפס את ה-XP הגלובלי לפני טעינת המשתמש החדש
        playerStats = { level:1, currentXP:0, xpNeeded:100 };

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if(!userSnapshot.exists()){
            await signOut(auth);
            location.reload();
            return;
        }

        if(authModal) authModal.style.display = 'none';
        if(userProfile) userProfile.style.display = 'flex';
        if(loginBtn) loginBtn.style.display = 'none';
        if(xpWidget) xpWidget.style.display = 'flex';
        document.getElementById('user-name-display').innerText = user.displayName || user.email;

        // טען XP ייחודי למשתמש המחובר
        await loadStats(user);
    } else {
        if(authModal) authModal.style.display = 'flex';
        if(userProfile) userProfile.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'block';
        if(xpWidget) xpWidget.style.display = 'none';

        // אפס את ה-XP כשאין משתמש מחובר
        playerStats = { level:1, currentXP:0, xpNeeded:100 };
        updateXPUI();
    }
});


/* =========================================
   6. בדיקת תשובות והוספת XP
   ========================================= */
window.checkAnswers = function(exId){
    const questions = window.questionsBank[exId];
    const currentUser = auth.currentUser;
    let correctCount = 0;
    let summaryHTML = '';

    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = document.getElementsByName(`q${i}`)[0].closest('.question-block');
        const isCorrect = selected && selected.value === q.a;

        if(isCorrect){
            correctCount++;
            addXP(50, currentUser);
            questionDiv.style.border = "2px solid #22c55e";
            questionDiv.style.background = "#f0fdf4";
        } else {
            questionDiv.style.border = "2px solid #ef4444";
            questionDiv.style.background = "#fef2f2";
        }

        summaryHTML += `<div style="text-align:right; margin-bottom:10px; color:${isCorrect?'#15803d':'#b91c1c'}">
            <strong>שאלה ${i+1}:</strong> ${isCorrect ? '✅ צדקת! (+50 XP)' : `❌ טעית (התשובה הנכונה: ${q.a})`}
        </div>`;
    });

    const finalScore = Math.round((correctCount/questions.length)*100);
    if(finalScore===100) addXP(100, currentUser);

    const resultDiv = document.getElementById('exercise-results') || document.createElement('div');
    resultDiv.id = 'exercise-results';
    resultDiv.className = 'summary-card';
    resultDiv.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 15px;">סיכום התוצאות 🏁</h3>
        <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 20px;">ציון סופי: ${finalScore}</div>
        <div style="margin-bottom: 25px;">${summaryHTML}</div>
        <button class="btn-main" onclick="router('exercise_list', 'mechanics')">חזור לרשימת התרגילים</button>
    `;

    if(!document.getElementById('exercise-results')){
        document.getElementById('exercise-container').after(resultDiv);
    }
    resultDiv.scrollIntoView({behavior:'smooth'});
};

