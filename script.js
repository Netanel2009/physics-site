/* =========================================
   1. הגדרות Firebase
   ========================================= */
import { 
    getFirestore, 
    collection, 
    getDocs, 
    updateDoc,
    doc, 
    deleteDoc,
    getDoc,
    addDoc,
    setDoc,
    query,
    arrayUnion,
    orderBy,
    onSnapshot,
    serverTimestamp
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

const dict = {
    kinematics: "קינמטיקה",
    dynamics: "דינמיקה",
    gravity: "כבידה",
    energy: "עבודה ואנרגיה",
    momentum: "תנע",

    electrostatics: "אלקטרוסטטיקה",
    circuits: "מעגלים חשמליים",
    magnetism: "מגנטיות",
    induction: "השראה אלקטרומגנטית",

    optics: "אופטיקה",
    quantum: "פיזיקה קוונטית",
    atomic: "מבנה האטום",
    nuclear: "פיזיקה גרעינית"
};

const physicsStructure = {
    mechanics: {
        title: "מכניקה",
        subtopics: ["kinematics", "dynamics", "gravity", "energy", "momentum"]
    },
    electricity: {
        title: "חשמל ומגנטיות",
        subtopics: ["electrostatics", "circuits", "magnetism", "induction"]
    },
    radiation: {
        title: "קרינה וחומר",
        subtopics: ["optics", "quantum", "atomic", "nuclear"]
    }
};

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
    electricity_exercises: [
        { 
            id: 'ex_electricity', 
            title: 'תרגול חשמל', 
            desc: 'מעגלים, חוק אוהם ושדות', 
            image: 'linear-gradient(135deg, #f59e0b, #d97706)' 
        }
    ],

    radiation_exercises: [
        { 
            id: 'ex_radiation', 
            title: 'תרגול קרינה וחומר', 
            desc: 'אופטיקה ופיזיקה מודרנית', 
            image: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
        }
    ],
    electricity_exercises: [
        { id: 'ex_electricity', title: 'תרגול חשמל', desc: 'מעגלים וזרמים', image: 'linear-gradient(135deg, #f59e0b, #b45309)' }
    ],

    radiation_exercises: [
        { id: 'ex_radiation', title: 'תרגול קרינה', desc: 'אופטיקה ופיזיקה מודרנית', image: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
    ],

    simulations_content: [
        { type: 'folder', id: 'bagrut_folder', title: 'בגרויות', image: 'linear-gradient(135deg, #6366f1, #4338ca)', desc: 'שאלוני בגרות מלאים' },
        { type: 'folder', id: 'simulations_general', title: 'סימולציות', image: 'linear-gradient(135deg, #10b981, #059669)', desc: 'סימולציות אינטראקטיביות' }
    ],

    bagrut_folder: [
        { type: 'folder', id: 'bagrut_mechanics', title: 'מכניקה', image: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
        { type: 'folder', id: 'bagrut_electricity', title: 'חשמל', image: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { type: 'folder', id: 'bagrut_radiation', title: 'קרינה וחומר', image: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
    ],
        bagrut_mechanics: [
        { type: 'video', title: 'שאלון מכניקה 2023', url: 'https://youtu.be/EXAMPLE1' }
    ],

    bagrut_electricity: [
        { type: 'video', title: 'שאלון חשמל 2023', url: 'https://youtu.be/EXAMPLE2' }
    ],

    bagrut_radiation: [
        { type: 'video', title: 'שאלון קרינה 2023', url: 'https://youtu.be/EXAMPLE3' }
    ],
    kinematics_folder: [{ type: 'video', title: 'קינמטיקה (בסיס)', url: 'https://youtu.be/q8K73P4hft8', desc: 'תנועה בקו ישר ונפילה חופשית' }],
    energy_momentum_folder: [{ type: 'video', title: 'שימור תנע', url: 'https://youtu.be/6k8Hd3wPoU0', desc: 'התנגשויות ומתקף' }]
};

window.questionsBank = {

        'ex_kinematics': [
        {
            q: "מכונית מתחילה לנוע ממנוחה בתאוצה קבועה של 2m/s². לאחר שהגיעה למהירות של 20m/s, היא ממשיכה במהירות זו במשך 10 שניות נוספות. מהו המרחק הכולל שעברה המכונית?",
            a: "300 מ'",
            options: ["200 מ'", "250 מ'", "300 מ'", "400 מ'"],
            topic: "mechanics",
            subtopic: "kinematics"
        },
        {
            q: "גוף נזרק אנכית מעלה וחוזר לנקודת הזריקה לאחר 6 שניות. מהו הגובה המקסימלי אליו הגיע הגוף? (הנח g=10m/s²)",
            a: "45 מ'",
            options: ["30 מ'", "45 מ'", "60 מ'", "90 מ'"],
            topic: "mechanics",
            subtopic: "kinematics"
        },],


    'ex_electricity': [
        {
            q: "מהו חוק אוהם?",
            a: "V = IR",
            options: ["V = IR", "F = ma", "E = mc²", "P = IV"],
            topic: "electricity",
            subtopic: "circuits"
        }
    ],

    'ex_radiation': [
        {
            q: "מהי קרן אור?",
            a: "קו המתאר את כיוון התפשטות האור",
            options: [
                "קו המתאר את כיוון התפשטות האור",
                "חלקיק טעון",
                "גל קול",
                "כוח משיכה"
            ],
            topic: "radiation",
            subtopic: "optics"
        }
    ],
    
    'ex_electricity': [
        {
            q: "מהי ההגדרה הפיזיקלית של תנע?",
            a: "מכפלת המסה במהירות",
            options: ["מכפלת המסה בתאוצה", "מכפלת המסה במהירות", "האנרגיה הקינטית של הגוף", "הכוח הפועל על הגוף"],
            topic: "electricity",
            subtopic: "electricity"
         }
    ]
};

const testimonialsData = [
    { name: "יהונתן אדיב", text: "הסרטונים המפורטים לא הותירו לי שום בעיה בפתרון התרגילים. מומלץ בחום!", img: "https://i.pravatar.cc/150?u=1" },
    { name: "סתיו שיריזלי", text: "הסימולציות עוזרות להבין את החומר באמת, ולא רק לשנן נוסחאות.", img: "https://i.pravatar.cc/150?u=2" },
    { name: "ניתי ווליך", text: "האתר הכי טוב שמצאתי לבגרות. הכל מסודר, נקי וברור מאוד.", img: "https://cdn.discordapp.com/attachments/1258539660167221339/1482828439613341717/c3d1b4f7-cc6d-4e80-a552-1d1a0ab72ad4.png?ex=69b85f19&is=69b70d99&hm=19e0351663705d1b2320809f9052eaab0dcca222d8061effcbe7321e5e943f2c&" }
];



/* =========================================
   4. מערכת XP ורמות (Gamification)
   ========================================= */
window.playerStats = {
    level: 1,
    currentXP: 0,
    xpNeeded: 100,
    totalXP: 0,
    stars: 0,
    watchedVideos: [],
    completedExercises: []
};


async function addXP(amount) {
    window.playerStats.currentXP += amount;
    window.playerStats.totalXP += amount;

    await checkLevelUp();
    await saveStatsToDB();
    updateXPUI();
}

async function checkLevelUp() {
    let leveledUp = false;

    while (window.playerStats.currentXP >= window.playerStats.xpNeeded) {
        window.playerStats.currentXP -= window.playerStats.xpNeeded;
        window.playerStats.level++;

        // נוסחה חדשה: כל רמה = level * 100
        window.playerStats.xpNeeded = window.playerStats.level * 100;

        leveledUp = true;
    }

    if (leveledUp) {
        triggerLevelUpEffect();
        await checkAchievements();
    }
}

async function saveStatsToDB() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
        level: window.playerStats.level,
        currentXP: window.playerStats.currentXP,
        totalXP: window.playerStats.totalXP,
        stars: window.playerStats.stars,
        unlockedAchievements: window.playerStats.unlockedAchievements || [],
        watchedVideos: window.playerStats.watchedVideos || []
    }, { merge: true });
}

function updateXPUI() {
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');

    if (levelEl) levelEl.innerText = window.playerStats.level;
    if (xpEl) xpEl.innerText = Math.floor(window.playerStats.currentXP);
    if (neededEl) neededEl.innerText = window.playerStats.xpNeeded;
    
    const percentage = window.playerStats.xpNeeded
  ? (window.playerStats.currentXP / window.playerStats.xpNeeded) * 100
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
    if(!appContainer) return;
    appContainer.innerHTML = '';

    // הגנה: אם מנסים להיכנס לדף התקדמות לפני שהסטטיסטיקה נטענה
    if ((view === 'progress' || view === 'progress_topic') && !window.playerStats.progress) {
        renderHomePage();
        return;
    }

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
        case 'admin': showAdminLogin(); break;
        case 'progress': renderProgressSubjects(); break;
        case 'progress_topic':
            if (data && physicsStructure[data]) {
                renderProgressTopics(data);
            } else {
                renderHomePage();
            }
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
            <p style="
            text-align:center;
            margin-top:-10px;
            margin-bottom:20px;
            font-size:0.95rem;
            color:#10b981;
            font-weight:600;
        ">
             דיווח על באגים או שיפור מערכת יזכה בכוכבים בהתאם לאיכות הדיווח! 🐞
        </p>
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

function getVideoId(url) {
    if (!url) return null;

    let vidId = "";

    if (url.includes("youtu.be/")) {
        vidId = url.split("youtu.be/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/watch")) {
        const params = new URLSearchParams(url.split("?")[1]);
        vidId = params.get("v");
    }

    return vidId;
}

function renderSubjects() {
    const app = document.getElementById('app-container');
    
    // עמוד א' - נקי לחלוטין מאחוזים ומציג את גלי הסינוס הדינמיים בכל מצב (תרגול או סרטונים)
    app.innerHTML = `
        <section style="min-height:100vh; padding-top:40px; direction: rtl;">
            <h2 class="section-title text-white-shadow">${pageMode === 'exercises' ? 'תרגול שאלות' : 'סרטונים והסברים'}</h2>
            <div class="grid-full">
                ${window.contentData.subjects.map(sub => {
                    return `
                    <div class="card video-wave-card" onclick="handleSubjectClick('${sub.id}')">
                        <canvas class="video-wave-canvas" id="wave-${sub.id}"></canvas>
                        <div class="video-card-overlay">
                            <i class="fa-solid ${sub.id === 'mechanics' ? 'fa-film' : sub.id === 'electricity' ? 'fa-bolt' : 'fa-circle-nodes'} video-card-icon"></i>
                            <h3>${sub.title}</h3>
                            <p style="margin-top: 5px; opacity: 0.8; text-shadow: 0 2px 4px rgba(0,0,0,0.5); font-size: 1.1rem;">${sub.desc}</p>
                            <button class="card-btn" style="margin-top:15px; pointer-events:none;">בחר נושא</button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            
            <div style="text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 25px; margin-bottom: 15px;">
                Interactive wave animation inspired by Mathematical Canvas Fluid (MIT License)
            </div>

            <button class="btn-back" onclick="router('home')">חזור לדף הבית</button>
        </section>
    `;

    // הפעלת האנימציה הגלית לכל הקנבסים בעמוד א'
    setTimeout(() => {
        if (window.initPhysicsWaves) {
            window.initPhysicsWaves("wave-mechanics", "#60a5fa", 0.015, 20);
            window.initPhysicsWaves("wave-electricity", "#fbbf24", 0.025, 15);
            window.initPhysicsWaves("wave-radiation", "#a78bfa", 0.01, 25);
        }
    }, 100);
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
                            <div class="card" onclick="markVideoWatched('${item.url}');" style="background-image: url('${thumb}')">
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


window.markVideoWatched = async function(url) {
    if (!url) return;

    const user = auth.currentUser;
    if (!user) {
        alert("אנא התחבר/י כדי לשמור צפיות");
        return;
    }

    const videoId = getVideoId(url);
    if (!videoId) return;

    // פתיחת הסרטון
    window.open(url, "_blank");

    // עדכון מקומי
    if (!window.playerStats) {
        window.playerStats = {
            level: 1,
            currentXP: 0,
            xpNeeded: 100,
            totalXP: 0,
            stars: 0,
            watchedVideos: []
        };
    }

    if (!window.playerStats.watchedVideos) {
        window.playerStats.watchedVideos = [];
    }

    // אם לא נצפה עדיין
    if (!window.playerStats.watchedVideos.includes(videoId)) {

        // עדכון מקומי
        window.playerStats.watchedVideos.push(videoId);

        // שמירה ב-Firestore בלי למחוק נתונים אחרים
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            watchedVideos: arrayUnion(videoId)
        }, { merge: true });

        console.log("Video saved:", videoId);
    }
};

async function markExerciseCompleted(exId) {

    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // ודא שהמערך קיים
    if (!window.playerStats.completedExercises) {
        window.playerStats.completedExercises = [];
    }

    // בדיקה אם כבר קיים
    if (!window.playerStats.completedExercises.includes(exId)) {
        window.playerStats.completedExercises.push(exId);

        await setDoc(userRef, {
            completedExercises: arrayUnion(exId)
        }, { merge: true });
    }
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

// משתנה גלובלי זמני שיחזיק את השאלות שנבחרו בהגרלה
let currentActiveQuestions = [];

function renderActiveExercise(exId) {
    const allQuestions = window.questionsBank[exId];
    const app = document.getElementById('app-container');
    
    if (!allQuestions) { 
        app.innerHTML = `<section><h2 class="section-title">אין שאלות עדיין</h2><button class="btn-back" onclick="router('home')">חזור</button></section>`; 
        return; 
    }

    // הגרלת 10 שאלות ושמירתן במשתנה הגלובלי
    currentActiveQuestions = [...allQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תרגול שאלות (10 שאלות אקראיות)</h2>
            <div class="form-container" style="text-align:right; direction:rtl; max-width:800px;">
                <div id="exercise-container">
                    ${currentActiveQuestions.map((q, i) => `
                        <div class="question-block" style="margin-bottom:30px; border: 2px solid #f1f5f9; padding:25px; border-radius:20px; background: #fff;">
                            <p style="font-size:1.3rem; font-weight:700; margin-bottom:15px; color: var(--dark);">${i+1}. ${q.q}</p>
                            <div class="options-group">
                                ${q.options.map(opt => `
                                    <label style="display:flex; align-items:center; gap:12px; margin:12px 0; cursor:pointer;">
                                        <input type="radio" name="q${i}" value="${opt}"> 
                                        <span>${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="checkBtn" class="btn-main" style="width:100%; margin-top:20px;" onclick="checkCurrentAnswers()">
                    <i class="fa-solid fa-check-double"></i> בדוק תשובות
                </button>
            </div>
            <button class="btn-back" onclick="router('exercise_list', 'mechanics')">חזור לרשימה</button>
        </section>
    `;
    app.innerHTML = html;
}

window.checkCurrentAnswers = function() {
    if (!currentActiveQuestions || currentActiveQuestions.length === 0) return;
    
    let correctCount = 0;
    const questionBlocks = document.querySelectorAll('.question-block');

    currentActiveQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const block = questionBlocks[i];

        if (selected && selected.value === q.a) {
            correctCount++;
            block.style.border = "2px solid #22c55e";
            block.style.background = "#f0fdf4";
            addXP(100); // הוספת XP על תשובה נכונה
        } else {
            block.style.border = "2px solid #ef4444";
            block.style.background = "#fef2f2";
            // הצגת התשובה הנכונה במידה וטעה
            const correctHint = document.createElement('p');
            correctHint.style.color = "#dc2626";
            correctHint.style.fontSize = "0.9rem";
            correctHint.style.marginTop = "10px";
            correctHint.innerHTML = `תשובה נכונה: <b>${q.a}</b>`;
            block.appendChild(correctHint);
        }
    });

    // השבתת הכפתור לאחר בדיקה
    const btn = document.getElementById('checkBtn');
    btn.disabled = true;
    btn.innerHTML = `סיימת! ${correctCount}/10 תשובות נכונות`;
    btn.style.background = "#64748b";

    // גלילה לתוצאה הראשונה
    questionBlocks[0].scrollIntoView({ behavior: 'smooth' });
};

async function updateProgress(exId, correct, total) {
    const user = auth.currentUser;
    if (!user) return;

    const questions = window.questionsBank[exId];
    if (!questions || !questions[0]) return;

    const topic = questions[0].topic;
    const subtopic = questions[0].subtopic;
    const score = Math.round((correct / total) * 100);

    // וידוא קיום אובייקטים ב-State
    if (!window.playerStats.subProgress) window.playerStats.subProgress = {};
    if (!window.playerStats.progress) window.playerStats.progress = {};

    const oldSubScore = window.playerStats.subProgress[subtopic] || 0;
    const newSubScore = Math.round((oldSubScore + score) / 2);
    window.playerStats.subProgress[subtopic] = newSubScore;

    // חישוב ממוצע נושא ראשי על סמך כל תתי הנושאים שלו
    const subtopicsInTopic = physicsStructure[topic].subtopics;
    let totalTopicScore = 0;
    subtopicsInTopic.forEach(sub => {
        totalTopicScore += (window.playerStats.subProgress[sub] || 0);
    });
    const newTopicScore = Math.round(totalTopicScore / subtopicsInTopic.length);
    window.playerStats.progress[topic] = newTopicScore;

    // שמירה ל-Firebase
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        subProgress: window.playerStats.subProgress,
        progress: window.playerStats.progress
    }, { merge: true });
}

