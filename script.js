/* =========================================
   1. הגדרות Firebase
   ========================================= */
import { 
    getFirestore, 
    collection, 
    getDocs, 
    setDoc, 
    doc, 
    deleteDoc,
    getDoc,
    addDoc,
    query,
    serverTimestamp,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
   4. מערכת XP ורמות (Gamification)
   ========================================= */
let playerStats = {
    level: 1,
    currentXP: 0,
    xpNeeded: 100
};



async function addXP(amount) {
    playerStats.currentXP += amount;
    checkLevelUp();
    await saveStatsToDB();
    updateXPUI();
}

function checkLevelUp() {
    let leveledUp = false;
    while (playerStats.currentXP >= playerStats.xpNeeded) {
        playerStats.currentXP -= playerStats.xpNeeded;
        playerStats.level++;
        playerStats.xpNeeded = Math.floor(playerStats.xpNeeded * 1.2);
        leveledUp = true;
    }
    if (leveledUp) triggerLevelUpEffect();
}

async function saveStatsToDB() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
    level: playerStats.level,
    currentXP: playerStats.currentXP,
    xpNeeded: playerStats.xpNeeded
    }, { merge: true });
}

function updateXPUI() {
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');

    if (levelEl) levelEl.innerText = playerStats.level;
    if (xpEl) xpEl.innerText = Math.floor(playerStats.currentXP);
    if (neededEl) neededEl.innerText = playerStats.xpNeeded;
    
    const percentage = playerStats.xpNeeded
  ? (playerStats.currentXP / playerStats.xpNeeded) * 100
  : 0;
    if (barEl) barEl.style.width = percentage + '%';
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
        case 'admin': 
                showAdminLogin();
                break;
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
    if (document.getElementById('exercise-results')) return;
    let correctCount = 0;
    let summaryHTML = '';
    
    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = document.querySelector(`input[name="q${i}"]`)?.closest('.question-block');
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
   8. מערכת Auth (Firebase)
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
                if (authMode === 'signup') {
                    // יצירת משתמש ב-Auth
                    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                    await updateProfile(userCredential.user, { displayName: name });
                    
                    // שמירת המשתמש ב-Firestore
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        role: 'student',
                        joinDate: new Date().toLocaleDateString('he-IL'),
                        uid: userCredential.user.uid
                    });
                    
                    alert("נרשמת בהצלחה! ברוכים הבאים.");
                } else {
                    await signInWithEmailAndPassword(auth, email, pass);
                }
                document.getElementById('auth-modal').style.display = 'none';
            } catch (error) {
                console.error("Auth Error:", error);
                errorEl.innerText = "שגיאה: אימייל, סיסמה או בעיה בשרת.";
            }
        });
    }
});

async function loadStatsFromDB(uid) {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const data = snapshot.data();

        playerStats = {
            level: data.level || 1,
            currentXP: data.currentXP || 0,
            xpNeeded: data.xpNeeded || 100
        };

        updateXPUI();
    }
}

