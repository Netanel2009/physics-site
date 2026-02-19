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
    apiKey: "YOUR_KEY",
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
   2. מצב גלובלי
   ========================================= */
let pageMode = 'explanations';
let authMode = 'login';

let playerStats = {
    level: 1,
    currentXP: 0,
    xpNeeded: 100
};

/* =========================================
   3. נתונים (Data)
   ========================================= */
window.contentData = {
    categories: [
        { id: 'explanations', title: 'סרטונים 📚', image: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
        { id: 'exercises', title: 'תרגול שאלות 📝', image: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" },
        { id: 'simulations', title: 'סימולציות 🧪', image: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }
    ],
    subjects: [
        { id: 'mechanics', title: 'מכניקה', desc: 'קינמטיקה, דינמיקה, אנרגיה ותנע', image: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { id: 'electricity', title: 'חשמל ומגנטיות', desc: 'אלקטרוסטטיקה ומעגלים', image: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { id: 'radiation', title: 'קרינה וחומר', desc: 'אופטיקה ופיזיקה מודרנית', image: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    ],
    mechanics_content: [
        { type: 'folder', id: 'kinematics_folder', title: 'קינמטיקה', image: 'linear-gradient(to right, #3b82f6, #60a5fa)', desc: 'תנועה בקו ישר, נפילה חופשית וזריקות' },
        { type: 'folder', id: 'energy_momentum_folder', title: 'תנע ואנרגיה', image: 'linear-gradient(to right, #10b981, #34d399)', desc: 'שימור תנע, עבודה ואנרגיה מכנית' },
        { type: 'video', title: 'תנועה הרמונית', url: 'https://youtu.be/FFj3V4CiElI', desc: 'קפיצים ומטוטלות' }
    ],
    mechanics_exercises: [
        { id: 'ex_kinematics', title: 'תרגול קינמטיקה', desc: 'שאלות על תנועה שוות תאוצה', image: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' },
        { id: 'ex_momentum', title: 'תרגול תנע', desc: 'התנגשויות ומתקף', image: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }
    ],
    kinematics_folder: [{ type: 'video', title: 'קינמטיקה (בסיס)', url: 'https://youtu.be/q8K73P4hft8', desc: 'תנועה בקו ישר ונפילה חופשית' }],
    energy_momentum_folder: [{ type: 'video', title: 'שימור תנע', url: 'https://youtu.be/6k8Hd3wPoU0', desc: 'התנגשויות ומתקף' }]
};

window.questionsBank = {
    'ex_kinematics': [
        { q: "גוף מתחיל לנוע ממנוחה בתאוצה קבועה של 2m/s². מה יהיה המרחק שיעבור הגוף כעבור 5 שניות?", a: "25 מ'", options: ["10 מ'", "25 מ'", "50 מ'", "100 מ'"] },
        { q: "כדור נזרק אנכית מעלה במהירות של 30m/s (בהנחה ש-g=10). תוך כמה זמן יגיע הכדור לשיא הגובה?", a: "3 שניות", options: ["1 שניה", "3 שניות", "5 שניות", "30 שניות"] }
    ],
    'ex_momentum': [
        { q: "מהי ההגדרה הפיזיקלית של תנע?", a: "מכפלת המסה במהירות", options: ["מכפלת המסה בתאוצה", "מכפלת המסה במהירות", "האנרגיה הקינטית של הגוף", "הכוח הפועל על הגוף"] }
    ]
};

const testimonialsData = [
    { name: "יהונתן אדיב", text: "הסרטונים המפורטים לא הותירו לי שום בעיה בפתרון התרגילים. מומלץ בחום!", img: "https://i.pravatar.cc/150?u=1" },
    { name: "סתיו שיריזלי", text: "הסימולציות עוזרות להבין את החומר באמת, ולא רק לשנן נוסחאות.", img: "https://i.pravatar.cc/150?u=2" },
    { name: "ניתי ווליך", text: "האתר הכי טוב שמצאתי לבגרות. הכל מסודר, נקי וברור מאוד.", img: "https://i.pravatar.cc/150?u=3" }
];

/* =========================================
   3. XP SYSTEM - עכשיו מחובר ל-Firestore
   ========================================= */

async function loadStatsFromDB(uid) {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists() && snap.data().stats) {
        playerStats = snap.data().stats;
    } else {
        await updateDoc(userRef, {
            stats: playerStats
        });
    }

    updateXPUI();
}

async function saveStatsToDB(uid) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        stats: playerStats
    });
}

function addXP(amount) {
    playerStats.currentXP += amount;
    checkLevelUp();
    updateXPUI();

    const user = auth.currentUser;
    if (user) saveStatsToDB(user.uid);
}

function checkLevelUp() {
    while (playerStats.currentXP >= playerStats.xpNeeded) {
        playerStats.currentXP -= playerStats.xpNeeded;
        playerStats.level++;
        playerStats.xpNeeded = Math.floor(playerStats.xpNeeded * 1.2);
        triggerLevelUpEffect();
    }
}

function updateXPUI() {
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');

    if (!levelEl) return;

    levelEl.innerText = playerStats.level;
    xpEl.innerText = playerStats.currentXP;
    neededEl.innerText = playerStats.xpNeeded;

    const percentage = (playerStats.currentXP / playerStats.xpNeeded) * 100;
    barEl.style.width = percentage + "%";
}

function triggerLevelUpEffect() {
    const widget = document.querySelector('.level-circle');
    if (!widget) return;

    // הוספת אנימציה של פיצוץ צבעוני
    widget.classList.add('level-up-anim');

    // יצירת טקסט "Level Up!"
    const levelUpText = document.createElement('div');
    levelUpText.innerText = 'Level Up!';
    levelUpText.className = 'level-up-text';
    widget.appendChild(levelUpText);

    // הסרה אחרי האנימציה
    setTimeout(() => {
        widget.classList.remove('level-up-anim');
        levelUpText.remove();
    }, 1200);
}


/* =========================================
   5. פונקציות ניתוב (Router)
   ========================================= */
window.router = function(view, data = null) {
    window.scrollTo(0, 0);
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = '';

    switch(view) {
        case 'home': renderHomePage(); break;
        case 'subject_select': 
            pageMode = data; 
            renderSubjects(); 
            break;
        case 'content_list': renderContentList(data); break; 
        case 'exercise_list': renderExerciseList(data); break;
        case 'folder_view': renderFolderContent(data); break;
        case 'active_exercise': renderActiveExercise(data); break;
        case 'admin': loadAdminPage(); break;
        default: renderHomePage();
    }
};

/* =========================================
   6. פונקציות הרינדור (Render Functions)
   ========================================= */

function renderHomePage() {
    const app = document.getElementById('app-container');
    app.innerHTML = `
        <div class="hero">
            <h1>PhysicsMaster 🚀</h1>
            <p>המקום שלך להצטיין בפיזיקה לבגרות</p>
            <button class="btn-main" onclick="scrollToSection('learning')">התחל ללמוד</button>
        </div>

        <section id="learning">
            <h2 class="section-title">📚 מרכז הלמידה</h2>
            <div class="grid-full">
                ${window.contentData.categories.map(cat => `
                    <div class="card" onclick="handleCategoryClick('${cat.id}')" style="background: ${cat.image}; background-size: cover;">
                        <div class="card-overlay">
                            <h3>${cat.title}</h3>
                            <button class="card-btn">כנס לקטגוריה</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="about" style="background:white; padding: 80px 10%; border-radius: 50px;">
             <h2 class="section-title">🔍 אודות PhysicsMaster</h2>
             <p style="font-size:1.2rem; text-align:center;">הופכים את הפיזיקה מחובה – לחוויה.</p>
        </section>

        <section id="testimonials">
            <h2 class="section-title">💬 תגובות</h2>
            <div class="carousel-wrapper">
                <button class="scroll-btn prev-btn" onclick="scrollTestimonials(-1)"><i class="fa-solid fa-chevron-right"></i></button>
                <div class="testimonials-scroll-container" id="testimonials-container">
                    ${testimonialsData.map(t => `
                        <div class="testimonial-card">
                            <img src="${t.img}" class="profile-img">
                            <h4>${t.name}</h4>
                            <p>"${t.text}"</p>
                        </div>
                    `).join('')}
                </div>
                <button class="scroll-btn next-btn" onclick="scrollTestimonials(1)"><i class="fa-solid fa-chevron-left"></i></button>
            </div>
        </section>

        <section id="contact">
            <h2 class="section-title">📬 צור קשר</h2>
            <div class="form-container">
                <form onsubmit="handleContact(event)">
                    <input type="text" placeholder="שם מלא" required>
                    <input type="email" placeholder="אימייל" required>
                    <textarea rows="5" placeholder="הודעה..." required></textarea>
                    <button type="submit" class="btn-main" style="width:100%">שלח הודעה</button>
                </form>
            </div>
        </section>
    `;
}

function renderSubjects() {
    const app = document.getElementById('app-container');
    app.innerHTML = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">${pageMode === 'exercises' ? 'תרגול שאלות' : 'סרטונים והסברים'}</h2>
            <div class="grid-full">
                ${window.contentData.subjects.map(sub => `
                    <div class="card" onclick="handleSubjectClick('${sub.id}')" style="background: ${sub.image}">
                        <div class="card-overlay">
                            <h3>${sub.title}</h3>
                            <p>${sub.desc}</p>
                            <button class="card-btn">בחר נושא</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-back" onclick="router('home')">חזור לדף הבית</button>
        </section>
    `;
}

function renderContentList(subjectId) {
    const items = window.contentData[subjectId + '_content'];
    const app = document.getElementById('app-container');
    app.innerHTML = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תכנים</h2>
            <div class="grid-full">
                ${items.map(item => {
                    if (item.type === 'folder') {
                        return `
                            <div class="card" onclick="router('folder_view', '${item.id}')" style="background: ${item.image}">
                                <div class="card-overlay">
                                    <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-folder-open"></i></div>
                                    <h3>${item.title}</h3>
                                    <button class="card-btn">פתח תיקייה</button>
                                </div>
                            </div>`;
                    } else {
                        const thumb = getYoutubeThumb(item.url);
                        return `
                            <div class="card" onclick="window.open('${item.url}')" style="background-image: url('${thumb}')">
                                <div class="card-overlay">
                                    <div style="font-size:3rem; margin-bottom:10px; color:#ef4444;"><i class="fa-brands fa-youtube"></i></div>
                                    <h3>${item.title}</h3>
                                    <button class="card-btn">צפה בסרטון</button>
                                </div>
                            </div>`;
                    }
                }).join('')}
            </div>
            <button class="btn-back" onclick="router('subject_select', 'explanations')">חזור לנושאים</button>
        </section>
    `;
}

function renderExerciseList(subjectId) {
    const items = window.contentData[subjectId + '_exercises'];
    const app = document.getElementById('app-container');
    app.innerHTML = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">רשימת תרגול</h2>
            <div class="grid-full">
                ${items.map(item => `
                    <div class="card" onclick="router('active_exercise', '${item.id}')" style="background: ${item.image}">
                        <div class="card-overlay">
                            <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-pen-to-square"></i></div>
                            <h3>${item.title}</h3>
                            <button class="card-btn">התחל תרגול</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-back" onclick="router('subject_select', 'exercises')">חזור לנושאים</button>
        </section>
    `;
}

function renderFolderContent(folderId) {
    const items = window.contentData[folderId];
    const app = document.getElementById('app-container');
    app.innerHTML = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תוכן התיקייה</h2>
            <div class="grid-full">
                ${items.map(item => `
                    <div class="card" onclick="window.open('${item.url}')" style="background-image: url('${getYoutubeThumb(item.url)}')">
                        <div class="card-overlay">
                            <h3>${item.title}</h3>
                            <button class="card-btn">צפה בסרטון</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-back" onclick="router('content_list', 'mechanics')">חזור</button>
        </section>
    `;
}

function renderActiveExercise(exId) {
    const questions = window.questionsBank[exId];
    const app = document.getElementById('app-container');
    
    if (!questions) { 
        app.innerHTML = `<section><h2 class="section-title">אין שאלות עדיין</h2><button class="btn-back" onclick="router('home')">חזור</button></section>`; 
        return; 
    }

    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תרגול שאלות</h2>
            <div class="form-container" style="text-align:right; direction:rtl; max-width:800px;">
                <div id="exercise-container">
                    ${questions.map((q, i) => `
                        <div class="question-block" style="margin-bottom:30px; border: 2px solid #f1f5f9; padding:25px; border-radius:20px; background: #fff;">
                            <p style="font-size:1.3rem; font-weight:700; margin-bottom:15px; color: var(--dark);">${i+1}. ${q.q}</p>
                            <div class="options-group">
                                ${q.options.map(opt => `
                                    <label style="display:block; margin:12px 0; cursor:pointer; font-size:1.1rem; padding:8px;">
                                        <input type="radio" name="q${i}" value="${opt}" style="margin-left:10px;"> ${opt}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-main" style="width:100%; margin-top:20px;" onclick="checkAnswers('${exId}')">
                    <i class="fa-solid fa-check-double"></i> בדוק תשובות
                </button>
            </div>
            <button class="btn-back" onclick="router('exercise_list', 'mechanics')">חזור לרשימה</button>
        </section>
    `;
    app.innerHTML = html;
}

/* =========================================
   7. פונקציות לוגיקה כלליות
   ========================================= */

window.handleCategoryClick = function(catId) {
    if (catId === 'explanations' || catId === 'exercises') {
        window.router('subject_select', catId);
    } else {
        alert('קטגוריה זו בבנייה כרגע...');
    }
};

window.handleSubjectClick = function(subId) {
    if (subId !== 'mechanics') {
        alert('נושא זה יעלה בקרוב!');
        return;
    }
    if (pageMode === 'exercises') {
        window.router('exercise_list', 'mechanics');
    } else {
        window.router('content_list', 'mechanics');
    }
};

window.scrollToSection = function(id) {
    if (!document.getElementById(id)) {
        window.router('home');
        setTimeout(() => {
            const el = document.getElementById(id);
            if(el) el.scrollIntoView({behavior: 'smooth'});
        }, 100);
    } else {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    }
};

window.scrollTestimonials = function(direction) {
    const container = document.getElementById('testimonials-container');
    if(container) container.scrollBy({ left: direction * 350 * -1, behavior: 'smooth' });
};

window.handleContact = function(e) {
    e.preventDefault();
    alert('ההודעה נשלחה בהצלחה!');
};

window.checkAnswers = function(exId) {
    const questions = window.questionsBank[exId];
    let correctCount = 0;
    let summaryHTML = '';
    
    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = document.getElementsByName(`q${i}`)[0].closest('.question-block');
        let isCorrect = selected && selected.value === q.a;
        
        if (isCorrect) {
            correctCount++;
            addXP(50);
            questionDiv.style.border = "2px solid #22c55e";
            questionDiv.style.background = "#f0fdf4";
        } else {
            questionDiv.style.border = "2px solid #ef4444";
            questionDiv.style.background = "#fef2f2";
        }
        summaryHTML += `<div style="text-align:right; margin-bottom:10px; color: ${isCorrect ? '#15803d' : '#b91c1c'}">
            <strong>שאלה ${i+1}:</strong> ${isCorrect ? '✅ צדקת! (+50 XP)' : `❌ טעית (התשובה הנכונה: ${q.a})`}
        </div>`;
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    if(finalScore === 100) addXP(100);

    const resultDiv = document.getElementById('exercise-results') || document.createElement('div');
    resultDiv.id = 'exercise-results';
    resultDiv.className = 'summary-card';
    resultDiv.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 15px;">סיכום התוצאות 🏁</h3>
        <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 20px;">ציון סופי: ${finalScore}</div>
        <div style="margin-bottom: 25px;">${summaryHTML}</div>
        <button class="btn-main" onclick="router('exercise_list', 'mechanics')">חזור לרשימת התרגילים</button>
    `;

    if (!document.getElementById('exercise-results')) {
        document.getElementById('exercise-container').after(resultDiv);
    }
    resultDiv.scrollIntoView({ behavior: 'smooth' });
};

window.checkDeviceSupport = function() {
    if (window.innerWidth < 768) {
        document.body.innerHTML = `
            <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f3f4f6; text-align: center; direction: rtl;">
                <i class="fa-solid fa-desktop" style="font-size: 5rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h1 style="font-size: 2rem;">האתר מותאם למחשב בלבד</h1>
                <p>לצפייה בסימולציות ופתרון תרגילים בנוחות,<br>אנא עברו למחשב נייד או נייח.</p>
            </div>
        `;
        return false;
    }
    return true;
};

function getYoutubeThumb(url) {
    if (!url) return '';
    let vidId = '';
    if (url.includes('youtu.be')) vidId = url.split('/').pop().split('?')[0];
    else if (url.includes('v=')) vidId = url.split('v=')[1].split('&')[0];
    return `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
}

/* =========================================
   4. AUTH
   ========================================= */

window.handleLogout = async () => {
    await signOut(auth);
};

onAuthStateChanged(auth, async (user) => {
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');
    const authModal = document.getElementById('auth-modal');

    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);

        if (!snap.exists()) {
            console.log("User not in DB, logging out.");
            await signOut(auth);
            location.reload();
            return;
        }

        userProfile.style.display = 'flex';
        loginBtn.style.display = 'none';
        xpWidget.style.display = 'flex';
        if(authModal) authModal.style.display = 'none';

        document.getElementById('user-name-display').innerText = user.displayName || user.email;

        await loadStatsFromDB(user.uid);
    } else {
        userProfile.style.display = 'none';
        loginBtn.style.display = 'block';
        xpWidget.style.display = 'none';
        if(authModal) authModal.style.display = 'flex';

        playerStats = { level: 1, currentXP: 0, xpNeeded: 100 };
        updateXPUI();
    }
});

/* =========================================
   9. דף אדמין (טעינת משתמשים) - מניעת מחיקה עצמית
   ========================================= */
async function loadAdminPage() {
    const app = document.getElementById('app-container');
    app.innerHTML = '<div style="text-align:center; margin-top:50px;">טוען משתמשים... <i class="fa-solid fa-spinner fa-spin"></i></div>';

    const currentUser = auth.currentUser; // מי אני?

    try {
        const users = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        let html = `
            <div class="admin-container animation-fade-in">
                <div class="admin-header">
                    <h2><i class="fa-solid fa-users-gear"></i> ניהול משתמשים (${users.length})</h2>
                </div>
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>שם מלא</th>
                            <th>אימייל</th>
                            <th>תאריך הצטרפות</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (users.length === 0) {
            html += `<tr><td colspan="5" style="text-align:center;">אין משתמשים רשומים.</td></tr>`;
        } else {
            users.forEach(user => {
                const roleClass = user.role === 'admin' ? 'role-admin' : 'role-student';
                const roleText = user.role === 'admin' ? 'מנהל' : 'תלמיד';
                
                // בדיקה האם זה המשתמש המחובר כרגע
                const isMe = currentUser && user.uid === currentUser.uid;
                let deleteButton = '';
                
                if (isMe) {
                    deleteButton = `<span style="font-size:0.8rem; color:#999; font-weight:bold;">(אני)</span>`;
                } else {
                    deleteButton = `
                        <button class="action-btn delete-btn" title="מחק" onclick="deleteUser('${user.uid}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    `;
                }

                html += `
                    <tr>
                        <td><strong>${user.name}</strong></td>
                        <td>${user.email}</td>
                        <td>${user.joinDate}</td>
                        <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                        <td>
                            ${deleteButton}
                        </td>
                    </tr>
                `;
            });
        }

        html += `
                    </tbody>
                </table>
                <button class="btn-back" onclick="router('home')">חזרה לדף הבית</button>
            </div>
        `;
        app.innerHTML = html;
    } catch (error) {
        console.error("Error loading users:", error);
        app.innerHTML = `<h3 style="text-align:center; color:red;">שגיאה בטעינת נתונים: ${error.message}</h3><button class="btn-back" onclick="router('home')">חזור</button>`;
    }
}

async function deleteUser(uid) {
    const currentUser = auth.currentUser;
    if(uid === currentUser.uid){
        alert("לא ניתן למחוק את עצמך!");
        return;
    }

    if(confirm('האם אתה בטוח שברצונך למחוק את המשתמש מהרשימה?')) {
        try {
            await deleteDoc(doc(db, "users", uid));
            alert('המשתמש נמחק בהצלחה');
            loadAdminPage();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("שגיאה במחיקה: " + error.message);
        }
    }
}


/* =========================================
   5. בעת הרשמה – יצירת stats
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const authForm = document.getElementById('auth-form');

    if(authForm){
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            const name = document.getElementById('auth-name').value;

            try {

                if(authMode === 'signup'){

                    const userCredential =
                        await createUserWithEmailAndPassword(auth, email, pass);

                    await updateProfile(userCredential.user, {
                        displayName: name
                    });

                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        role: 'student',
                        joinDate: new Date().toLocaleDateString('he-IL'),
                        uid: userCredential.user.uid,
                        stats: {
                            level: 1,
                            currentXP: 0,
                            xpNeeded: 100
                        }
                    });

                } else {

                    await signInWithEmailAndPassword(auth, email, pass);
                }

                document.getElementById('auth-modal').style.display = 'none';

            } catch (error) {
                document.getElementById('auth-error').innerText =
                    "שגיאה בהתחברות.";
            }
        });
    }
});

// חשיפת פונקציות לחלון הגלובלי (חשוב ל-Modules)
window.deleteUser = deleteUser;

/* =========================================
   10. אתחול ראשוני
   ========================================= */
window.onload = function() {
    if (window.checkDeviceSupport()) {
        window.router('home');
    }
};



