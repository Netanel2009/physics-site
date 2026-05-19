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
            id: 'kin_q1',
            q: "מכונית מתחילה לנוע ממנוחה בתאוצה קבועה של 2m/s². לאחר שהגיעה למהירות של 20m/s, היא ממשיכה במהירות זו במשך 10 שניות נוספות. מהו המרחק הכולל שעברה המכונית?",
            a: "300 מ'",
            options: ["200 מ'", "250 מ'", "300 מ'", "400 מ'"],
            topic: "mechanics",
            subtopic: "kinematics"
        },
        {
            id: 'kin_q2',
            q: "גוף נזרק אנכית מעלה וחוזר לנקודת הזריקה לאחר 6 שניות. מהו הגובה המקסימלי אליו הגיע הגוף? (הנח g=10m/s²)",
            a: "45 מ'",
            options: ["30 מ'", "45 מ'", "60 מ'", "90 מ'"],
            topic: "mechanics",
            subtopic: "kinematics"
        },
        {
            id: 'kin_q3',
            q: "גוף נזרק אנכית מעלה וחוזר לנקודת הזריקה לאחר 6 שניות. מהו הגובה המקסימלי אליו הגיע הגוף? (הנח g=20m/s²)",
            a: "100 מ'",
            options: ["300000000מ'", "500 מ'", "700 מ'", "100 מ'"],
            topic: "mechanics",
            subtopic: "kinematics"
        },
    ],
    'ex_electricity': [
        {
            id: 'elec_q1', // <-- הוספת מזהה ייחודי
            q: "מהו חוק אוהם?",
            a: "V = IR",
            options: ["V = IR", "F = ma", "E = mc²", "P = IV"],
            topic: "electricity",
            subtopic: "circuits"
        }
    ],
    'ex_radiation': [
        {
            id: 'rad_q1', // <-- הוספת מזהה ייחודי
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
    ]
};

const testimonialsData = [
    { name: "יהונתן אדיב", text: "הסרטונים המפורטים לא הותירו לי שום בעיה בפתרון התרגילים. מומלץ בחום!", img: "https://cdn.discordapp.com/attachments/997483064341041263/1506275882245951628/image.png?ex=6a0dac3b&is=6a0c5abb&hm=7e92d359d740399d4908f507a8dcc190c0cdb3e737d167558b1ebeff75ef196a&" },
    { name: "סתיו שיריזלי", text: "הסימולציות עוזרות להבין את החומר באמת, ולא רק לשנן נוסחאות.", img: "https://cdn.discordapp.com/attachments/997483064341041263/1506275882245951628/image.png?ex=6a0dac3b&is=6a0c5abb&hm=7e92d359d740399d4908f507a8dcc190c0cdb3e737d167558b1ebeff75ef196a&" },
    { name: "ניתי ווליך", text: "האתר הכי טוב שמצאתי לבגרות. הכל מסודר, נקי וברור מאוד.", img: "https://cdn.discordapp.com/attachments/997483064341041263/1506275882245951628/image.png?ex=6a0dac3b&is=6a0c5abb&hm=7e92d359d740399d4908f507a8dcc190c0cdb3e737d167558b1ebeff75ef196a&" }
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
    completedExercises: [],
    correctQuestionsTrack: [] // מזהים של שאלות שנפתרו נכון אי פעם
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
            <p style="text-align:center; margin-top:-10px; margin-bottom:20px; font-size:0.95rem; color:#10b981; font-weight:600;">
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
                            <p style="margin-top: 5px; color: #ffffff; font-weight: 500; text-shadow: 0 2px 6px rgba(0,0,0,0.8); font-size: 1.1rem;">${sub.desc}</p>
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
                            <div class="card" onclick="markVideoWatched('${item.url}');" style="background-image: url('${thumb}');">
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

    window.open(url, "_blank");

    if (!window.playerStats) {
        window.playerStats = { level: 1, currentXP: 0, xpNeeded: 100, totalXP: 0, stars: 0, watchedVideos: [] };
    }
    if (!window.playerStats.watchedVideos) {
        window.playerStats.watchedVideos = [];
    }

    if (!window.playerStats.watchedVideos.includes(videoId)) {
        window.playerStats.watchedVideos.push(videoId);
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { watchedVideos: arrayUnion(videoId) }, { merge: true });
        console.log("Video saved:", videoId);
    }
};