function renderProgressTopics(topicId) {
    const app = document.getElementById("app-container");
    const subProgress = window.playerStats.subProgress || {};
    const topicData = physicsStructure[topicId];

    app.innerHTML = `
    <section style="min-height:100vh; padding-top:40px;">
        <h2 class="section-title text-white-shadow">📊 פירוט התקדמות: ${topicData.title}</h2>

        <div style="max-width:800px; margin:auto; width: 100%;">
            ${topicData.subtopics.map(sub => {
                const val = subProgress[sub] || 0;
                return `
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 20px; border-radius: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.2);">
                    <div style="display:flex; justify-content:space-between; color: white; margin-bottom: 10px; font-weight: bold;">
                        <span>${translateSubtopic(sub)}</span>
                        <span>${val}%</span>
                    </div>
                    <div style="width:100%; height:12px; background: rgba(255,255,255,0.2); border-radius: 10px; overflow:hidden;">
                        <div style="width:${val}%; height:100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.5s ease-in-out;"></div>
                    </div>
                </div>
                `;
            }).join("")}
        </div>

        <button class="btn-back" onclick="router('progress')">חזור לנושאים ראשיים</button>
    </section>
    `;
}

// פונקציית עזר לתרגום שמות תתי הנושאים לתצוגה
function translateSubtopic(sub) {
    const dict = {
        kinematics: "קינמטיקה",
        dynamics: "דינמיקה",
        gravity: "כבידה",
        energy: "עבודה ואנרגיה",
        momentum: "תנע",
        electrostatics: "אלקטרוסטטיקה",
        circuits: "מעגלים חשמליים"
        // המשך להוסיף כאן...
    };
    return dict[sub] || sub;
}

