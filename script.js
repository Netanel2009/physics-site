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
    getDoc
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

/* =========================================
   3. נתונים (Data)
   ========================================= */
window.contentData = { /* ... כל התוכן שלך כפי שהגדרת ... */ };
window.questionsBank = { /* ... כל השאלות שלך ... */ };
const testimonialsData = [ /* ... */ ];

/* =========================================
   4. מערכת XP ורמות
   ========================================= */
let playerStats = { level: 1, currentXP: 0, xpNeeded: 100 };

async function saveStatsToDB() {
    const user = auth.currentUser;
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        xp: playerStats.currentXP,
        level: playerStats.level,
        xpNeeded: playerStats.xpNeeded
    }, { merge: true });
}

async function loadStats() {
    const user = auth.currentUser;
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()){
        const data = docSnap.data();
        playerStats.level = data.level || 1;
        playerStats.currentXP = data.xp || 0;
        playerStats.xpNeeded = data.xpNeeded || 100;
    } else {
        playerStats = { level: 1, currentXP: 0, xpNeeded: 100 };
        await saveStatsToDB();
    }
    updateXPUI();
}

async function addXP(amount) {
    playerStats.currentXP += amount;
    checkLevelUp();
    await saveStatsToDB();
    updateXPUI();
}

function checkLevelUp() {
    let leveledUp = false;
    while(playerStats.currentXP >= playerStats.xpNeeded){
        playerStats.currentXP -= playerStats.xpNeeded;
        playerStats.level++;
        playerStats.xpNeeded = Math.floor(playerStats.xpNeeded * 1.2);
        leveledUp = true;
    }
    if(leveledUp) triggerLevelUpEffect();
}

function updateXPUI(){
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');
    if(levelEl) levelEl.innerText = playerStats.level;
    if(xpEl) xpEl.innerText = Math.floor(playerStats.currentXP);
    if(neededEl) neededEl.innerText = playerStats.xpNeeded;
    const percentage = (playerStats.currentXP / playerStats.xpNeeded) * 100;
    if(barEl) barEl.style.width = percentage + '%';
}

function triggerLevelUpEffect(){
    const widget = document.querySelector('.level-circle');
    if(widget){
        widget.classList.add('level-up-anim');
        const msg = document.createElement('div');
        msg.innerText = "Level Up! 🎉";
        msg.style.cssText = "position:fixed; bottom:100px; right:30px; background:#f59e0b; color:white; padding:10px 20px; border-radius:20px; font-weight:bold; z-index:3000; animation:slideIn 0.5s ease-out;";
        document.body.appendChild(msg);
        setTimeout(()=>{ widget.classList.remove('level-up-anim'); msg.remove(); },2000);
    }
}

/* =========================================
   5. פונקציות רינדור
   ========================================= */
function renderHomePage(){
    const app = document.getElementById('app-container');
    app.innerHTML = '';
    const hero = document.createElement('div');
    hero.className = 'hero';
    hero.innerHTML = `
        <h1>PhysicsMaster 🚀</h1>
        <p>המקום שלך להצטיין בפיזיקה לבגרות</p>
    `;
    const startBtn = document.createElement('button');
    startBtn.className = 'btn-main';
    startBtn.innerText = 'התחל ללמוד';
    startBtn.addEventListener('click',()=>scrollToSection('learning'));
    hero.appendChild(startBtn);
    app.appendChild(hero);

    const learning = document.createElement('section');
    learning.id = 'learning';
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerText = '📚 מרכז הלמידה';
    learning.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid-full';

    window.contentData.categories.forEach(cat=>{
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = cat.image;
        card.style.backgroundSize = 'cover';
        card.addEventListener('click',()=>handleCategoryClick(cat.id));
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `<h3>${cat.title}</h3><button class='card-btn'>כנס לקטגוריה</button>`;
        card.appendChild(overlay);
        grid.appendChild(card);
    });
    learning.appendChild(grid);
    app.appendChild(learning);
}

// renderSubjects, renderContentList, renderExerciseList, renderFolderContent, renderActiveExercise
// – יש לכתוב אותם באופן דומה עם createElement + addEventListener כדי להיות בטוחים

/* =========================================
   8. Auth + טעינת XP
   ========================================= */