async function markExerciseCompleted(exId) {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    if (!window.playerStats.completedExercises) {
        window.playerStats.completedExercises = [];
    }

    if (!window.playerStats.completedExercises.includes(exId)) {
        window.playerStats.completedExercises.push(exId);
        await setDoc(userRef, { completedExercises: arrayUnion(exId) }, { merge: true });
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
                    <div class="card" onclick="window.open('${item.url}')" style="background-image: url('${getYoutubeThumb(item.url)}');">
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
                                    <label class="option-label">
                                        <input type="radio" name="q${i}" value="${opt}"> 
                                        <span class="option-text">${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="checkBtn" class="btn-main" style="width:100%; margin-top:20px;" onclick="checkCurrentAnswers('${exId}')">
                    <i class="fa-solid fa-check-double"></i> בדוק תשובות
                </button>
            </div>
            <button class="btn-back" onclick="router('exercise_list', 'mechanics')">חזור לרשימה</button>
        </section>
    `;
    app.innerHTML = html;
}

// --- פונקציית בדיקת תשובות משופרת למקצים אקראיים ---
window.checkCurrentAnswers = function(exId) {
    if (!currentActiveQuestions || currentActiveQuestions.length === 0) return;
    
    let correctCount = 0;
    const questionBlocks = document.querySelectorAll('.question-block');
    const correctQuestionIds = [];

    currentActiveQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const block = questionBlocks[i];

        if (selected && selected.value === q.a) {
            correctCount++;
            block.style.border = "2px solid #22c55e";
            block.style.background = "#f0fdf4";
            addXP(100); 
            
            if (q.id) {
                correctQuestionIds.push(q.id);
            }
        } else {
            block.style.border = "2px solid #ef4444";
            block.style.background = "#fef2f2";
            
            const correctHint = document.createElement('p');
            correctHint.style.color = "#dc2626";
            correctHint.style.fontSize = "0.9rem";
            correctHint.style.marginTop = "10px";
            correctHint.innerHTML = `תשובה נכונה: <b>${q.a}</b>`;
            block.appendChild(correctHint);
        }
    });

    const btn = document.getElementById('checkBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `סיימת! ${correctCount}/${currentActiveQuestions.length} תשובות נכונות`;
        btn.style.background = "#64748b";
    }

    if (questionBlocks[0]) {
        questionBlocks[0].scrollIntoView({ behavior: 'smooth' });
    }

    // הפעלה דינמית ומדויקת לפי ה-exId שנשלח
    if (exId) {
        updateProgressWithCorrectIds(exId, correctQuestionIds);
    }
};

// --- פונקציית בדיקה משופרת לדפי תרגילים מלאים ---
window.checkAnswers = function(exId) {
    const questions = window.questionsBank[exId];
    if (!questions || questions.length === 0) return;
    if (document.getElementById('exercise-results')) return;

    let correctCount = 0;
    let summaryHTML = '';
    const correctQuestionIds = [];
    const questionBlocks = document.querySelectorAll('.question-block');
    
    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = questionBlocks[i] || document.querySelector(`input[name="q${i}"]`)?.closest('.question-block');
        let isCorrect = selected && selected.value === q.a;
        
        if (isCorrect) {
            correctCount++;
            addXP(300);
            if (questionDiv) {
                questionDiv.style.border = "2px solid #22c55e";
                questionDiv.style.background = "#f0fdf4";
            }
            if (q.id) {
                correctQuestionIds.push(q.id);
            }
        } else {
            if (questionDiv) {
                questionDiv.style.border = "2px solid #ef4444";
                questionDiv.style.background = "#fef2f2";
            }
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

    const container = document.getElementById('exercise-container');
    if (container) {
        container.after(resultDiv);
    }
    resultDiv.scrollIntoView({ behavior: 'smooth' });

    const btn = document.getElementById("checkBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "✔ נבדק";
        btn.style.background = "gray";
        btn.style.cursor = "not-allowed";
    }

    // עדכון ההתקדמות מבוסס ה-IDs
    updateProgressWithCorrectIds(exId, correctQuestionIds);
};

// --- מנגנון חישוב התקדמות משוקלל ואמיתי המבוסס על סך השאלות בבנק ---
async function updateProgressWithCorrectIds(exId, correctIdsInThisRun) {
    const user = auth.currentUser;
    if (!user) return;

    const allQuestionsInExercise = window.questionsBank[exId];
    if (!allQuestionsInExercise || allQuestionsInExercise.length === 0) return;

    const topic = allQuestionsInExercise[0].topic;
    const subtopic = allQuestionsInExercise[0].subtopic;

    if (!window.playerStats.correctQuestionsTrack) window.playerStats.correctQuestionsTrack = [];
    if (!window.playerStats.subProgress) window.playerStats.subProgress = {};
    if (!window.playerStats.progress) window.playerStats.progress = {};

    // הוספת השאלות החדשות שנפתרו נכון (מניעת כפילויות)
    correctIdsInThisRun.forEach(id => {
        if (!window.playerStats.correctQuestionsTrack.includes(id)) {
            window.playerStats.correctQuestionsTrack.push(id);
        }
    });

    // מציאת כל השאלות ששייכות לתת-הנושא הספציפי הזה בכל רחבי ה-questionsBank
    let allExpectedIdsForSubtopic = [];
    Object.keys(window.questionsBank).forEach(key => {
        window.questionsBank[key].forEach(q => {
            if (q.subtopic === subtopic && q.id) {
                allExpectedIdsForSubtopic.push(q.id);
            }
        });
    });

    // סינון כפילויות של שאלות באותו תת נושא (ליתר ביטחון)
    allExpectedIdsForSubtopic = [...new Set(allExpectedIdsForSubtopic)];

    const userCorrectIdsForSubtopic = window.playerStats.correctQuestionsTrack.filter(id => 
        allExpectedIdsForSubtopic.includes(id)
    );

    // חישוב אחוזי התקדמות מדויקים
    const totalQuestionsCount = allExpectedIdsForSubtopic.length || 1;
    const subtopicScore = Math.round((userCorrectIdsForSubtopic.length / totalQuestionsCount) * 100);
    window.playerStats.subProgress[subtopic] = subtopicScore;

    // חישוב ממוצע הנושא הראשי
    const subtopicsInTopic = physicsStructure[topic].subtopics;
    let totalTopicScore = 0;
    subtopicsInTopic.forEach(sub => {
        totalTopicScore += (window.playerStats.subProgress[sub] || 0);
    });
    const newTopicScore = Math.round(totalTopicScore / subtopicsInTopic.length);
    window.playerStats.progress[topic] = newTopicScore;

    // שמירה מעודכנת ל-Firestore
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            correctQuestionsTrack: window.playerStats.correctQuestionsTrack,
            subProgress: window.playerStats.subProgress,
            progress: window.playerStats.progress
        }, { merge: true });
        console.log(`Progress updated for ${subtopic}: ${subtopicScore}%`);
    } catch (error) {
        console.error("Error updating score to DB:", error);
    }
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

function translateSubtopic(sub) {
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
    return dict[sub] || sub;
}

/* =========================================
   7. פונקציות לוגיקה כלליות
   ========================================= */

window.handleSubjectClick = function(subId) {
    if (pageMode === 'exercises') {
        window.router('exercise_list', subId);
    } else {
        window.router('content_list', subId);
    }
};
    
window.handleCategoryClick = function(catId) {
    if (catId === 'explanations' || catId === 'exercises') {
        window.router('subject_select', catId);
    } else {
        alert('קטגוריה זו בבנייה כרגע...');
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
                    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                    await updateProfile(userCredential.user, { displayName: name });
                    
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
                        correctQuestionsTrack: [],
                        progress: { mechanics: 0, electricity: 0, radiation: 0 }
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
            subProgress: data.subProgress || {},
            progress: data.progress || { mechanics: 0, electricity: 0, radiation: 0 },
            correctQuestionsTrack: data.correctQuestionsTrack || [] 
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

    setTimeout(() => {
        if (window.initPhysicsWaves) {
            window.initPhysicsWaves("wave-mechanics", "#60a5fa", 0.015, 20);
            window.initPhysicsWaves("wave-electricity", "#fbbf24", 0.025, 15);
            window.initPhysicsWaves("wave-radiation", "#a78bfa", 0.01, 25);
        }
    }, 100);
}

onAuthStateChanged(auth, async (user) => {
    const authModal = document.getElementById('auth-modal');
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');

    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

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
                correctQuestionsTrack: []
            });
        }

        if(authModal) authModal.style.display = 'none';
        if(userProfile) userProfile.style.display = 'flex';
        if(loginBtn) loginBtn.style.display = 'none';
        if(xpWidget) xpWidget.style.display = 'flex';

        document.getElementById('user-name-display').innerText = user.displayName || user.email;

        await loadStatsFromDB(user.uid);
        listenToLeaderboard();
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

   // --- פתיחת חלון ניהול התקדמות למשתמש ספציפי ---
window.openProgressManagementModal = function(uid, name) {
    // יצירת אלמנט המודאל במידה ואינו קיים ב-DOM
    let modal = document.getElementById('progress-manage-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'progress-manage-modal';
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:4000; direction:rtl;";
        document.body.appendChild(modal);
    }

    // תוכן החלון הקטן עם האפשרויות
    modal.innerHTML = `
        <div style="background:white; padding:30px; border-radius:20px; width:400px; box-shadow:0 10px 30px rgba(0,0,0,0.3); text-align:right;">
            <h3 style="margin-top:0; border-bottom:2px solid #f1f5f9; padding-bottom:10px; color:#1e293b;">
                ⚙️ ניהול התקדמות: ${name}
            </h3>
            
            <p style="font-weight:bold; margin-bottom:5px; color:#64748b; font-size:0.9rem;">בחר נושא / תת-נושא לפעולה:</p>
            <select id="progress-topic-select" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:20px; font-weight:600;">
                <option value="all">--- כל האתר (איפוס גלובלי) ---</option>
                <optgroup label="נושאים ראשיים">
                    <option value="topic_mechanics">מכניקה (ראשי)</option>
                    <option value="topic_electricity">חשמל ומגנטיות (ראשי)</option>
                    <option value="topic_radiation">קרינה וחומר (ראשי)</option>
                </optgroup>
                <optgroup label="תתי-נושאים">
                    <option value="sub_kinematics">קינמטיקה</option>
                    <option value="sub_dynamics">דינמיקה</option>
                    <option value="sub_gravity">כבידה</option>
                    <option value="sub_energy">עבודה ואנרגיה</option>
                    <option value="sub_momentum">תנע</option>
                    <option value="sub_electrostatics">אלקטרוסטטיקה</option>
                    <option value="sub_circuits">מעגלים חשמליים</option>
                </optgroup>
            </select>

            <div style="display:flex; flex-direction:column; gap:10px;">
                <button onclick="executeProgressAction('${uid}', 'reset')" 
                    style="width:100%; padding:12px; background:#ef4444; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition:opacity 0.2s;">
                    ❌ איפוס ההתקדמות שנבחרה ל-0%
                </button>
                
                <button onclick="executeProgressAction('${uid}', 'add_10')" 
                    style="width:100%; padding:12px; background:#10b981; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition:opacity 0.2s;">
                    📈 העלאה ב-10% (לנושא/תת-נושא שנבחר)
                </button>

                <button onclick="executeProgressAction('${uid}', 'set_100')" 
                    style="width:100%; padding:12px; background:#3b82f6; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition:opacity 0.2s;">
                    🎯 השלמה מלאה ל-100%
                </button>
            </div>

            <button onclick="closeProgressManagementModal()" 
                style="width:100%; margin-top:20px; padding:10px; background:#e2e8f0; color:#475569; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">
                סגור חלון
            </button>
        </div>
    `;
    modal.style.display = 'flex';
};

// --- סגירת המודאל ---
window.closeProgressManagementModal = function() {
    const modal = document.getElementById('progress-manage-modal');
    if (modal) modal.style.display = 'none';
};

// --- ביצוע הפעולה הנבחרת מול מסד הנתונים (Firestore) ---
window.executeProgressAction = async function(uid, action) {
    const select = document.getElementById('progress-topic-select');
    if (!select) return;

    const selection = select.value; // הערך שנבחר ב-Dropdown
    const userRef = doc(db, "users", uid);

    try {
        // טעינת הנתונים הנוכחיים של המשתמש כדי לבצע מניפולציה מדויקת
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
            alert("המשתמש לא נמצא במסד הנתונים.");
            return;
        }

        const data = snapshot.data();
        let subProgress = data.subProgress || {};
        let progress = data.progress || { mechanics: 0, electricity: 0, radiation: 0 };
        let correctQuestionsTrack = data.correctQuestionsTrack || [];

        // 1. ניתוח הבחירה (האם מדובר בנושא ראשי, תת נושא או הכל)
        if (selection === 'all') {
            if (action === 'reset') {
                subProgress = {};
                progress = { mechanics: 0, electricity: 0, radiation: 0 };
                correctQuestionsTrack = [];
            } else {
                alert("באיפוס גלובלי ניתן לבצע רק פעולת איפוס מלאה. להוספת אחוזים בחר נושא ספציפי.");
                return;
            }
        } 
        else if (selection.startsWith('topic_')) {
            const targetTopic = selection.replace('topic_', ''); // יחזיר mechanics, electricity או radiation
            
            if (action === 'reset') {
                progress[targetTopic] = 0;
                // איפוס תתי הנושאים ששייכים אליו
                physicsStructure[targetTopic].subtopics.forEach(sub => { subProgress[sub] = 0; });
            } else if (action === 'add_10') {
                progress[targetTopic] = Math.min(100, (progress[targetTopic] || 0) + 10);
            } else if (action === 'set_100') {
                progress[targetTopic] = 100;
                physicsStructure[targetTopic].subtopics.forEach(sub => { subProgress[sub] = 100; });
            }
        } 
        else if (selection.startsWith('sub_')) {
            const targetSub = selection.replace('sub_', ''); // יחזיר kinematics, dynamics וכדומה
            
            // מציאת הנושא האב של תת הנושא הזה כדי לעדכן אותו בהתאם לאחר מכן
            const parentTopic = Object.keys(physicsStructure).find(key => 
                physicsStructure[key].subtopics.includes(targetSub)
            );

            if (action === 'reset') {
                subProgress[targetSub] = 0;
                
                // הסינון המתוקן (בלי belongsToBelongsToSub):
                correctQuestionsTrack = correctQuestionsTrack.filter(id => {
                    let belongsToSub = false;
                    Object.keys(window.questionsBank).forEach(key => {
                        window.questionsBank[key].forEach(q => {
                            if (q.id === id && q.subtopic === targetSub) {
                                belongsToSub = true;
                            }
                        });
                    });
                    return !belongsToSub; // מחזיר אמת רק אם השאלה *לא* שייכת לתת-הנושא שמאופס
                });
            } else if (action === 'add_10') {
                subProgress[targetSub] = Math.min(100, (subProgress[targetSub] || 0) + 10);
            } else if (action === 'set_100') {
                subProgress[targetSub] = 100;
            }

            // עדכון אוטומטי של ממוצע הנושא הראשי על בסיס השינוי בתת הנושא
            if (parentTopic) {
                let totalTopicScore = 0;
                physicsStructure[parentTopic].subtopics.forEach(sub => {
                    totalTopicScore += (subProgress[sub] || 0);
                });
                progress[parentTopic] = Math.round(totalTopicScore / physicsStructure[parentTopic].subtopics.length);
            }
        }

        // 2. שמירת השינויים המעודכנים חזרה ל-Firestore
        await setDoc(userRef, {
            subProgress: subProgress,
            progress: progress,
            correctQuestionsTrack: correctQuestionsTrack
        }, { merge: true });

        alert("השינוי עודכן בהצלחה בבסיס הנתונים!");
        closeProgressManagementModal();
        loadAdminPage(); // רענון עמוד הניהול כדי להציג את השינויים מיד בטבלה

    } catch (error) {
        console.error("Error executing progress action:", error);
        alert("שגיאה בעדכון הנתונים: " + error.message);
    }
};

async function loadAdminPage() {
    const app = document.getElementById('app-container');
    app.innerHTML = '<div style="text-align:center; margin-top:50px;">טוען משתמשים... <i class="fa-solid fa-spinner fa-spin"></i></div>';
    const currentUser = auth.currentUser;

    try {
        const users = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => { users.push(doc.data()); });

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
                const isMe = currentUser && user.uid === currentUser.uid;
                let actionButtons = '';

                // 1. מייצרים את כפתורי הניהול הרגילים שזמינים לכולם (כולל לעצמך)
                actionButtons = `
                    <button class="action-btn" title="הגדרות התקדמות"
                        onclick="openProgressManagementModal('${user.uid}', '${user.name || 'תלמיד'}')">
                        ⚙️
                    </button>

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
                `;

                // 2. בדיקה: אם זה המשתמש הנוכחי שלי, נחסום רק את כפתור המחיקה
                if (isMe) {
                    // מוסיפים אינדיקציה קטנה ליד הכפתורים שזה החשבון שלך, ללא כפתור מחיקה
                    actionButtons += `<span style="font-size:0.8rem; color:#64748b; font-weight:bold; margin-right:5px;">(אני)</span>`;
                } else {
                    // אם זה משתמש אחר, מוסיפים לו גם את כפתור המחיקה הרגיל
                    actionButtons += `
                        <button class="action-btn delete-btn" title="מחק"
                            onclick="deleteUser('${user.uid}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    `;
                }

                // הגדרות ה-Badge עבור התפקיד
                const roleText = user.role === 'admin' ? 'מנהל' : 'תלמיד';
                const roleClass = user.role === 'admin' ? 'badge-admin' : 'badge-student';

                html += `
                    <tr>
                        <td><strong>${user.name || 'אנונימי'}</strong></td>
                        <td>${user.email}</td>
                        <td>${user.joinDate || ''}</td>
                        <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                        <td>${actionButtons}</td>
                    </tr>`;
            });
        }

        html += `</tbody></table><button class="btn-back" onclick="router('home')">חזרה לדף הבית</button></div>`;
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
        await setDoc(doc(db, "users", uid), { level: 1, currentXP: 0, xpNeeded: 100, totalXP: 0 }, { merge: true });
        alert("ה-XP אופס בהצלחה!");
        loadAdminPage();
    } catch (error) {
        console.error("Error resetting XP:", error);
        alert("שגיאה באיפוס XP");
    }
}
async function resetUserStars(uid) {
    if (!confirm("האם אתה בטוח שברצונך לאפס את הכוכבים?")) return;
    try {
        await setDoc(doc(db, "users", uid), { stars: 0 }, { merge: true });
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
        await updateDoc(userRef, { stars: currentStars + 1 });
        loadAdminPage();
    } catch (error) { console.error(error); }
}