/* =========================================
   7. פונקציות לוגיקה כלליות
   ========================================= */

   
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
    
window.handleCategoryClick = function(catId) {
    if (catId === 'explanations' || catId === 'exercises') {
        window.router('subject_select', catId);
    } else {
        alert('קטגוריה זו בבנייה כרגע...');
    }
};

window.handleSubjectClick = function(subId) {
    
    if (pageMode === 'exercises') {
        window.router('exercise_list', subId);
    } else {
        window.router('content_list', subId);
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
            addXP(300);
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

    const btn = document.getElementById("checkBtn");

    btn.disabled = true;
    btn.innerText = "✔ נבדק";
    btn.style.background = "gray";
    btn.style.cursor = "not-allowed";

    updateProgress(exId, correctCount, questions.length);

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
                    uid: userCredential.user.uid,
                    level: 1,
                    currentXP: 0,
                    xpNeeded: 100,
                    totalXP: 0,
                    stars: 0,

                    progress: {
                        mechanics: 0,
                        electricity: 0,
                        radiation: 0
                    }

                }, { merge: true });
                    
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
        window.playerStats = {
            level: data.level || 1,
            currentXP: data.currentXP || 0,
            totalXP: data.totalXP || 0,
            stars: data.stars || 0,
            unlockedAchievements: data.unlockedAchievements || [],
            completedExercises: data.completedExercises || [],
            watchedVideos: data.watchedVideos || [],
            subProgress: data.subProgress || {}, // שים לב שהוספנו את זה
            progress: data.progress || { mechanics: 0, electricity: 0, radiation: 0 }
        };

    window.playerStats.xpNeeded = window.playerStats.level * 100;

    updateXPUI();
    await checkAchievements();
    }
}