onAuthStateChanged(auth,async(user)=>{
    const authModal = document.getElementById('auth-modal');
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-trigger-btn');
    const xpWidget = document.getElementById('level-widget');

    if(user){
        if(authModal) authModal.style.display='none';
        if(userProfile) userProfile.style.display='flex';
        if(loginBtn) loginBtn.style.display='none';
        if(xpWidget) xpWidget.style.display='flex';
        document.getElementById('user-name-display').innerText = user.displayName||user.email;
        await loadStats();
    } else {
        if(authModal) authModal.style.display='flex';
        if(userProfile) userProfile.style.display='none';
        if(loginBtn) loginBtn.style.display='block';
        if(xpWidget) xpWidget.style.display='none';
        playerStats = { level:1, currentXP:0, xpNeeded:100 };
        updateXPUI();
    }
});

/* =========================================
   שאר הקוד שלך נשאר ללא שינוי (Admin, Delete User, Loader וכו')
   ========================================= */

/* =========================================
   פונקציות רינדור ותוכן מלא
   ========================================= */

/* =========================================
   פונקציות רינדור ותוכן מלא
   ========================================= */

function renderHomePage() {
    const app = document.getElementById('app-container');
    app.innerHTML = '';
    
    const hero = document.createElement('div');
    hero.className = 'hero';
    hero.innerHTML = `
        <h1>PhysicsMaster 🚀</h1>
        <p>המקום שלך להצטיין בפיזיקה לבגרות</p>
        <button class="btn-main" id="start-learning-btn">התחל ללמוד</button>
    `;
    app.appendChild(hero);

    const learningSection = document.createElement('section');
    learningSection.id = 'learning';
    learningSection.innerHTML = `<h2 class="section-title">📚 מרכז הלמידה</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid-full';
    
    window.contentData.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = cat.image;
        card.style.backgroundSize = 'cover';
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `
            <h3>${cat.title}</h3>
            <button class="card-btn">כנס לקטגוריה</button>
        `;
        overlay.querySelector('button').addEventListener('click', () => handleCategoryClick(cat.id));
        card.appendChild(overlay);
        grid.appendChild(card);
    });
    
    learningSection.appendChild(grid);
    app.appendChild(learningSection);

    // חיבור כפתור התחלת למידה
    document.getElementById('start-learning-btn').addEventListener('click', () => scrollToSection('learning'));
}

function renderSubjects() {
    const app = document.getElementById('app-container');
    app.innerHTML = '';
    const section = document.createElement('section');
    section.style.minHeight = '100vh';
    section.style.paddingTop = '40px';
    section.innerHTML = `<h2 class="section-title">${pageMode === 'exercises' ? 'תרגול שאלות' : 'סרטונים והסברים'}</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid-full';
    
    window.contentData.subjects.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = sub.image;
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `
            <h3>${sub.title}</h3>
            <p>${sub.desc}</p>
            <button class="card-btn">בחר נושא</button>
        `;
        overlay.querySelector('button').addEventListener('click', () => handleSubjectClick(sub.id));
        card.appendChild(overlay);
        grid.appendChild(card);
    });
    section.appendChild(grid);

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = 'חזור לדף הבית';
    backBtn.addEventListener('click', () => router('home'));
    section.appendChild(backBtn);

    app.appendChild(section);
}

function renderContentList(subjectId) {
    const items = window.contentData[subjectId + '_content'];
    const app = document.getElementById('app-container');
    app.innerHTML = '';

    const section = document.createElement('section');
    section.style.minHeight = '100vh';
    section.style.paddingTop = '40px';
    section.innerHTML = `<h2 class="section-title">תכנים</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid-full';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        if (item.type === 'folder') {
            card.style.background = item.image;
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.innerHTML = `
                <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-folder-open"></i></div>
                <h3>${item.title}</h3>
                <button class="card-btn">פתח תיקייה</button>
            `;
            overlay.querySelector('button').addEventListener('click', () => router('folder_view', item.id));
            card.appendChild(overlay);
        } else {
            card.style.backgroundImage = `url('${getYoutubeThumb(item.url)}')`;
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.innerHTML = `
                <div style="font-size:3rem; margin-bottom:10px; color:#ef4444;"><i class="fa-brands fa-youtube"></i></div>
                <h3>${item.title}</h3>
                <button class="card-btn">צפה בסרטון</button>
            `;
            overlay.querySelector('button').addEventListener('click', () => window.open(item.url));
            card.appendChild(overlay);
        }
        grid.appendChild(card);
    });

    section.appendChild(grid);
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = 'חזור לנושאים';
    backBtn.addEventListener('click', () => router('subject_select', 'explanations'));
    section.appendChild(backBtn);

    app.appendChild(section);
}

function renderExerciseList(subjectId) {
    const items = window.contentData[subjectId + '_exercises'];
    const app = document.getElementById('app-container');
    app.innerHTML = '';

    const section = document.createElement('section');
    section.style.minHeight = '100vh';
    section.style.paddingTop = '40px';
    section.innerHTML = `<h2 class="section-title">רשימת תרגול</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid-full';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = item.image;
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `
            <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-pen-to-square"></i></div>
            <h3>${item.title}</h3>
            <button class="card-btn">התחל תרגול</button>
        `;
        overlay.querySelector('button').addEventListener('click', () => router('active_exercise', item.id));
        card.appendChild(overlay);
        grid.appendChild(card);
    });

    section.appendChild(grid);
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = 'חזור לנושאים';
    backBtn.addEventListener('click', () => router('subject_select', 'exercises'));
    section.appendChild(backBtn);

    app.appendChild(section);
}