async function decreaseUserStars(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;
        const currentStars = snap.data().stars || 0;
        await updateDoc(userRef, { stars: Math.max(0, currentStars - 1) });
        loadAdminPage();
    } catch (error) { console.error(error); }
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
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,#1e293b,#0f172a);">
            <!-- שינוי ל-form והוספת אירוע onsubmit שמונע רענון עמוד ומפעיל את הפונקציה -->
            <form onsubmit="verifyAdminPassword(event)" style="background:white; padding:40px; border-radius:20px; width:350px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
                <h2 style="margin-bottom:20px;">🔐 כניסת מנהל</h2>
                <input type="password" id="admin-password" placeholder="הזן סיסמת מנהל" style="width:100%; padding:10px; margin-bottom:15px; border-radius:10px; border:1px solid #ddd;" required>
                <!-- שינוי סוג הכפתור ל-submit כדי שיגיב ל-Enter באופן טבעי -->
                <button type="submit" style="width:100%; padding:10px; border:none; border-radius:10px; background:#3b82f6; color:white; font-weight:bold; cursor:pointer;">כניסה</button>
                <p id="admin-error" style="color:red; margin-top:10px;"></p>
            </form>
        </div>`;
}

window.verifyAdminPassword = function(event) {
    // מניעת רענון של העמוד (התנהגות ברירת המחדל של טפסים ב-HTML)
    if (event) event.preventDefault();

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
window.loadChatHistory = function() {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    messagesDiv.innerHTML = `
        <div class="chat-title">🤖 מרכז העזרה</div>
        <div class="chat-grid" id="chat-options">
            <div class="chat-card" onclick="showChatQuestions('technical')">🛠 <span>שאלות טכניות</span></div>
            <div class="chat-card" onclick="showChatQuestions('understanding')">🧠 <span>שאלות הבנה</span></div>
            <div class="chat-card" onclick="showChatQuestions('contact')">📩 <span>יצירת קשר</span></div>
        </div>`;
};

window.showChatQuestions = function(category) {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    // --- שלב א': תפריט נושאים ראשיים (מכניקה, חשמל, קרינה) ---
    if (category === 'understanding') {
        messagesDiv.innerHTML = `
            <button class="chat-back" onclick="window.loadChatHistory()">⬅ חזרה לתפריט הראשי</button>
            <div class="chat-title" style="font-size:1.1rem; margin-bottom:15px;">🧠 שאלות הבנה - בחר נושא גדול:</div>
            <div class="chat-grid" id="chat-options">
                <div class="chat-card" onclick="showChatQuestions('menu_mechanics')">⚙️ <span>מכניקה</span></div>
                <div class="chat-card" onclick="showChatQuestions('menu_electricity')">⚡ <span>חשמל ומגנטיות</span></div>
                <div class="chat-card" onclick="showChatQuestions('menu_radiation')">⚛️ <span>קרינה וחומר</span></div>
            </div>`;
        return;
    }

    // --- שלב ב': תפריטי תתי-נושאים ספציפיים המותאמים למיקוד החדש ---
    
    // 1. תתי-נושאים של מכניקה
    if (category === 'menu_mechanics') {
        messagesDiv.innerHTML = `
            <button class="chat-back" onclick="showChatQuestions('understanding')">⬅ חזרה</button>
            <div class="chat-title" style="font-size:1.05rem; margin-bottom:15px;">⚙️ מכניקה לבגרות - בחר פרק:</div>
            <div class="chat-grid" id="chat-options">
                <div class="chat-card" onclick="showChatQuestions('sub_kinematics')">🏃‍♂️ <span>1. קינמטיקה</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_dynamics')">🏋️‍♂️ <span>2. דינמיקה ומעגלית</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_momentum')">💥 <span>3. התנע ושימורו</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_energy')">⚡ <span>4. אנרגיה מכנית</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_gravity')">🌍 <span>5. כבידה</span></div>
            </div>`;
        return;
    }

    // 2. תתי-נושאים של חשמל ומגנטיות (מורחב לפי המיקוד)
    if (category === 'menu_electricity') {
        messagesDiv.innerHTML = `
            <button class="chat-back" onclick="showChatQuestions('understanding')">⬅ חזרה</button>
            <div class="chat-title" style="font-size:1.05rem; margin-bottom:15px;">⚡ חשמל ומגנטיות - בחר פרק:</div>
            <div class="chat-grid" id="chat-options">
                <div class="chat-card" onclick="showChatQuestions('sub_electrostatics')">⚡ <span>1. חוק קולון ושדה חשמלי</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_potential')">🔋 <span>2. פוטנציאל ומתח חשמלי</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_circuits')">🔌 <span>3. מעגלי זרם ישר</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_magnetism')">🧲 <span>4. השדה המגנטי ומקורותיו</span></div>
            </div>`;
        return;
    }

    // 3. תתי-נושאים של קרינה וחומר (מורחב לפי המיקוד)
    if (category === 'menu_radiation') {
        messagesDiv.innerHTML = `
            <button class="chat-back" onclick="showChatQuestions('understanding')">⬅ חזרה</button>
            <div class="chat-title" style="font-size:1.05rem; margin-bottom:15px;">⚛️ קרינה וחומר - בחר פרק:</div>
            <div class="chat-grid" id="chat-options">
                <div class="chat-card" onclick="showChatQuestions('sub_waves')">🌊 <span>1. גלים מכניים ואלקטרומגנטיים</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_photoelectric')">☀️ <span>2. האפקט הפוטואלקטרי</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_atomic')">🔬 <span>3. מבנה האטום</span></div>
                <div class="chat-card" onclick="showChatQuestions('sub_nuclear')">☢️ <span>4. הגרעין ומבוא לחלקיקים</span></div>
            </div>`;
        return;
    }

    // --- שלב ג': טעינת השאלות בפועל לכל תת-נושא ---
    let questions = [];
    let backAction = "window.loadChatHistory()";

    // שאלות כלליות/טכניות
    if (category === 'technical') { 
        questions = ["איך אני מתחבר לאתר?", "למה התרגילים לא נשמרים?", "איך מאפסים XP?", "איך עובדת מערכת הרמות וה-XP?", "איך אני מקבל כוכבים (Stars)?", "מצאתי באג באתר, מה לעשות?"]; 
    } else if (category === 'contact') { 
        questions = ["איך אפשר ליצור קשר?", "איך מדווחים על בעיה?"]; 
    }
    
    // --- שאלות מכניקה ---
    // --- שאלות מכניקה (מורחב: 13 שאלות לכל פרק) ---
    else if (category === 'sub_kinematics') {
        questions = [
            "מה ההבדל בין העתק למרחק?", "מהי תאוצה קבועה?", "מה ההבדל בין נפילה חופשית לזריקה אנכית?",
            "מהי מהירות ממוצעת לעומת מהירות רגעית?", "מה המשמעות הפיזיקלית של תאוצה שלילית?", "האם ייתכן שגוף ישנה את כיוון תנועתו אך תאוצתו תישאר קבועה?",
            "מהי מערכת צירים (מערכת ייחוס) ומדוע היא הכרחית בקינמטיקה?", "מהי תנועה קצובה בקו ישר?", "כיצד מוגדר רגע תחילת התנועה (t=0)?",
            "מה ההבדל בין גודל סקלרי לגודל וקטורי בקינמטיקה?", "כיצד משפיעה התנגדות האוויר על תאוצת הגוף בנפילה חופשית?", "מהו המושג 'נקודת חומר' (גוף נקודתי) ומתי משתמשים בו?",
            "מה אומר לנו מפגש בין שני קווים בגרף מקום-זמן?"
        ];
        backAction = "showChatQuestions('menu_mechanics')";
    }
    else if (category === 'sub_dynamics') {
        questions = [
            "מה אומר חוק שני של ניוטון?", "מה ההבדל בין מסה למשקל?", "מהי תנועה מעגלית קצובה ומהו כוח צנטריפטלי?",
            "מה קובע החוק הראשון של ניוטון?", "מה קובע החוק השלישי של ניוטון?", "מה ההבדל בין חיכוך סטטי לחיכוך קינטי?",
            "באילו תנאים פועל כוח נורמל?", "מהו כוח קפיץ ומהו חוק הוק?", "מה כיוון וקטור המהירות בתנועה מעגלית?",
            "מדוע כוח צנטריפטלי לא משנה את גודל המהירות?", "מהו מקדם חיכוך וממה הוא מושפע?", "מהי מערכת ייחוס אינרציאלית?",
            "מהי תדירות ומהו זמן מחזור בתנועה מעגלית?"
        ];
        backAction = "showChatQuestions('menu_mechanics')";
    }
    else if (category === 'sub_momentum') {
        questions = [
            "מה זה תנע?", "מהו מתקף?", "מה אומר חוק שימור התנע בקו ישר?",
            "מהו כוח פנימי וכוח חיצוני במערכת?", "מהי התנגשות פלסטית?", "מהי התנגשות אלסטית לחלוטין?",
            "באילו תנאים מותר להשתמש בחוק שימור התנע?", "מה הקשר בין חוקי ניוטון לשימור תנע?", "מה מייצג השטח בגרף כוח כפונקציה של זמן?",
            "מהי התנגשות מצחית לעומת התנגשות זוויתית?", "מה קורה לתנע הכולל בפיצוץ של גוף סטטי?", "כיצד מערכת ה-Airbag ברכב מפחיתה את עוצמת הפגיעה לפי מושג המתקף?",
            "האם ייתכן שלשני גופים בעלי מסה שונה יהיה תנע זהה?"
        ];
        backAction = "showChatQuestions('menu_mechanics')";
    }
    else if (category === 'sub_energy') {
        questions = [
            "מהי עבודה של כוח בפיזיקה?", "מהן אנרגיה קינטית ואנרגיה פוטנציאלית כובדית?", "מתי מתקיים חוק שימור האנרגיה המכנית?",
            "מהו כוח משמר וכוח לא משמר?", "מהי אנרגיה פוטנציאלית אלסטית?", "מהו המושג 'הספק' (Power) בפיזיקה?",
            "מהו משפט עבודה-אנרגיה (אנרגיה קינטית)?", "לאן נעלמת האנרגיה המכנית כאשר פועל כוח חיכוך?", "מדוע כוח נורמל או כוח מתיחות בחוט לפעמים אינם מבצעים עבודה?",
            "מה ההבדל בין אנרגיה לבין כוח?", "כיצד מוגדרת נצילות של מערכת מכנית?", "מהי אנרגיה מכנית כוללת?",
            "מדוע עבודה של כוח משמר במסלול סגור שווה לאפס?"
        ];
        backAction = "showChatQuestions('menu_mechanics')";
    }
    else if (category === 'sub_gravity') {
        questions = [
            "מהו חוק המשיכה האוניברסלי של ניוטון?", "איך מוצאים את מהירות הלוויין המקיף כוכב לכת?",
            "מהו שדה כבידה וכיצד הוא מוגדר?", "מה ההבדל בין קבוע הכבידה העולמי G לבין תאוצת הכובד g?", "מהו חוק קפלר הראשון?",
            "מהו חוק קפלר השני (חוק השטחים)?", "מהו חוק קפלר השלישי (חוק המחזורים)?", "מהי מהירות מילוט?",
            "מהו לוויין גיאוסטציונרי?", "כיצד משתנה תאוצת הכובד g ככל שעולים לגובה מעל פני כדור הארץ?", "מהי אנרגיה פוטנציאלית כבידתית אוניברסלית ומדוע היא שלילית?",
            "מדוע אסטרונאוטים בתחנת החלל חשים חוסר משקל למרות שיש שם כבידה?", "מהו מסלול מעגלי של לוויין ומאיזה כוח הוא נובע?"
        ];
        backAction = "showChatQuestions('menu_mechanics')";
    }
    
    // --- שאלות חשמל ומגנטיות (החלוקה החדשה) ---
    else if (category === 'sub_electrostatics') {
        questions = ["מהו חוק קולון?", "מה זה שדה חשמלי?", "מהם קווי שדה חשמלי?"];
        backAction = "showChatQuestions('menu_electricity')";
    }
    else if (category === 'sub_potential') {
        questions = ["איך מוגדר פוטנציאל חשמלי בנקודה?", "מהו משטח שווה פוטנציאל?", "מהו שדה חשמלי אחיד?"];
        backAction = "showChatQuestions('menu_electricity')";
    }
    else if (category === 'sub_circuits') {
        questions = ["מהו חוק אוהם במעגלים חשמליים?", "מה ההבדל בין חיבור בטור לחיבור במקביל?", "מהו מתח הדקים?"];
        backAction = "showChatQuestions('menu_electricity')";
    }
    else if (category === 'sub_magnetism') {
        questions = ["מהו כוח לורנץ ואיך קובעים את כיוונו?", "מהו כוח אמפר?", "כיצד יוצר זרם ישר שדה מגנטי סביב תיל?"];
        backAction = "showChatQuestions('menu_electricity')";
    }

    // --- שאלות קרינה וחומר (החלוקה החדשה) ---
    else if (category === 'sub_waves') {
        questions = ["מהו גל מכני ומהו גל רוחב/אורך?", "מהו הקשר בין מהירות הגל, תדירותו ואורך הגל?", "מהו גואל אלקטרומגנטי ומהו ספקטרום האור?"];
        backAction = "showChatQuestions('menu_radiation')";
    }
    else if (category === 'sub_photoelectric') {
        questions = ["מהו האפקט הפוטואלקטרי (קרינה וחומר)?", "מהי פונקציית עבודה של מתכת?", "מה הנוסחה של איינשטיין לאפקט הפוטואלקטרי?"];
        backAction = "showChatQuestions('menu_radiation')";
    }
    else if (category === 'sub_atomic') {
        questions = ["מהם מודלי האטום המרכזיים?", "מה קורה כשאלקטרון עובר בין רמות אנרגיה?", "מהי אנרגיית יינון ורמת יסוד?"];
        backAction = "showChatQuestions('menu_radiation')";
    }
    else if (category === 'sub_nuclear') {
        questions = ["מהם כוחות הגרעין החזקים?", "מהו תהליך רדיואקטיבי ומהם קרינות אלפא, בטא וגמא?", "מהו תהליך ביקוע ומיזוג גרעיני?"];
        backAction = "showChatQuestions('menu_radiation')";
    }

    // --- רינדור השאלות על המסך ---
    messagesDiv.innerHTML = `
        <button class="chat-back" onclick="${backAction}">⬅ חזרה</button>
        <div class="chat-grid" id="chat-options">
            ${questions.map(q => `<div class="chat-question" onclick="handleChatAnswer('${q}')">${q}</div>`).join('')}
        </div>`;
};

window.handleChatAnswer = function(question) {
    const options = document.getElementById("chat-options");
    if (options) { options.classList.add("hidden"); }

    addChatMessage(question, false);
    const typing = showTypingIndicator();

    setTimeout(() => {
        typing.remove();
        let response = "";

        // =========================================
        // 1. תשובות לשאלות טכניות ויצירת קשר
        // =========================================
        if (question === "איך אני מתחבר לאתר?") {
            response = "לחיצה על כפתור התחברות בראש המסך תפתח חלונית. אם אין לך חשבון, תוכל לעבור לטאב 'יצירת חשבון' ולהירשם עם אימייל וסיסמה.";
        }
        else if (question === "למה התרגילים לא נשמרים?") {
            response = "כדי שההתקדמות והציונים שלך יישמרו במסד הנתונים, עליך להיות מחובר לחשבון המשתמש שלך בזמן פתרון התרגילים!";
        }
        else if (question === "איך מאפסים XP?") {
            response = "איפוס XP, כוכבים או התקדמות כללית של תלמידים יכול להתבצע אך ורק על ידי מנהל המערכת (Admin) דרך דף הניהול המאובטח.";
        }
        else if (question === "איך עובדת מערכת הרמות וה-XP?") {
            response = "על כל שאלה שאתה פותר נכון בתרגול, אתה מקבל 100 XP! בכל פעם שאתה צובר מספיק XP (למשל 100 רמה ראשונה, 200 רמה שנייה), אתה עולה רמה (Level Up) ומקבל אפקטים מדליקים!";
        }
        else if (question === "איך אני מקבל כוכבים (Stars)?") {
            response = "כוכבים מוענקים אוטומטית כשאתה מגיע להישגים (כמו הגעה לרמות 5, 10 ו-20). בנוסף, מנהל האתר יכול להעניק לך כוכבים כבונוס על דיווח באגים או הצטיינות!";
        }
        else if (question === "מצאתי באג באתר, מה לעשות?") {
            response = "איזה כיף! גלול לתחתית דף הבית לחלק 'צור קשר', שלח לנו דיווח מפורט, ואם הבאג איכותי המנהל יצפר אותך בכוכבים! 🐞";
        }
        else if (question.includes("צור קשר") || question.includes("דיווח")) {
            response = "תוכל ליצור איתנו קשר ישיר דרך הטופס שבתחתית דף הבית, או לשלוח מייל לכתובת התמיכה שלנו. נחזור אליך בהקדם!";
        }

        // =========================================
        // 2. מכניקה -> קינמטיקה (10 שאלות)
        // =========================================
        else if (question === "מה זה קינמטיקה?") {
            response = "קינמטיקה היא ענף במכניקה המתאר את תנועתם של גופים במרחב (מיקום, מהירות, תאוצה וזמן) מבלי להתחשב בכוחות הגורמים לתנועה זו.";
        }
        else if (question === "מה ההבדל בין העתק למרחק?") {
            response = "מרחק הוא האורך הכולל של המסלול שעבר הגוף (גודל סקלרי, תמיד חיובי). העתק הוא המרחק בקו ישר בין נקודת ההתחלה לנקודת הסוף כולל כיוון (גודל וקטורי, יכול להיות חיובי, שלילי או אפס).";
        }
        else if (question === "מהי תאוצה קבועה?") {
            response = "תאוצה קבועה פירושה שמהירות הגוף משתנה בקצב קבוע בכל יחידת זמן. בגרף מהירות-זמן, תנועה זו מיוצגת על ידי קו ישר שהשיפוע שלו הוא התאוצה.";
        }
        else if (question === "מה ההבדל בין נפילה חופשית לזריקה אנכית?") {
            response = "בשני המקרים הגוף נע בתאוצת הכובד g כלפי מטה בהשפעת כוח הכובד בלבד. בנפילה חופשית הגוף משוחרר ממנוחה (מהירות תחילית אפס), ובזריקה אנכית הוא מוקנה במהירות תחילית כלפי מעלה או כלפי מטה.";
        }
        else if (question === "מה מייצג שיפוע בגרף מקום-זמן?") {
            response = "השיפוע של המשיק לגרף מקום כפונקציה של זמן (x כנגד t) מייצג את המהירות הרגעית של הגוף באותו רגע.";
        }
        else if (question === "מה מייצג שיפוע בגרף מהירות-זמן?") {
            response = "השיפוע של גרף מהירות כפונקציה של זמן (v כנגד t) מייצג את התאוצה של הגוף באותו קטע תנועה.";
        }
        else if (question === "מה מייצג השטח מתחת לגרף מהירות-זמן?") {
            response = "השטח הכלוא בין קו הגרף לציר הזמן בגרף מהירות-זמן (v כנגד t) מייצג את ההעתק (Δx) שעבר הגוף בפרק הזמן שנבחר.";
        }
        else if (question === "האם לגוף יכולה להיות מהירות אפס ותאוצה שאינה אפס?") {
            response = "כן! למשל, כשזורקים גוף אנכית מעלה, בנקודה הגבוהה ביותר שלו (שיא הגובה) המהירות מתאפסת לרגע, אך תאוצת הכובד g עדיין פועלת עליו ושווה ל-10m/s² כלפי מטה.";
        }
        else if (question === "מה כיוון תאוצת הכובד בזמן זריקה מעלה?") {
            response = "תאוצת הכובד g פונה תמיד כלפי מטה (למרכז כדור הארץ), ללא קשר לשאלה אם הגוף נמצא בתנועה כלפי מעלה, בתנועה כלפי מטה או נמצא לרגע במנוחה בשיא הגובה.";
        }
        else if (question === "מהי מהירות רגעית?") {
            response = "מהירות רגעית היא המהירות של הגוף ברגע ספציפי אחד ויחיד (בפרק זמן השואף לאפס), בניגוד למהירות ממוצעת שמחושבת על פני קטע תנועה שלם.";
        }
        else if (question === "מהי מהירות ממוצעת לעומת מהירות רגעית?") {
            response = "מהירות ממוצעת מחושבת כסך כל ההעתק חלקי סך כל זמן התנועה. מהירות רגעית היא המהירות של הגוף ברגע ספציפי אחד (בפרק זמן השואף לאפס), והיא שווה לשיפוע המשיק בגרף מקום-זמן.";
        }
        else if (question === "מה המשמעות הפיזיקלית של תאוצה שלילית?") {
            response = "תאוצה שלילית פירושה שוקטור התאוצה פונה כנגד הכיוון החיובי שהגדרנו לציר. אם הגוף נע בכיוון החיובי, תאוצה שלילית תגרום להאטה. אם הגוף נע בכיוון השלילי, תאוצה שלילית תגרום להאצה (מהירותו תהפוך לשלילית וגדולה יותר בערכה המוחלט).";
        }
        else if (question === "האם ייתכן שגוף ישנה את כיוון תנועתו אך תאוצתו תישאר קבועה?") {
            response = "כן, בהחלט! דוגמה קלאסית היא זריקה אנכית מעלה: הגוף עולה (מהירות חיובית), נעצר לרגע בשיא הגובה, ויורד (מהירות שלילית). לאורך כל התנועה פועלת עליו תאוצת כובד קבועה g כלפי מטה.";
        }
        else if (question === "מהי מערכת צירים (מערכת ייחוס) ומדוע היא הכרחית בקינמטיקה?") {
            response = "מערכת ייחוס היא נקודת המבט שממנה מודדים מיקום וזמן. בלי להגדיר נקודת ראשית (0,0) וכיוון חיובי לציר, למושגים כמו 'מיקום', 'מהירות' ו'העתק' אין משמעות פיזיקלית קבועה, שכן תנועה היא תמיד יחסית.";
        }
        else if (question === "מהי תנועה קצובה בקו ישר?") {
            response = "תנועה קצובה בקו ישר היא תנועה שבה הגוף עובר מרחקים שווים בפרקי זמן שווים, ללא שינוי בכיוון. בתנועה זו המהירות קבועה לחלוטין (הן בגודל והן בכיוון), ולכן התאוצה שווה לאפס.";
        }
        else if (question === "כיצד מוגדרת רגע תחילת התנועה (t=0)?") {
            response = "הרגע t=0 הוא נקודת הזמן השרירותית שבה אנו בוחרים להפעיל את שעון העצר (סטופר) כדי לעקוב אחר התנועה. הוא אינו מייצג את תחילת הזמן ביקום, אלא את ראשית ציר הזמן של הניסוי שלנו.";
        }
        else if (question === "מה ההבדל בין גודל סקלרי לגודל וקטורי בקינמטיקה?") {
            response = "גודל סקלרי מוגדר ע\"י ערך מספרי ויחידות מידה בלבד (למשל: זמן של 5 שניות, מרחק של 20 מטר). גודל וקטורי דורש גם ערך מספרי וגם כיוון במרחב (למשל: העתק של 20 מטר צפונה, מהירות של 5 מטר לשנייה שמאלה).";
        }
        else if (question === "כיצד משפיעה התנגדות האוויר על תאוצת הגוף בנפילה חופשית?") {
            response = "בנפילה חופשית אידיאלית (בואקום) התאוצה קבועה ושווה ל-g. בנוכחות אוויר, פועל כוח התנגדות שגדל עם המהירות ופונה מעלה. כוח זה מקטין את שקול הכוחות מטה, ולכן תאוצת הגוף הולכת וקטנה עד שהיא מגיעה לאפס (בשלב זה הגוף מגיע ל'מהירות טרמינלית' קבועה).";
        }
        else if (question === "מהו המושג 'נקודת חומר' (גוף נקודתי) ומתי משתמשים בו?") {
            response = "גוף נקודתי הוא מודל פיזיקלי המניח שכל מסת הגוף מרוכזת בנקודה אחת במרחב, תוך התעלמות מממדיו הגאומטריים וצורתו. משתמשים במודל זה כאשר מרחקי התנועה גדולים משמעותית מגודל הגוף עצמו (למשל, כדור הארץ המקיף את השמש).";
        }
        else if (question === "מה אומר לנו מפגש בין שני קווים בגרף מקום-זמן?") {
            response = "נקודת חיתוך (מפגש) בין שני קווים בגרף מקום-זמן מייצגת אירוע שבו שני הגופים נמצאים **באותו מקום בדיוק ובאותו רגע בדיוק** – כלומר, זהו רגע העקיפה או המפגש ביניהם.";
        }

        // =========================================
        // 3. מכניקה -> דינמיקה ותנועה מעגלית (10 שאלות)
        // =========================================
        else if (question === "מה אומר חוק שני של ניוטון?") {
            response = "החוק השני של ניוטון קובע כי שקול הכוחות (ΣF) הפועל על גוף שווה למכפלת מסתו בתאוצה שלו (ΣF = m * a). כיוון וקטור התאוצה זהה תמיד לכיוון שקול הכוחות.";
        }
        else if (question === "מה ההבדל בין מסה למשקל?") {
            response = "מסה היא כמות החומר שיש בגוף והיא קבועה בכל מקום ביקום (נמדדת ב-kg). משקל הוא כוח הכבידה שפועל על הגוף (W = m * g) והוא משתנה בהתאם לגרם השמיים עליו הגוף נמצא (נמדד ב-N).";
        }
        else if (question === "מהי תנועה מעגלית קצובה ומהו כוח צנטריפטלי?") {
            response = "תנועה מעגלית קצובה היא תנועה במסלול מעגלי ברדיוס קבוע ובמהירות קבועה בגודלה (אך כיוונה משתנה). כוח צנטריפטלי אינו כוח פיזיקלי חדש, אלא תפקיד שממלא שקול הכוחות המופנה למרכז המעגל ומאלץ את הגוף להסתובב.";
        }
        else if (question === "מה קובע החוק הראשון של ניוטון?") {
            response = "חוק ההתמדה קובע כי גוף ישאר במצבו (מנוחה או תנועה במהירות קבועה בקו ישר) כל עוד שקול הכוחות החיצוניים הפועלים עליו שווה לאפס (ΣF=0).";
        }
        else if (question === "מה קובע החוק השלישי של ניוטון?") {
            response = "חוק הפעולה והתגובה קובע כי אם גוף א' מפעיל כוח על גוף ב', גוף ב' מפעיל בו-זמנית כוח שווה בעוצמתו והפוך בכיוונו על גוף א'. הכוחות פועלים על גופים שונים ולכן לעולם לא יקזזו זה את זה.";
        }
        else if (question === "מה ההבדל בין חיכוך סטטי לחיכוך קינטי?") {
            response = "חיכוך סטטי פועל בין משטחים שאינם נעים זה יחסית לזה, ועוצמתו משתנה כדי למנוע תנועה (עד לערך מקסימלי). חיכוך קינטי פועל בזמן שיש תנועה יחסית והחלקה בין המשטחים, והוא בעל ערך קבוע.";
        }
        else if (question === "באילו תנאים פועל כוח נורמל?") {
            response = "כוח נורמל פועל כאשר גוף נמצא במגע ונדחף כנגד משטח קשיח. כיוון הכוח הוא תמיד מאונך (ניצב) החוצה ממשטח המגע.";
        }
        else if (question === "מהו כוח קפיץ ומהו חוק הוק?") {
            response = "כוח קפיץ הוא כוח מחזיר הפועל בכיוון הפוך לעיוות הקפיץ. חוק הוק קובע כי גודל הכוח נמצא ביחס ישר למידת התארכות או התקצרות הקפיץ (F = k * x), כאשר k הוא קבוע קשיחות הקפיץ.";
        }
        else if (question === "מה כיוון וקטור המהירות בתנועה מעגלית?") {
            response = "וקטור המהירות בתנועה מעגלית פונה תמיד בכיוון המשיק למסלול המעגלי בכל נקודה ונקודה, והוא מאונך לחלוטין לרדיוס המעגל המתוח לאותה נקודה.";
        }
        else if (question === "מדוע כוח צנטריפטלי לא משנה את גודל המהירות?") {
            response = "מכיוון שהכוח הצנטריפטלי פונה תמיד למרכז המעגל, הוא מאונך לחלוטין לוקטור המהירות המשיקית. כוח שמאונך לתנועה אינו מבצע עבודה ולכן משנה רק את כיוון המהירות ולא את גודלה.";
        }
        else if (question === "מהו מקדם חיכוך וממה הוא מושפע?") {
            response = "מקדם החיכוך (μ) הוא גודל סקלרי ללא יחידות המבטא את מידת 'החיספוס' בין שני משטחים הנמצאים במגע. הוא נקבע אך ורק לפי סוג החומרים מהם עשויים המשטחים (למשל גומי על אספלט לעומת קרח על מתכת) ואינו תלוי בשטח המגע.";
        }
        else if (question === "מהי מערכת ייחוס אינרציאלית?") {
            response = "מערכת ייחוס אינרציאלית (מערכת התמד) היא מערכת שבה חוקי ניוטון מתקיימים ככתבם וכלשונם ללא צורך בהמצאת 'כוחות מדומים'. זוהי מערכת שנמצאת במנוחה או נעה במהירות קבועה בקו ישר ביחס לכוכבי השבת (למשל, מעבדה נייחת על כדור הארץ בקירוב טוב).";
        }
        else if (question === "מהי תדירות ומהו זמן מחזור בתנועה מעגלית?") {
            response = "זמן מחזור (T) הוא הזמן הנדרש לגוף להשלים סיבוב אחד מלא (נמדד בשניות). תדירות (f) היא מספר הסיבובים המלאים שהגוף מבצע ביחידת זמן אחת (נמדדת בהרץ, Hz או 1/sec). הקשר ביניהם הפוך: f = 1/T.";
        }

        // =========================================
        // 4. מכניקה -> התנע ושימורו (10 שאלות)
        // =========================================
        else if (question === "מה זה תנע?") {
            response = "תנע (p) הוא גודל וקטורי המודד את 'כמות התנועה' של הגוף, והוא מוגדר כמכפלת המסה של הגוף במהירות שלו (p = m * v). כיוון התנע זהה תמיד לכיוון וקטור המהירות.";
        }
        else if (question === "מהו מתקף?") {
            response = "מתקף (J) הוא גודל וקטורי המודד את פעולת הכוח לאורך זמן ומחשבים אותו כמכפלת הכוח הממוצע בזמן הפעלתו (J = F * Δt). לפי משפט מתקף-תנע: J = Δp (המתקף שווה לשינוי בתנע).";
        }
        else if (question === "מה אומר חוק שימור התנע בקו ישר?") {
            response = "חוק שימור התנע קובע כי אם שקול הכוחות החיצוניים הפועלים על מערכת גופים שווה לאפס (או זניח), התנע הכולל של המערכת לאורך קו התנועה נשאר קבוע בזמן (סכום התנעים לפני האירוע שווה לסכום התנעים אחריו).";
        }
        else if (question === "מהו כוח פנימי וכוח חיצוני במערכת?") {
            response = "כוח פנימי הוא כוח שגופים השייכים למערכת מפעילים זה על זה (למשל כוח ההתנגשות ביניהם). כוח חיצוני מופעל על ידי גוף מחוץ למערכת המוגדרת (למשל כוח חיכוך עם הרצפה או כוח כובד).";
        }
        else if (question === "מהי התנגשות פלסטית?") {
            response = "התנגשות פלסטית היא התנגשות שבה הגופים נצמדים או מתלכדים זה לזה לאחר המפגש ונעים יחד כגוף אחד בעל מסה משותפת (M = m1 + m2). בהתנגשות זו חלק מהאנרגיה המכנית הופך לחום.";
        }
        else if (question === "מהי התנגשות אלסטית לחלוטין?") {
            response = "התנגשות אלסטית לחלוטין היא התנגשות שבה לא נגרם נזק קבוע או חום לגופים, כך שגם התנע הכולל וגם האנרגיה הקינטית הכוללת של המערכת נשמרים באופן מלא.";
        }
        else if (question === "באילו תנאים מותר להשתמש בחוק שימור התנע?") {
            response = "מותר להשתמש בחוק כאשר שקול הכוחות החיצוניים שווה לאפס (ΣF_ext = 0), או כאשר אירוע (כמו פיצוץ או התנגשות) מתרחש בפרק זמן אפסי וקצר מאוד (Δt≈0) כך שמתקף הכוחות החיצוניים זניח.";
        }
        else if (question === "מה הקשר בין חוקי ניוטון לשימור תנע?") {
            response = "חוק שימור התנע נובע ישירות מהחוק השלישי של ניוטון: מכיוון שזוג כוחות פנימיים שווים ומנוגדים פועלים באותו פרק זמן בדיוק, המתקפים שלהם מקזזים זה את זה, והתנע הכולל של המערכת לא משתנה.";
        }
        else if (question === "מה מייצג השטח בגרף כוח כפונקציה של זמן?") {
            response = "השטח הכלוא מתחת לקו הגרף בצירים של כוח (F) כפונקציה של זמן (t) מייצג את המתקף (J) שפעל על הגוף, ובהתאם לכך גם את השינוי בתנע שלו.";
        }
        else if (question === "מה מייצג השטח בגרף כוח כפונקציה של זמן?") {
            response = "השטח הכלוא בין קו הגרף לציר הזמן בגרף כוח כנגד זמן (F כנגד t) מייצג את המתקף (J) של הכוח, ששווה לפי משפט מתקף-תנע לשינוי בתנע הכולל של הגוף (Δp).";
        }
        else if (question === "מהי התנגשות מצחית לעומת התנגשות זוויתית?") {
            response = "התנגשות מצחית (חד-ממדית) מתרחשת כאשר וקטורי המהירות של הגופים לפני ואחרי האירוע נמצאים על אותו קו ישר אחד. התנגשות זוויתית (דו-ממדית) מתרחשת כאשר הגופים מתפזרים בזוויות שונות במרשור, ואז יש לנתח את שימור התנע באמצעות פירוק לרכיבי X ו-Y.";
        }
        else if (question === "מה קורה לתנע הכולל בפיצוץ של גוף סטטי?") {
            response = "אם גוף נמצא במנוחה ותנעו אפס, ולאחר פיצוץ פנימי הוא מתפרק לחלקים, התנע הכולל של כל הרסיסים יחד חייב להישאר אפס! הרסיסים יעופו בכיוונים מנוגדים כך שהסכום הוקטורי של התנעים שלהם יקזז זה את זה באופן מושלם.";
        }
        else if (question === "כיצד מערכת ה-Airbag ברכב מפחיתה את עוצמת הפגיעה לפי מושג המתקף?") {
            response = "בזמן עצירת פתע, השינוי בתנע של הנוסע (Δp) הוא קבוע. מכיוון שמתקף מוגדר כ-J = F * Δt, כרית האוויר מתנפחת ומאריכה משמעותית את זמן הבלימה (Δt). כתוצאה מהארכת הזמן, הכוח הממוצע (F) הפועל על גוף הנוסע קטן בהתאמה, מה שמציל חיים.";
        }
        else if (question === "האם ייתכן שלשני גופים בעלי מסה שונה יהיה תנע זהה?") {
            response = "כן! מכיוון שתנע מוגדר כמכפלת המסה במהירות (p=mv), גוף קל מאוד (בעל מסה קטנה) שנע במהירות עצומה יכול להיות בעל תנע שווה בדיוק לגוף כבד מאוד (בעל מסה גדולה) שנע באיטיות רבה.";
        }

        // =========================================
        //  מכניקה -> אנרגיה מכנית
        // =========================================
        else if (question === "מהו כוח משמר וכוח לא משמר?") {
            response = "כוח משמר הוא כוח שהעבודה שלו אינה תלויה במסלול התנועה אלא רק בנקודת ההתחלה והסוף (למשל: כוח הכובד, כוח קפיץ). כוח לא משמר הוא כוח שהעבודה שלו תלויה לחלוטין במסלול (למשל: חיכוך, התנגדות אוויר), והוא גורם להמרת אנרגיה מכנית לחום.";
        }
        else if (question === "מהי אנרגיה פוטנציאלית אלסטית?") {
            response = "זוהי אנרגיה האגורה בתוך גוף אלסטי (כמו קפיץ או גומי) כתוצאה משינוי בצורתו (מתיחה או כיווץ). היא מוגדרת לפי הנוסחה המושגית $E_{sp} = \frac{1}{2}kx^2$ והיא שווה לעבודה שהושקעה נגד כוח הקפיץ כדי לעוות אותו.";
        }
        else if (question === "מהו המושג 'הספק' (Power) בפיזיקה?") {
            response = "הספק (P) מוגדר כקצב ביצוע העבודה או קצב המרת האנרגיה ביחידת זמן ($P = \frac{W}{\Delta t}$). הוא מודד כמה מהר מערכת מסוגלת להעביר או לנצל אנרגיה, ויחידת המידה שלו היא ואט (Watt = Joule/sec).";
        }
        else if (question === "מהו משפט עבודה-אנרגיה (אנרגיה קינטית)?") {
            response = "משפט עבודה-אנרגיה קובע כי עבודתם של **כל** הכוחות הפועלים על גוף (משמרים ולא משמרים כאחד) שווה בדיוק לשינוי באנרגיה הקינטית שלו ($W_{total} = \Delta E_k$).";
        }
        else if (question === "לאן נעלמת האנרגיה המכנית כאשר פועל כוח חיכוך?") {
            response = "האנרגיה המכנית אינה מושמדת (לפי חוק שימור האנרגיה הכללי), אלא היא יוצאת מהמערכת המכנית והופכת לאנרגיה תרמית (חום) המעלה את טמפרטורת הגופים המתחככים והסביבה.";
        }
        else if (question === "מדוע כוח נורמל או כוח מתיחות בחוט לפעמים אינם מבצעים עבודה?") {
            response = "כוח אינו מבצע עבודה כאשר הוא מאונך בכל רגע ורגע לכיוון התנועה הרגעית של הגוף (זווית של $90^{\circ}$). למשל, בתנועת מטוטלת, כוח המתיחות פונה תמיד למרכז הסיבוב ומאונך למהירות המשיקית, ולכן עבודתו אפס.";
        }
        else if (question === "מה ההבדל בין אנרגיה לבין כוח?") {
            response = "כוח (F) הוא אינטראקציה פיזיקלית בין גופים הגורמת לתאוצה (וקטור, נמדד ב-N). אנרגיה היא תכונה של גוף או מערכת המייצגת את היכולת לבצע עבודה (סקלר, נמדד ב-J). כוח פועל לאורך מרחק מסוים כדי להעביר או לשנות אנרגיה (עבודה).";
        }
        else if (question === "כיצד מוגדרת נצילות של מערכת מכנית?") {
            response = "נצילות (מסומנת באות $\eta$) היא היחס בין האנרגיה או העבודה המועילה שהופקה מהמערכת לבין סך כל האנרגיה שהושקעה בה. היא מבוטאת באחוזים, ולעולם תהיה קטנה מ-100% במציאות עקב הפסדי אנרגיה לחום (חיכוך).";
        }
        else if (question === "מהי אנרגיה מכנית כוללת?") {
            response = "אנרגיה מכנית כוללת ($E$) היא סכום כל האנרגיות הקשורות לתנועה ולמיקום המקרוסקופי של הגוף. היא מורכבת מחיבור של האנרגיה הקינטית ($E_k$) וכל סוגי האנרגיות הפוטנציאליות במערכת (כובדית, אלסטית וכו').";
        }
        else if (question === "מדוע עבודה של כוח משמר במסלול סגור שווה לאפס?") {
            response = "מכיוון שעבודה של כוח משמר תלויה אך ורק בנקודת המוצא ובנקודת הסיום, אם גוף נע במסלול כלשהו וחוזר בדיוק לנקודת ההתחלה שלו, המיקום לא השתנה נטו ולכן סך העבודה שביצע הכוח במסלול זה היא אפס באופן מוחלט.";
        }
        // =========================================
        // מכניקה -> כבידה
        // =========================================
        else if (question === "מהו שדה כבידה וכיצד הוא מוגדר?") {
            response = "שדה כבידה הוא תכונה של המרחב סביב גוף בעל מסה. הוא מוגדר כגודל וקטורי המייצג את כוח הכבידה שיפעל על מסת בוחן של 1 ק\"ג בנקודה מסוימת במרחב ($g = \frac{F_g}{m}$).";
        }
        else if (question === "מה ההבדל בין קבוע הכבידה העולמי G לבין תאוצת הכובד g?") {
            response = "קבוע הכבידה העולמי $G$ הוא קבוע יסוד קוסמי שערכו זהה בכל היקום ($6.67 \times 10^{-11}$). לעומת זאת, תאוצת הכובד $g$ היא עוצמת השדה המקומית, והיא משתנה ותלויה במסת גרם השמיים וברדיוס שלו (על כדור הארץ היא כ-9.8, על הירח כ-1.6).";
        }
        else if (question === "מהו חוק קפלר הראשון?") {
            response = "חוק קפלר הראשון (חוק המסלולים) קובע כי כל כוכב לכת נע במסלול אליפטי סביב השמש, כאשר השמש נמצאת באחד משני המוקדים של האליפסה.";
        }
        else if (question === "מהו חוק קפלר השני (חוק השטחים)?") {
            response = "חוק קפלר השני קובע כי הרדיוס וקטור המחבר את כוכב הלכת לשמש מכסה שטחים שווים בפרקי זמן שווים. המשמעות היא שכוכב הלכת נע מהר יותר כשהוא קרוב לשמש (פריהליון) ולאט יותר כשהוא רחוק ממנה (אפהליון).";
        }
        else if (question === "מהו חוק קפלר השלישי (חוק המחזורים)?") {
            response = "חוק קפלר השלישי קובע כי ריבוע זמן המחזור ($T^2$) של כוכב לכת נמצא ביחס ישר לחזקה השלישית של מרחקו הממוצע מהשמש ($R^3$). כלומר, היחס $\frac{T^2}{R^3}$ הוא קבוע עבור כל גוף המקיף את אותו מרכז מסה.";
        }
        else if (question === "מהי מהירות מילוט?") {
            response = "מהירות מילוט היא המהירות המינימלית התחילית שגוף צריך לקבל על פני השטח של כוכב לכת כדי 'להשתחרר' כליל משדה הכבידה שלו ולהגיע לאינסוף במהירות אפס, ללא השקעת אנרגיה נוספת (הנעה) בהמשך.";
        }
        else if (question === "מהו לוויין גיאוסטציונרי?") {
            response = "זהו לוויין במסלול מעגלי מיוחד מעל קו המשווה, שזמן המחזור שלו שווה בדיוק לזמן הסיבוב של כדור הארץ סביב עצמו (24 שעות). כתוצאה מכך, הלוויין נראה מנקודת מבט על כדור הארץ כקבוע ונייח תמיד באותה נקודה בשמיים (משמש לתקשורת ולווייני מזג אוויר).";
        }
        else if (question === "כיצד משתנה תאוצת הכובד g ככל שעולים לגובה מעל פני כדור הארץ?") {
            response = "לפי חוק ניוטון, עוצמת השדה נמצאת ביחס הפוך לריבוע המרחק ממרכז כדור הארץ ($g = \frac{GM}{r^2}$). לכן, ככל שעולים לגובה רב יותר מעל פני הקרקע, המרחק $r$ גדל ותאוצת הכובד $g$ קטנה בקצב ריבועי.";
        }
        else if (question === "מהי אנרגיה פוטנציאלית כבידתית אוניברסלית ומדוע היא שלילית?") {
            response = "אנרגיה פוטנציאלית כבידתית אוניברסלית מוגדרת כעבודה הנדרשת להבאת גוף מאינסוף לנקודה. היא שלילית מכיוון שנקודת הייחוס (אפס) מוגדרת באינסוף, וכיוון שכוח הכבידה הוא כוח משיכה, המערכת מאבדת אנרגיה ככל שהגופים מתקרבים.";
}

        // =========================================
        // 7. חשמל -> מעגלים חשמליים
        // =========================================
        else if (question === "מהו חוק אוהם במעגלים חשמליים?") {
            response = "חוק אוהם קובע כי במוליכים מסוימים (אוהמיים), הזרם (I) העובר במוליך נמצא ביחש ישר למתח (V) שעל פניו, כאשר קבוע הפרופורציה הוא ההתנגדות (R): V = I * R.";
        }
        else if (question === "מה ההבדל בין חיבור בטור לחיבור במקביל?") {
            response = "בטור: הרכיבים מחוברים זה אחר זה, הזרם בכולם שווה וההתנגדות השקולה היא סכום ההתנגדויות (R_total = R1+R2). במקביל: הרכיבים מחוברים לאותם צמתים, המתח עליהם שווה וההתנגדות השקולה קטנה.";
        }
        else if (question === "מהו זרם חשמלי?") {
            response = "זרם חשמלי (I) הוא קצב התנועה המכוונת של מטענים חשמליים (לרוב אלקטרונים חופשיים במתכת) דרך חתך רוחב של מוליך ביחידת זמן. נמדד באמפר (Ampere = Coulomb/sec).";
        }
        else if (question === "מהו מתח חשמלי (הפרש פוטנציאלים)?") {
            response = "מתח (V) הוא הפרש הפוטנציאלים החשמליים בין שתי נקודות. הוא מייצג את העבודה הנדרשת כדי להניע מטען חיובי יחיד בין נקודות אלו, ומתפקד כ'משאבה' הדוחפת את הזרם במעגל. נמדד בוולט (V).";
        }
        else if (question === "מהי התנגדות סגולית של מוליך?") {
            response = "התנגדות סגולית (רו, ρ) היא תכונה פנימית של החומר המודדת כמה הוא מתנגד למעבר זרם חשמלי. ההתנגדות הכוללת של תיל תלויה בהתנגדות הסגולית, באורכו (ביחס ישר) ובשטח חתך הרוחב שלו (ביחס הפוך).";
        }
        else if (question === "מהו כא\"מ (כוח אלקטרו-מניע) של סוללה?") {
            response = "כא\"מ (מסומן ב-ε) הוא המתח המקסימלי שהסוללה יכולה לספק, והוא מייצג את סך האנרגיה החשמלית שהסוללה מעניקה לכל קולון של מטען שעובר בתוכה בתהליך הכימי שבה.";
        }
        else if (question === "מהי התנגדות פנימית של מקור מתח?") {
            response = "התנגדות פנימית (r) היא ההתנגדות החשמלית הקיימת בתוך המבנה הפנימי של הסוללה עצמה. כאשר זרם זורם במעגל, חלק מהמתח של הסוללה 'מתבזבז' בתוכה בגלל התנגדות זו והופך לחום.";
        }
        else if (question === "מהו מתח הדקים?") {
            response = "מתח הדקים (V) הוא המתח האמיתי שהסוללה מספקת למעגל החיצוני בפועל. הוא שווה לכא\"מ פחות נפילת המתח על ההתנגדות הפנימית (V = ε - I*r). כאשר המעגל פתוח (I=0), מתח ההדקים שווה לכא\"מ.";
        }
        else if (question === "מהו זרם קצר?") {
            response = "זרם קצר מתרחש כאשר מחברים את שני הדקי הסוללה ישירות באמצעות חוט מוליך בעל התנגדות אפסית (R=0). במצב זה הזרם מוגבל אך ורק על ידי ההתנגדות הפנימית של הסוללה והוא שווה ל- I = ε / r.";
        }
        else if (question === "איך מוגדר הספק חשמלי ומהו חוק ג'אול?") {
            response = "הספק חשמלי (P) הוא קצב המרת האנרגיה ברכיב (P = V * I). חוק ג'אול קובע כי ההספק המתפתח על נגד והופך לחום שווה לריבוע הזרם כפול ההתנגדות (P = I² * R).";
        }

        // =========================================
        // 8. חשמל -> אלקטרוסטטיקה
        // =========================================
        else if (question === "מהו חוק קולון?") {
            response = "חוק קולון קובע כי גודלו של הכוח החשמלי (F) הפועל בין שני מטענים נקודתיים נמצא ביחס ישר למכפלת גודל המטענים, וביחס הפוך לריבוע המרחק ביניהם: F = (k * q1 * q2) / r².";
        }
        else if (question === "מה זה שדה חשמלי?") {
            response = "שדה חשמלי (E) הוא גודל וקטורי המגדיר את עוצמת וכיוון הכוח החשמלי שיפעל על מטען בוחן חיובי של 1 קולון בנקודה במרחב (E = F / q). יחידותיו הן ניוטון לקולון (N/C) או וולט למטר (V/m).";
        }
        else if (question === "מהם קווי שדה חשמלי?") {
            response = "קווי שדה הם קווים דמיוניים המשמשים להמחשת השדה: המשיק לקו בכל נקודה מראה את כיוון השדה, וצפיפות הקווים מראה את עוצמתו. קווים אלו יוצאים תמיד ממטענים חיוביים ונכנסים למטענים שליליים.";
        }
        else if (question === "איך מוגדר פוטנציאל חשמלי בנקודה?") {
            response = "פוטנציאל חשמלי (V) הוא גודל סקלרי המייצג את האנרגיה הפוטנציאלית החשמלית שיש למטען חיובי של 1 קולון באותה נקודה במרחב. נמדד בוולט (Volt = Joule/Coulomb).";
        }
        else if (question === "מהו משטח שווה פוטנציאל?") {
            response = "משטח שווה פוטנציאל הוא אוסף נקודות במרחב שבהן הפוטנציאל החשמלי זהה. תנועת מטען על פני משטח כזה אינה דורשת ביצוע עבודה (W=0), וקווי השדה החשמלי תמיד מאונכים לחלוטין למשטח זה.";
        }
        else if (question === "מהו שדה חשמלי אחיד?") {
            response = "שדה חשמלי אחיד הוא שדה שגודלו וכיוונו קבועים לחלוטין בכל נקודה ונקודה במרחב (מיוצג על ידי קווי שדה מקבילים ובמרווחים שווים, כמו השדה שנוצר בין שני לוחות מוליכים מקבילים וטעונים בהופכיות).";
        }
        else if (question === "איך מתנהג מטען בוחן חיובי בשדה חשמלי?") {
            response = "מטען חיובי מרגיש כוח בכיוון וקטור השדה החשמלי (E), ולכן הוא ישאף לנוע מנקודות בעלות פוטנציאל גבוה לנקודות בעלות פוטנציאל נמוך (בדומה לגוף הנופל חופשית בשדה כבידה).";
        }
        else if (question === "מה קובע עקרון הסופרפוזיציה של כוחות חשמליים?") {
            response = "עקרון הסופרפוזיציה קובע כי כאשר מספר מטענים פועלים על מטען מסוים, הכוח החשמלי הכולל הפועל עליו שווה לסכום הוקטורי של הכוחות שכל מטען ומטען היה מפעיל עליו לבדו.";
        }
        else if (question === "מהו חוק שימור המטען החשמלי?") {
            response = "חוק זה קובע כי במערכת מבודדת, סך כל המטען החשמלי הכולל נשאר קבוע תמיד. מטענים יכולים לעבור מגוף לגוף (למשל בהולכה או חיכוך), אך לא ניתן ליצור או להשמיד מטען נטו.";
        }
        else if (question === "מה ההבדל היסודי בין כוח חשמלי לכוח כבידה?") {
            response = "כוח כבידה הוא תמיד כוח משיכה ופועל בין מסות. כוח חשמלי פועל בין מטענים ויכול להיות כוח משיכה (בין מטענים מנוגדים) או כוח דחייה (בין מטענים זהים), והוא חזק לאין שיעור מכוח הכבידה.";
        }

        // =========================================
        // 9. קרינה וחומר -> האפקט הפוטואלקטרי
        // =========================================
        else if (question === "מהו האפקט הפוטואלקטרי (קרינה וחומר)?") {
            response = "זהו תהליך שבו קרינת אור בתדר מתאים הפוגעת במתכת גורמת לעקירת אלקטרונים מתוכה. תופעה זו הוכיחה שלאור יש אופי חלקיקי, ושקרינה מורכבת מחבילות אנרגיה בדידות.";
        }
        else if (question === "מהי פונקציית עבודה של מתכת?") {
            response = "פונקציית עבודה (B או W) היא אנרגיית המינימום שהאלקטרון חייב לקבל כדי להשתחרר מקשריו עם פני השטח של המתכת. ערך זה קבוע לכל מתכת ותלוי רק בסוגה.";
        }
        else if (question === "מהו פוטון?") {
            response = "פוטון הוא קוונט (חבילת אנרגיה מינימלית בדידה) של קרינה אלקטרומגנטית. האנרגיה של פוטון בודד תלויה אך ורק בתדר שלו (f) ומחושבת לפי הנוסחה: E = h * f, כאשר h הוא קבוע פלאנק.";
        }
        else if (question === "מהו תדר סף של מתכת?") {
            response = "תדר סף (f0) היא התדר המינימלי של האור הפוגע הדרוש כדי לגרום לפליטת אלקטרונים מהמתכת. אם תדר האור נמוך מתדר הסף, לא ייפלטו אלקטרונים כלל, ללא קשר לעוצמת האור.";
        }
        else if (question === "מהו מתח עצירה באפקט הפוטואלקטרי?") {
            response = "מתח עצירה (Vstop) הוא מתח נגדי המופעל במעגל כדי לעצור לחלוטין את הזרם הפוטואלקטרי. הוא מודד את האנרגיה הקינטית המקסימלית של האלקטרונים הנפלטים לפי הקשר: Ek_max = e * Vstop.";
        }
        else if (question === "כיצד משפיעה עוצמת האור באפקט הפוטואלקטרי?") {
            response = "עוצמת האור (אנרגיה ליחידת שטח) מייצגת את מספר הפוטונים הפוגעים בשנייה. הגדלת עוצמת האור תגדיל את מספר האלקטרונים הנפלטים (ואת הזרם במעגל), אך לא תשנה את האנרגיה הקינטית שלהם.";
        }
        else if (question === "כיצד משפיע תדר האור באפקט הפוטואלקטרי?") {
            response = "תדר האור קובע את האנרגיה של כל פוטון בודד (E=hf). הגדלת התדר מעבר לתדר הסף תגדיל באופן ישיר את האנרגיה הקינטית של האלקטרונים הנפלטים (ואת מתח העצירה), אך לא תשנה את כמותם.";
        }
        else if (question === "מהי האנרגיה הקינטית המקסימלית של פוטואלקטרון?") {
            response = "זוהי האנרגיה העודפת שנשארת לאלקטרון לאחר שנפלט מהמתכת, והיא שווה לאנרגיית הפוטון שנספג פחות פונקציית העבודה של המתכת (Ek_max = hf - B).";
        }
        else if (question === "מה הנוסחה של איינשטיין לאפקט הפוטואלקטרי?") {
            response = "נוסחת שימור האנרגיה של איינשטיין לאפקט היא: h * f = B + Ek_max. כלומר, אנרגיית הפוטון הפוגע (hf) מתחלקת לעקירת האלקטרון (B) והשאר הופך לאנרגיית תנועה (Ek).";
        }
        else if (question === "מדוע מודל הגל נכשל בהסבר אפקט זה?") {
            response = "מודל הגל חזה שעוצמת האור (ולא התדר) תקבע את אנרגיית האלקטרונים, ושיידרש זמן המתנה ארוך עד לפליטת אלקטרונים באור חלש. בפועל הפליטה מידית ותלויה אך ורק בתדר, מה שהפריך מודל זה.";
        }

        // =========================================
        // 10. קרינה וחומר -> מבנה האטום
        // =========================================
        else if (question === "מהם מודלי האטום המרכזיים?") {
            response = "האבולוציה של המודלים כוללת את מודל תומסון (עוגת צימוקים), מודל רתרפורד (גרעין חיובי קטן ואלקטרונים מסביבו במרחב ריק), ומודל בוהר שהכניס מסלולים קוונטיים מותרים בעלי אנרגיה בדידה.";
        }
        else if (question === "מה קורה כשאלקטרון עובר בין רמות אנרגיה?") {
            response = "במעבר מרמה גבוהה לנמוכה האטום פולט פוטון בעל אנרגיה השווה בדיוק להפרש בין הרמות (ΔE=En-Em). במעבר מרמה נמוכה לגבוהה, האטום בולע פוטון עם אנרגיה מדויקת להפרש זה.";
        }
        else if (question === "מהי אנרגיית יינון?") {
            response = "אנרגיית יינון היא האנרגיה המינימלית הדרושה כדי לעקור את האלקטרון לחלוטין מתוך האטום (להביא אותו מרמת היסוד לרמת החופש E=0). עבור אטום המימן ברמת היסוד, אנרגיה זו היא 13.6eV.";
        }
        else if (question === "מהי רמת היסוד של אטום?") {
            response = "רמת היסוד (n=1) היא רמת האנרגיה הנמוכה ביותר והיציבה ביותר שבה האלקטרון נמצא באופן טבעי באטום. ברמה זו האנרגיה של האטום היא המינימלית ביותר (הכי שלילית).";
        }
        else if (question === "מהי רמה מעוררת?") {
            response = "רמה מעוררת (n>1) היא כל רמת אנרגיה הגבוהה מרמת היסוד. אטום מגיע לרמה מעוררת לאחר שספג אנרגיה, אך מצב זה אינו יציב והאלקטרון ימהר לצנוח חזרה תוך פליטת פוטון.";
        }
        else if (question.includes("ספקטרום בליעה")) {
            response = "ספקטרום פליטה מורכב מקווים צבעוניים בדידים הנוצרים כשאלקטרונים צונחים רמה. ספקטרום בליעה מראה קווים שחורים (חשוכים) על רקע רציף, הנוצרים כשאור לבן עובר דרך גז קר והאטומים בולעים תדרים ספציפיים המדויקים לרמות שלהם.";
        }
        else {
            response = "שאלה מצוינת! אני ממליץ לצפות בסרטוני ההסבר הרלוונטיים בנושא זה במערכת כדי לקבל הסבר ויזואלי ומעמיק.";
        }

        typeBotMessage(response);
    }, 750);
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
        if (i >= text.length) { clearInterval(typing); }
    }, 25);
}

window.toggleChat = function() {
    const box = document.getElementById('ai-chat-box');
    if (!box) return;
    box.classList.toggle('open');
    if (box.classList.contains('open')) { loadChatHistory(); }
};

function addChatMessage(text, isBot = false) {
    const messagesDiv = document.getElementById("chat-messages");
    if (!messagesDiv) return;

    const msg = document.createElement("div");
    msg.classList.add("chat-bubble", isBot ? "chat-bot" : "chat-user");
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
    typing.style.cssText = "align-self: flex-start; background: #e2e8f0; padding: 10px 14px; border-radius: 12px; width: 50px; display: flex; justify-content: center;";
    typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;

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
        if (i === text.length) { clearInterval(typing); }
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

    sidebar.classList.toggle("open");
    if (btn) {
        btn.classList.toggle("open");
        btn.innerHTML = sidebar.classList.contains("open") ? '<i class="fa-solid fa-xmark"></i>' : '🏆';
    }
};

function renderProgressSubjects() {
    const app = document.getElementById("app-container");
    
    // שליפת תתי-ההתקדמות של המשתמש (אם אין כלום, שיהיה אובייקט ריק)
    const subProgress = window.playerStats.subProgress || {};

    // --- פונקציית עזר פנימית לחישוב ממוצע דינמי לפי מבנה האתר ---
    const calculateTopicAverage = (topicKey) => {
        // physicsStructure מוגדר אצלך בחלק 2 ומכיל את רשימת ה-subtopics
        const subtopicsList = physicsStructure[topicKey]?.subtopics || [];
        if (subtopicsList.length === 0) return 0;

        let sum = 0;
        subtopicsList.forEach(subKey => {
            // מוסיף את האחוז הקיים, או 0 אם המשתמש לא התחיל את תת-הנושא
            sum += (subProgress[subKey] || 0);
        });

        // החזרת הממוצע מעוגל
        return Math.round(sum / subtopicsList.length);
    };

    // חישוב הממוצעים בפועל עבור שלושת הנושאים הגדולים
    const mechanicsAvg = calculateTopicAverage('mechanics');
    const electricityAvg = calculateTopicAverage('electricity');
    const radiationAvg = calculateTopicAverage('radiation');

    app.innerHTML = `
        <section class="progress-page" style="min-height:100vh; padding-top:40px; direction: rtl;">
            <h2 class="section-title text-white-shadow">📊 ממוצע ציונים בנושאים 📊</h2>
            <div class="grid-full">
                
                <!-- כרטיסיית מכניקה -->
                <div class="card animated-bg-card" onclick="router('progress_topic', 'mechanics')">
                    <canvas class="card-particle-canvas" id="canvas-mechanics"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-gears card-icon-animated"></i>
                        <h3>מכניקה</h3>
                        <div style="font-size: 1.3rem; font-weight: 800; color: #60a5fa; margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            ממוצע נושא: ${mechanicsAvg}%
                        </div>
                    </div>
                </div>
                
                <!-- כרטיסיית חשמל ומגנטיות -->
                <div class="card animated-bg-card" onclick="router('progress_topic', 'electricity')">
                    <canvas class="card-particle-canvas" id="canvas-electricity"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-bolt-lightning card-icon-animated"></i>
                        <h3>חשמל ומגנטיות</h3>
                        <div style="font-size: 1.3rem; font-weight: 800; color: #fbbf24; margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            ממוצע נושא: ${electricityAvg}%
                        </div>
                    </div>
                </div>
                
                <!-- כרטיסיית קרינה וחומר -->
                <div class="card animated-bg-card" onclick="router('progress_topic', 'radiation')">
                    <canvas class="card-particle-canvas" id="canvas-radiation"></canvas>
                    <div class="card-overlay-animated">
                        <i class="fa-solid fa-atom card-icon-animated"></i>
                        <h3>קרינה וחומר</h3>
                        <div style="font-size: 1.3rem; font-weight: 800; color: #a78bfa; margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            ממוצע נושא: ${radiationAvg}%
                        </div>
                    </div>
                </div>
                
            </div>
            <div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 20px;">
                Animated particle effect inspired by Particles.js (MIT License)
            </div>
            <button class="btn-back" onclick="router('home')">חזור לדף הבית</button>
        </section>
    `;

    // הפעלת האנימציה של החלקיקים ברקע
    setTimeout(() => {
        initCardParticles("canvas-mechanics", "#3b82f6");
        initCardParticles("canvas-electricity", "#f59e0b");
        initCardParticles("canvas-radiation", "#8b5cf6");
    }, 50);
}

function initCardParticles(canvasId, particleColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2.5 + 1
        });
    }

    function animate() {
        if (!document.getElementById(canvasId)) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        });

        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = particleColor;
        ctx.lineWidth = 0.8;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 65) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animate);
    }
    animate();
}

function listenToLeaderboard() {
    const q = query(collection(db, "users"), orderBy("stars", "desc"), orderBy("level", "desc"));
    onSnapshot(q, (snapshot) => {
        const users = [];
        snapshot.forEach(docSnap => { users.push({ id: docSnap.id, ...docSnap.data() }); });
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

        div.innerHTML = `<span>${index + 1}. ${user.name || "אנונימי"}</span><span>⭐ ${user.stars || 0}</span>`;
        list.appendChild(div);
    });
}

/* =========================================
   13. הישגים
   ========================================= */
window.toggleAchievements = function() {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;
    if (modal.style.display === 'flex') { modal.style.display = 'none'; } else { modal.style.display = 'flex'; renderAchievements(); }
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
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px; border-bottom:1px solid #eee; font-weight:600;">
            <div style="display:flex; flex-direction:column; text-align:right;">
                <span>${a.title}</span>
                <span style="font-size:0.9rem; color:#f59e0b; margin-top:4px;">⭐ ${a.stars} כוכבים</span>
            </div>
            ${a.condition 
                ? `<span style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#22c55e; color:white; font-weight:bold; font-size:16px; box-shadow:0 4px 10px rgba(34,197,94,0.4);">✓</span>`
                : `<span style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#ef4444; color:white; font-weight:bold; font-size:16px; opacity:0.6;">✕</span>`
            }
        </div>`).join('');
}

async function checkAchievements() {
    const level = window.playerStats.level;
    const achievements = [
        { id: "level5", condition: level >= 5, stars: 5 },
        { id: "level10", condition: level >= 10, stars: 10 },
        { id: "level20", condition: level >= 20, stars: 20 },
    ];

    for (let ach of achievements) {
        if (ach.condition && !window.playerStats.unlockedAchievements.includes(ach.id)) {
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
                setTimeout(() => { loader.remove(); }, 800);
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
function createSparkle(button) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    const rect = button.getBoundingClientRect();
    const size = rect.width;
    const x = Math.random() * size - size / 2;
    const y = Math.random() * size - size / 2;
    
    sparkle.style.left = `${rect.left + rect.width / 2 + x}px`;
    sparkle.style.top = `${rect.top + rect.height / 2 + y}px`;
    
    const moveX = (Math.random() - 0.5) * 40 + "px";
    const moveY = -(Math.random() * 50 + 30) + "px";
    sparkle.style.setProperty("--x", moveX);
    sparkle.style.setProperty("--y", moveY);
    
    document.body.appendChild(sparkle);
    setTimeout(() => { sparkle.remove(); }, 1000);
}

function initSparkleEffect() {
    const buttonSelectors = ['.chat-fab', '#achievements-btn', '.progress-icon', '#leaderboard-toggle'];
    buttonSelectors.forEach(selector => {
        const btn = document.querySelector(selector);
        if (btn) {
            let sparkleInterval;
            btn.addEventListener('mouseenter', () => {
                for(let i = 0; i < 5; i++) { setTimeout(() => createSparkle(btn), i * 50); }
                sparkleInterval = setInterval(() => { createSparkle(btn); }, 150); 
            });
            btn.addEventListener('mouseleave', () => { clearInterval(sparkleInterval); });
        }
    });
}

window.addEventListener("load", () => { initSparkleEffect(); });