function renderVideosPage() {
    const app = document.getElementById("app-container");
    
    app.innerHTML = `
        <section class="videos-page" style="min-height:100vh; padding-top:40px; direction: rtl;">
            <h2 class="section-title text-white-shadow" style="text-align:center; margin-bottom: 40px;">🎥 סרטונים והסברים לפי נושאים</h2>
            
            <div class="grid-full" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; padding: 20px; max-width: 1200px; margin: 0 auto;">
                <div class="card video-wave-card" onclick="router('videos_topic', 'mechanics')">
                    <canvas class="video-wave-canvas" id="wave-mechanics"></canvas>
                    <div class="video-card-overlay">
                        <i class="fa-solid fa-film video-card-icon" style="color: #60a5fa;"></i>
                        <h3>מכניקה</h3>
                    </div>
                </div>

                <div class="card video-wave-card" onclick="router('videos_topic', 'electricity')">
                    <canvas class="video-wave-canvas" id="wave-electricity"></canvas>
                    <div class="video-card-overlay">
                        <i class="fa-solid fa-bolt video-card-icon" style="color: #fbbf24;"></i>
                        <h3>חשמל ומגנטיות</h3>
                    </div>
                </div>

                <div class="card video-wave-card" onclick="router('videos_topic', 'radiation')">
                    <canvas class="video-wave-canvas" id="wave-radiation"></canvas>
                    <div class="video-card-overlay">
                        <i class="fa-solid fa-circle-nodes video-card-icon" style="color: #a78bfa;"></i>
                        <h3>קרינה וחומר</h3>
                    </div>
                </div>
            </div>

            <div style="text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 40px;">
                Interactive wave animation inspired by Mathematical Canvas Fluid (MIT License)
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button class="btn-back" onclick="router('home')">חזור לדף הבית</button>
            </div>
        </section>
    `;

    // הפעלת מנוע הגלים
    setTimeout(() => {
        if (window.initPhysicsWaves) {
            window.initPhysicsWaves("wave-mechanics", "#60a5fa", 0.015, 20);
            window.initPhysicsWaves("wave-electricity", "#fbbf24", 0.025, 15);
            window.initPhysicsWaves("wave-radiation", "#a78bfa", 0.01, 25);
        }
    }, 100);
}