function renderFolderContent(folderId) {
    const items = window.contentData[folderId];
    const app = document.getElementById('app-container');
    app.innerHTML = '';

    const section = document.createElement('section');
    section.style.minHeight = '100vh';
    section.style.paddingTop = '40px';
    section.innerHTML = `<h2 class="section-title">תוכן התיקייה</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid-full';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundImage = `url('${getYoutubeThumb(item.url)}')`;
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `
            <h3>${item.title}</h3>
            <button class="card-btn">צפה בסרטון</button>
        `;
        overlay.querySelector('button').addEventListener('click', () => window.open(item.url));
        card.appendChild(overlay);
        grid.appendChild(card);
    });

    section.appendChild(grid);
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = 'חזור';
    backBtn.addEventListener('click', () => router('content_list', 'mechanics'));
    section.appendChild(backBtn);

    app.appendChild(section);
}

function renderActiveExercise(exId) {
    const questions = window.questionsBank[exId];
    const app = document.getElementById('app-container');
    app.innerHTML = '';

    if (!questions) {
        const section = document.createElement('section');
        section.innerHTML = `<h2 class="section-title">אין שאלות עדיין</h2>`;
        const backBtn = document.createElement('button');
        backBtn.className = 'btn-back';
        backBtn.textContent = 'חזור';
        backBtn.addEventListener('click', () => router('home'));
        section.appendChild(backBtn);
        app.appendChild(section);
        return;
    }

    const section = document.createElement('section');
    section.style.minHeight = '100vh';
    section.style.paddingTop = '40px';
    section.innerHTML = `<h2 class="section-title">תרגול שאלות</h2>`;

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.style.textAlign = 'right';
    formContainer.style.direction = 'rtl';
    formContainer.style.maxWidth = '800px';
    const exerciseDiv = document.createElement('div');
    exerciseDiv.id = 'exercise-container';

    questions.forEach((q, i) => {
        const qBlock = document.createElement('div');
        qBlock.className = 'question-block';
        qBlock.style.marginBottom = '30px';
        qBlock.style.border = '2px solid #f1f5f9';
        qBlock.style.padding = '25px';
        qBlock.style.borderRadius = '20px';
        qBlock.style.background = '#fff';
        qBlock.innerHTML = `<p style="font-size:1.3rem; font-weight:700; margin-bottom:15px; color: var(--dark);">${i+1}. ${q.q}</p>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-group';
        q.options.forEach(opt => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.margin = '12px 0';
            label.style.cursor = 'pointer';
            label.style.fontSize = '1.1rem';
            label.style.padding = '8px';
            label.innerHTML = `<input type="radio" name="q${i}" value="${opt}" style="margin-left:10px;"> ${opt}`;
            optionsDiv.appendChild(label);
        });

        qBlock.appendChild(optionsDiv);
        exerciseDiv.appendChild(qBlock);
    });

    formContainer.appendChild(exerciseDiv);
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-main';
    submitBtn.style.width = '100%';
    submitBtn.style.marginTop = '20px';
    submitBtn.innerHTML = `<i class="fa-solid fa-check-double"></i> בדוק תשובות`;
    submitBtn.addEventListener('click', () => checkAnswers(exId));
    formContainer.appendChild(submitBtn);

    section.appendChild(formContainer);

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = 'חזור לרשימה';
    backBtn.addEventListener('click', () => router('exercise_list', 'mechanics'));
    section.appendChild(backBtn);

    app.appendChild(section);
}