// --- בודק משתמש מחובר (ומנתק אם הוא נמחק) ---
onAuthStateChanged(auth, async (user) => {
    const authModal = document.getElementById('auth-modal');
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');

    if (user) {
        // בדיקה: האם המשתמש קיים ב-Database?
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            console.log("User not found in DB, logging out.");
            await signOut(auth);
            // אם המשתמש כבר לא מחובר, אל תמשיך להציג פרופיל
            location.reload(); 
            return;
        }

        if(authModal) authModal.style.display = 'none';
        if(userProfile) userProfile.style.display = 'flex';
        if(loginBtn) loginBtn.style.display = 'none';
        if(xpWidget) xpWidget.style.display = 'flex';
        
        document.getElementById('user-name-display').innerText = user.displayName || user.email;
        document.body.classList.remove('not-logged-in');
        
        await loadStatsFromDB(user.uid);
    } else {
        if(authModal) authModal.style.display = 'flex';
        if(userProfile) userProfile.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'block';
        if(xpWidget) xpWidget.style.display = 'none';
        document.body.classList.add('not-logged-in');
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

// חשיפת פונקציות לחלון הגלובלי (חשוב ל-Modules)
window.deleteUser = deleteUser;

/* =========================================
   10. פונקציית דף משתמשים
   ========================================= */

function showAdminLogin() {
    const app = document.getElementById('app-container');

    app.innerHTML = `
        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background: linear-gradient(135deg,#1e293b,#0f172a);
        ">
            <div style="
                background:white;
                padding:40px;
                border-radius:20px;
                width:350px;
                text-align:center;
                box-shadow:0 20px 50px rgba(0,0,0,0.3);
            ">
                <h2 style="margin-bottom:20px;">🔐 כניסת מנהל</h2>
                <input type="password" id="admin-password"
                    placeholder="הזן סיסמת מנהל"
                    style="width:100%; padding:10px; margin-bottom:15px; border-radius:10px; border:1px solid #ddd;">
                <button onclick="verifyAdminPassword()" 
                    style="width:100%; padding:10px; border:none; border-radius:10px; background:#3b82f6; color:white; font-weight:bold; cursor:pointer;">
                    כניסה
                </button>
                <p id="admin-error" style="color:red; margin-top:10px;"></p>
            </div>
        </div>
    `;
}

window.verifyAdminPassword = function() {
    const password = document.getElementById('admin-password').value;

    if (password === "admin123") {
        loadAdminPage();
    } else {
        document.getElementById('admin-error').innerText = "סיסמה שגויה";
    }
};

/* =========================================
   11. בינה מלאכותית
   ========================================= */
let chatUnsubscribe = null;

window.toggleChat = function() {
    const box = document.getElementById('ai-chat-box');
    if (!box) return;

    box.classList.toggle('open');

    if (box.classList.contains('open')) {
        loadChatHistory();
    }
};

window.sendMessage = async function() {
    const input = document.getElementById('chat-input');
    if (!input.value.trim()) return;

    const text = input.value;

    // שמירת הודעת משתמש
    await saveMessage(text, "user");

    input.value = "";

    // כאן בעתיד נחבר ל-AI אמיתי
    const aiResponse = await getAIResponse(text);

    await saveMessage(aiResponse, "ai");
};

async function getAIResponse(message) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer xxx",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: "אתה מורה לפיזיקה שעונה בעברית בצורה ברורה.\n\nשאלה: " + message
            })
        }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
        return "המודל עדיין נטען ⏳ נסה שוב בעוד כמה שניות.";
    }

    if (Array.isArray(data) && data.length > 0) {
        return data[0].generated_text;
    }

    return "לא התקבלה תשובה.";
}

async function saveMessage(text, sender) {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(
        collection(db, "users", user.uid, "chat"),
        {
            text: text,
            sender: sender,
            timestamp: serverTimestamp()
        }
    );
}

function loadChatHistory() {
    const user = auth.currentUser;
    if (!user) return;

    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    const messagesRef = collection(db, "users", user.uid, "chat");
    const q = query(messagesRef, orderBy("timestamp"));

    // 🔴 ביטול מאזין קודם אם קיים
    if (chatUnsubscribe) {
        chatUnsubscribe();
    }

    chatUnsubscribe = onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const msg = docSnap.data();

            const div = document.createElement("div");
            div.textContent = msg.text;

            // עיצוב בסיסי לבועה
            div.style.padding = "8px 12px";
            div.style.borderRadius = "15px";
            div.style.marginBottom = "8px";
            div.style.maxWidth = "80%";
            div.style.wordBreak = "break-word";

            if (msg.sender === "user") {
                div.style.background = "#3b82f6";
                div.style.color = "white";
                div.style.marginLeft = "auto";
                div.style.textAlign = "right";
            } else {
                div.style.background = "#e2e8f0";
                div.style.color = "#111827";
                div.style.marginRight = "auto";
                div.style.textAlign = "right";
            }

            messagesDiv.appendChild(div);
        });

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

/* =========================================
   12. אתחול ראשוני
   ========================================= */
window.onload = function() {
    if (window.checkDeviceSupport()) {
        window.router('home');
    }
};