// --- בודק משתמש מחובר (ומנתק אם הוא נמחק) ---
onAuthStateChanged(auth, async (user) => {
    const authModal = document.getElementById('auth-modal');
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');

    if (user) {

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        // 🔥 במקום logout — ניצור מסמך אם חסר
        if (!userSnapshot.exists()) {
            await setDoc(userDocRef, {
            name: user.displayName || "",
            email: user.email,
            role: "student",
            joinDate: new Date().toLocaleDateString('he-IL'),
            uid: user.uid,
            level: 1,
            currentXP: 0,
            totalXP: 0,
            stars: 0,
        });
        }

        if(authModal) authModal.style.display = 'none';
        if(userProfile) userProfile.style.display = 'flex';
        if(loginBtn) loginBtn.style.display = 'none';
        if(xpWidget) xpWidget.style.display = 'flex';

        document.getElementById('user-name-display').innerText =
            user.displayName || user.email;

        await loadStatsFromDB(user.uid);
        listenToLeaderboard(); // 🔥 תוסיף כאן
        window.router('home');
    } else {

        if(authModal) authModal.style.display = 'flex';
        if(userProfile) userProfile.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'block';
        if(xpWidget) xpWidget.style.display = 'none';
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
                    <button class="action-btn" title="איפוס XP"
                        onclick="resetUserXP('${user.uid}')">
                        <i class="fa-solid fa-rotate-left"></i>
                    </button>

                    <button class="action-btn" title="איפוס כוכבים"
                        onclick="resetUserStars('${user.uid}')">
                        ⭐
                    </button>

                    <button class="action-btn" title="הוסף כוכב"
                        onclick="increaseUserStars('${user.uid}')">
                        ➕
                    </button>

                    <button class="action-btn" title="הסר כוכב"
                        onclick="decreaseUserStars('${user.uid}')">
                        ➖
                    </button>

                    <button class="action-btn delete-btn" title="מחק"
                        onclick="deleteUser('${user.uid}')">
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
async function resetUserXP(uid) {
    if (!confirm("האם אתה בטוח שברצונך לאפס את ה-XP של המשתמש?")) return;

    try {
        await setDoc(doc(db, "users", uid), {
            level: 1,
            currentXP: 0,
            xpNeeded: 100,
            totalXP: 0
        }, { merge: true });

        alert("ה-XP אופס בהצלחה!");
        loadAdminPage(); // רענון הטבלה
    } catch (error) {
        console.error("Error resetting XP:", error);
        alert("שגיאה באיפוס XP");
    }
}
async function resetUserStars(uid) {
    if (!confirm("האם אתה בטוח שברצונך לאפס את הכוכבים?")) return;

    try {
        await setDoc(doc(db, "users", uid), {
            stars: 0
        }, { merge: true });

        alert("הכוכבים אופסו בהצלחה!");
        loadAdminPage();
    } catch (error) {
        console.error(error);
        alert("שגיאה באיפוס כוכבים");
    }
}

async function increaseUserStars(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const currentStars = snap.data().stars || 0;

        await updateDoc(userRef, {
            stars: currentStars + 1
        });

        loadAdminPage();
    } catch (error) {
        console.error(error);
    }
}

async function decreaseUserStars(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const currentStars = snap.data().stars || 0;

        await updateDoc(userRef, {
            stars: Math.max(0, currentStars - 1)
        });

        loadAdminPage();
    } catch (error) {
        console.error(error);
    }
}
window.resetUserStars = resetUserStars;
window.increaseUserStars = increaseUserStars;
window.decreaseUserStars = decreaseUserStars;
window.resetUserXP = resetUserXP;
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
   11. שאלות
   ========================================= */
function loadChatHistory() {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    messagesDiv.innerHTML = `
        <div class="chat-title">
            🤖 מרכז העזרה
        </div>

        <div class="chat-grid" id="chat-options">

            <div class="chat-card" onclick="showChatQuestions('technical')">
                🛠
                <span>שאלות טכניות</span>
            </div>

            <div class="chat-card" onclick="showChatQuestions('understanding')">
                🧠
                <span>שאלות הבנה</span>
            </div>

            <div class="chat-card" onclick="showChatQuestions('contact')">
                📩
                <span>יצירת קשר</span>
            </div>

        </div>
    `;
}

window.handleChatAnswer = function(question) {

    const options = document.getElementById("chat-options");

    if (options) {
        options.classList.add("hidden"); // מסתיר
    }

    addChatMessage(question, false);

    const typing = showTypingIndicator();

    setTimeout(() => {

        typing.remove();

        let response = "";

        if (question.includes("קינמטיקה")) {
            response = "תשובה זו עדיין בתיקון";
        }
        else if (question.includes("תאוצה")) {
            response = "תאוצה היא קצב שינוי המהירות בזמן.";
        }
        else if (question.includes("תנע")) {
            response = "תנע הוא מכפלת המסה במהירות הגוף.";
        }
        else {
            response = "תודה על השאלה! 😊";
        }

        typeBotMessage(response);

        // רווח נקי בלי innerHTML
        const spacer = document.createElement("div");
        spacer.style.height = "15px";
        document.getElementById("chat-messages").appendChild(spacer);

        // מחזיר אופציות אחרי זמן קצר
        setTimeout(() => {
            if (options) {
                options.classList.remove("hidden");
            }
        }, 1000);

    }, 1200);
};

function typeBotMessage(text) {
    const messagesDiv = document.getElementById("chat-messages");
    if (!messagesDiv) return;

    const msg = document.createElement("div");
    msg.className = "chat-bubble chat-bot";
    msg.style.whiteSpace = "pre-line";

    messagesDiv.appendChild(msg);

    let i = 0;
    msg.textContent = "";

    const typing = setInterval(() => {

        msg.textContent += text[i];
        i++;

        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        if (i >= text.length) {
            clearInterval(typing);
        }

    }, 25);
}

window.showChatQuestions = function(category) {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    let questions = [];

    if (category === 'technical') {
        questions = [
            "איך אני מתחבר לאתר?",
            "למה התרגילים לא נשמרים?",
            "איך מאפסים XP?"
        ];
    }

    if (category === 'understanding') {
        questions = [
            "מה זה קינמטיקה?",
            "מה זה תאוצה?",
            "מה זה תנע?"
        ];
    }

    if (category === 'contact') {
        questions = [
            "איך אפשר ליצור קשר?",
            "איך מדווחים על בעיה?"
        ];
    }

    messagesDiv.innerHTML = `
        <button class="chat-back" onclick="loadChatHistory()">
            ⬅ חזרה
        </button>

        <div class="chat-grid">
            ${questions.map(q => `
                <div class="chat-question" onclick="handleChatAnswer('${q}')">
                    ${q}
                </div>
            `).join('')}
        </div>
    `;
    window.loadChatHistory = loadChatHistory;
};
window.toggleChat = function() {
    const box = document.getElementById('ai-chat-box');
    if (!box) return;

    box.classList.toggle('open');

    if (box.classList.contains('open')) {
        loadChatHistory();
    }
};

function addChatMessage(text, isBot = false) {
    const messagesDiv = document.getElementById("chat-messages");
    if (!messagesDiv) return;

    const msg = document.createElement("div");

    msg.classList.add("chat-bubble");
    msg.classList.add(isBot ? "chat-bot" : "chat-user");

    msg.innerText = text;

    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return msg;
}

function showTypingIndicator() {
    const messagesDiv = document.getElementById("chat-messages");
    if (!messagesDiv) return;

    const typing = document.createElement("div");
    typing.id = "typing-indicator";

    typing.style.alignSelf = "flex-start";
    typing.style.background = "#e2e8f0";
    typing.style.padding = "10px 14px";
    typing.style.borderRadius = "12px";
    typing.style.width = "50px";
    typing.style.display = "flex";
    typing.style.justifyContent = "center";

    typing.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;

    messagesDiv.appendChild(typing);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return typing;
}

function startTypingAnimation() {
    const text = "PhysicsMaster";
    const el = document.getElementById("typing-logo");
    if (!el) return;

    let i = 0;
    el.innerHTML = "";

    const typing = setInterval(() => {
        el.innerHTML += text[i];
        i++;

        if (i === text.length) {
            clearInterval(typing);
        }
    }, 120);
}

function createParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDuration = (3 + Math.random() * 5) + "s";
        particle.style.animationDelay = Math.random() * 5 + "s";

        container.appendChild(particle);
    }
}

/* =========================================
   12. leaderboard
   ========================================= */
window.toggleLeaderboard = function() {
    const sidebar = document.getElementById("leaderboard-sidebar");
    const btn = document.getElementById("leaderboard-toggle");
    
    if (!sidebar) return;

    // הוספה/הסרה של ה-class 'open' (בדיוק כמו ב-CSS שלך)
    sidebar.classList.toggle("open");
    
    if (btn) {
        // הוספת ה-class 'open' גם לכפתור כדי שיזוז שמאלה
        btn.classList.toggle("open");
        
        // החלפת האייקון ל-X כשהתפריט פתוח
        if (sidebar.classList.contains("open")) {
            btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            btn.innerHTML = '🏆';
        }
    }
};


function renderProgressSubjects() {
    const app = document.getElementById("app-container");
    
    app.innerHTML = `
        <section class="progress-page" style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title text-white-shadow">📊 התקדמות הלמידה לפי נושאים</h2>
            
            <div class="grid-full">
                <div class="card animated-bg-card" onclick="router('progress_topic', 'mechanics')">
                    <canvas class="card-particle-canvas" id="canvas-mechanics"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-gears card-icon-animated"></i>
                        <h3>מכניקה</h3>
                    </div>
                </div>

                <div class="card animated-bg-card" onclick="router('progress_topic', 'electricity')">
                    <canvas class="card-particle-canvas" id="canvas-electricity"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-bolt-lightning card-icon-animated"></i>
                        <h3>חשמל ומגנטיות</h3>
                    </div>
                </div>

                <div class="card animated-bg-card" onclick="router('progress_topic', 'radiation')">
                    <canvas class="card-particle-canvas" id="canvas-radiation"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-atom card-icon-animated"></i>
                        <h3>קרינה וחומר</h3>
                    </div>
                </div>
            </div>

            <div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 20px;">
                Animated particle effect inspired by Particles.js (MIT License)
            </div>

            <button class="btn-back" onclick="router('home')">
                חזור לדף הבית
            </button>
        </section>
    `;

    // הפעלת מנוע האנימציה לכל כרטיס בנפרד עם צבעים ייחודיים
    setTimeout(() => {
        initCardParticles("canvas-mechanics", "#3b82f6");     // כחול פיזיקלי קלאסי
        initCardParticles("canvas-electricity", "#f59e0b");   // צהוב/כתום חשמלי
        initCardParticles("canvas-radiation", "#8b5cf6");     // סגול קוונטי/קרינתי
    }, 50);
}

// מנוע חלקיקים עצמאי ומהיר לכרטיסים (Inspired by Particles.js)
function initCardParticles(canvasId, particleColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // התאמת גודל הקנבס לכרטיס האב שלו
    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 25; // כמות מאוזנת שלא תעמיס על המעבד

    // יצירת חלקיקים ראשונית
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6, // מהירות תנועה עדינה
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2.5 + 1
        });
    }

    function animate() {
        // בדיקה שהאלמנט עדיין קיים במסך (כדי לא לבזבז זיכרון במעבר עמודים)
        if (!document.getElementById(canvasId)) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // עדכון וציור חלקיקים
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // החזרה מהקירות
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        });

        // חיבור חלקיקים קרובים בקווי רשת עדינים
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = particleColor;
        ctx.lineWidth = 0.8;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 65) { // מרחק חיבור מקסימלי
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1.0; // איפוס אלפא

        requestAnimationFrame(animate);
    }
    
    animate();
}


function renderProgressPage(){

    const app = document.getElementById("app-container");

    const progress = window.playerStats.progress || {};

    app.innerHTML = `
    <section style="min-height:100vh;padding-top:40px">

        <h2 class="section-title">📊 התקדמות הלמידה שלך</h2>

        <div style="max-width:600px;margin:auto">

            ${renderProgressBar("מכניקה",progress.mechanics)}
            ${renderProgressBar("חשמל",progress.electricity)}
            ${renderProgressBar("קרינה",progress.radiation)}

        </div>

        <button class="btn-back" onclick="router('home')">
            חזור
        </button>

    </section>
    `;
}

function renderProgressBar(title,value=0){

return `
<div style="margin-bottom:25px">

    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span>${title}</span>
        <span>${value}%</span>
    </div>

    <div style="
        width:100%;
        height:18px;
        background:#e2e8f0;
        border-radius:10px;
        overflow:hidden
    ">

        <div style="
            width:${value}%;
            height:100%;
            background:linear-gradient(90deg,#3b82f6,#10b981);
            transition:width 0.5s;
        "></div>

    </div>

</div>
`;
}

function listenToLeaderboard() {
    const q = query(
    collection(db, "users"),
    orderBy("stars", "desc"),
    orderBy("level", "desc")
);

    onSnapshot(q, (snapshot) => {
        const users = [];

        snapshot.forEach(docSnap => {
    users.push({
        id: docSnap.id,
        ...docSnap.data()
    });
});

        const top5 = users.slice(0, 5);
        renderLeaderboard(top5);
    });
}
function renderLeaderboard(users) {
    const list = document.getElementById("leaderboard-list");
    if (!list) return;

    list.innerHTML = "";

    users.forEach((user, index) => {
        const div = document.createElement("div");
        div.classList.add("leaderboard-item");

        if (index === 0) div.classList.add("top1");
        if (index === 1) div.classList.add("top2");
        if (index === 2) div.classList.add("top3");

        div.innerHTML = `
            <span>${index + 1}. ${user.name || "אנונימי"}</span>
            <span>⭐ ${user.stars || 0}</span>
        `;

        list.appendChild(div);
    });
}

/* =========================================
   13. הישגים
   ========================================= */

window.toggleAchievements = function() {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;

    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderAchievements(); // 🔥 חשוב מאוד
    }
};
function renderAchievements() {
    const list = document.getElementById('achievements-list');
    if (!list) return;

    const level = window.playerStats.level;

    const achievements = [
        { id: "level5", title: "הגעה לרמה 5", condition: level >= 5, stars: 5 },
        { id: "level10", title: "הגעה לרמה 10", condition: level >= 10, stars: 10 },
        { id: "level20", title: "הגעה לרמה 20", condition: level >= 20, stars: 20 },
    ];

    list.innerHTML = achievements.map(a => `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:14px;
            border-bottom:1px solid #eee;
            font-weight:600;
        ">
            <div style="display:flex; flex-direction:column; text-align:right;">
                <span>${a.title}</span>

                <!-- ⭐ כמה כוכבים זה נותן -->
                <span style="font-size:0.9rem; color:#f59e0b; margin-top:4px;">
                    ⭐ ${a.stars} כוכבים
                </span>
            </div>

            ${
                a.condition
                ? `<span style="
                        width:28px;
                        height:28px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:50%;
                        background:#22c55e;
                        color:white;
                        font-weight:bold;
                        font-size:16px;
                        box-shadow:0 4px 10px rgba(34,197,94,0.4);
                    ">
                        ✓
                   </span>`
                : `<span style="
                        width:28px;
                        height:28px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:50%;
                        background:#ef4444;
                        color:white;
                        font-weight:bold;
                        font-size:16px;
                        opacity:0.6;
                    ">
                        ✕
                   </span>`
            }
        </div>
    `).join('');
}

async function checkAchievements() {

    const level = window.playerStats.level;

    const achievements = [
        { id: "level5", condition: level >= 5, stars: 5 },
        { id: "level10", condition: level >= 10, stars: 10 },
        { id: "level20", condition: level >= 20, stars: 20 },
    ];

    for (let ach of achievements) {
        if (
            ach.condition &&
            !window.playerStats.unlockedAchievements.includes(ach.id)
        ) {
            window.playerStats.stars += ach.stars;
            window.playerStats.unlockedAchievements.push(ach.id);
            await saveStatsToDB();
        }
    }

    renderAchievements();
}

window.checkAchievements = checkAchievements;
/* =========================================
   14. אתחול ראשוני
   ========================================= */

window.addEventListener("load", () => {

    if (!sessionStorage.getItem("loaderShown")) {

        createParticles();
        startTypingAnimation();

        setTimeout(() => {

            const loader = document.getElementById('loading-screen');

            if (loader) {
                loader.classList.add('fade-out');
                document.querySelector(".chat-fab").style.display = "flex";
                setTimeout(() => {
                    loader.remove(); // יותר בטוח מ-display none
                }, 800);
            }

            window.router('home');

        }, 2500);

        sessionStorage.setItem("loaderShown", "true");

    } else {

        const loader = document.getElementById('loading-screen');
        if (loader) loader.remove();

        window.router('home');
    }

});

/* =========================================
   --- אפקט ניצוצות עדין ב-Hover ---
   ========================================= */

// פונקציה ליצירת ניצוץ בודד
function createSparkle(button) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    
    // מיקום התחלתי אקראי מסביב לכפתור
    const rect = button.getBoundingClientRect();
    const size = rect.width;
    
    // מיקום הניצוץ יחסית למרכז הכפתור
    const x = Math.random() * size - size / 2;
    const y = Math.random() * size - size / 2;
    
    sparkle.style.left = `${rect.left + rect.width / 2 + x}px`;
    sparkle.style.top = `${rect.top + rect.height / 2 + y}px`;
    
    // הגדרת כיוון תנועה אקראי (עבור ה-CSS Variables)
    // הניצוץ יעלה למעלה (y שלילי) ויזוז קצת לצדדים
    const moveX = (Math.random() - 0.5) * 40 + "px"; // +/- 20px
    const moveY = -(Math.random() * 50 + 30) + "px"; // 30-80px למעלה
    
    sparkle.style.setProperty("--x", moveX);
    sparkle.style.setProperty("--y", moveY);
    
    // הוספה ל-DOM
    document.body.appendChild(sparkle);
    
    // הסרה אוטומטית אחרי שהאנימציה מסתיימת (1 שנייה)
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// פונקציה שמחברת את האפקט לכפתורים
function initSparkleEffect() {
    const buttonSelectors = [
        '.chat-fab', 
        '#achievements-btn', 
        '.progress-icon', 
        '#leaderboard-toggle'
    ];
    
    buttonSelectors.forEach(selector => {
        const btn = document.querySelector(selector);
        if (btn) {
            let sparkleInterval;
            
            btn.addEventListener('mouseenter', () => {
                // יוצרים 5 ניצוצות מיד בכניסה לאפקט "וואו" ראשוני
                for(let i = 0; i < 5; i++) {
                    setTimeout(() => createSparkle(btn), i * 50);
                }
                
                // מייצרים ניצוץ חדש כל 150 מילישניות (פי 2 יותר מהר מקודם)
                sparkleInterval = setInterval(() => {
                    createSparkle(btn);
                }, 150); 
            });
            
            btn.addEventListener('mouseleave', () => {
                clearInterval(sparkleInterval);
            });
        }
    });
}

// הפעלה כשהדף נטען
window.addEventListener("load", () => {
    // ... הקוד הקיים שלך של ה-loading screen ...
    
    initSparkleEffect(); // הפעלת הניצוצות
});
