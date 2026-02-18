/* =========================================
   1. מאגר הנתונים (Data) - תרגילים ושאלות
   ========================================= */
const physicsData = {
    mechanics: {
        title: "מכניקה",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600",
        questions: [
            { q: "מכונית נוסעת במהירות 20 מטר לשנייה למשך 10 שניות. מה המרחק שעברה?", a: 200, unit: "מטר" },
            { q: "גוף נופל חופשית במשך 3 שניות (g=10). מה מהירותו הסופית?", a: 30, unit: "מ/ש" },
            { q: "כוח של 50 ניוטון פועל על מסה של 10 ק״ג. מהי התאוצה?", a: 5, unit: "מ/ש²" },
            { q: "אדם דוחף קיר בכוח של 100 ניוטון. כמה עבודה הוא מבצע?", a: 0, unit: "ג'אול" }
        ]
    },
    electricity: {
        title: "חשמל ומגנטיות",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600",
        questions: [
            { q: "נתון נגד של 5 אוהם ומתח של 20 וולט. מה הזרם?", a: 4, unit: "אמפר" },
            { q: "שלושה נגדים של 2 אוהם מחוברים בטור. מה ההתנגדות הכוללת?", a: 6, unit: "אוהם" },
            { q: "הספק של נורה הוא 100 וואט, והמתח הוא 220 וולט. מה הזרם (בערך)?", a: 0.45, unit: "אמפר" }
        ]
    },
    optics: {
        title: "אופטיקה וגלים",
        image: "https://images.unsplash.com/photo-1505672678655-1f63b61835bc?auto=format&fit=crop&w=600",
        questions: [
            { q: "קרן אור פוגעת במראה בזווית 30 מעלות. מהי זווית ההחזרה?", a: 30, unit: "מעלות" },
            { q: "מה מהירות האור בריק (ביחידות של 10 בחזקת 8 מטר לשנייה)?", a: 3, unit: "מ/ש" }
        ]
    }
};

/* =========================================
   2. ניהול מצב (State Management)
   ========================================= */
let currentUser = null; 
let currentTopic = null;
let currentQuestionIndex = 0;
let score = 0;

/* =========================================
   3. מערכת XP ורמות (Gamification) - החדש!
   ========================================= */
let playerStats = {
    level: 1,
    currentXP: 0,
    xpNeeded: 100
};

// טעינת נתונים מהזיכרון המקומי (Local Storage)
function loadStats() {
    if (localStorage.getItem('physicsMasterStats')) {
        playerStats = JSON.parse(localStorage.getItem('physicsMasterStats'));
    }
    updateXPUI();
}

// פונקציה להוספת נקודות
function addXP(amount) {
    playerStats.currentXP += amount;
    
    // בדיקה אם עלינו רמה
    checkLevelUp();
    
    // שמירה ועדכון תצוגה
    saveStats();
    updateXPUI();
}

// בדיקת עליית רמה
function checkLevelUp() {
    let leveledUp = false;
    // לולאה למקרה שקיבלנו המון נקודות ועלינו כמה רמות במכה
    while (playerStats.currentXP >= playerStats.xpNeeded) {
        playerStats.currentXP -= playerStats.xpNeeded;
        playerStats.level++;
        // הרמה הבאה קשה יותר ב-20%
        playerStats.xpNeeded = Math.floor(playerStats.xpNeeded * 1.2);
        leveledUp = true;
    }
    
    if (leveledUp) {
        triggerLevelUpEffect();
    }
}

// שמירת הנתונים בדפדפן
function saveStats() {
    localStorage.setItem('physicsMasterStats', JSON.stringify(playerStats));
}

// עדכון הממשק הגרפי (UI) של ה-XP
function updateXPUI() {
    const levelEl = document.getElementById('current-level');
    const xpEl = document.getElementById('current-xp');
    const neededEl = document.getElementById('xp-needed');
    const barEl = document.getElementById('xp-bar');

    if (levelEl) levelEl.innerText = playerStats.level;
    if (xpEl) xpEl.innerText = Math.floor(playerStats.currentXP);
    if (neededEl) neededEl.innerText = playerStats.xpNeeded;
    
    // חישוב אחוז הרוחב של הפס
    const percentage = (playerStats.currentXP / playerStats.xpNeeded) * 100;
    if (barEl) barEl.style.width = percentage + '%';
}

// אנימציה חגיגית לעליית רמה
function triggerLevelUpEffect() {
    const widget = document.querySelector('.level-circle');
    if (widget) {
        widget.classList.add('level-up-anim');
        
        // יצירת אלמנט הודעה צפה
        const msg = document.createElement('div');
        msg.innerText = "Level Up! 🎉";
        msg.style.position = "fixed";
        msg.style.bottom = "100px";
        msg.style.right = "30px";
        msg.style.background = "#f59e0b";
        msg.style.color = "white";
        msg.style.padding = "10px 20px";
        msg.style.borderRadius = "20px";
        msg.style.fontWeight = "bold";
        msg.style.zIndex = "3000";
        msg.style.animation = "slideIn 0.5s ease-out";
        document.body.appendChild(msg);

        // הסרת האנימציה וההודעה אחרי זמן קצר
        setTimeout(() => {
            widget.classList.remove('level-up-anim');
            msg.remove();
        }, 2000);
    }
}

/* =========================================
   4. לוגיקה ראשית של האתר (Main App Logic)
   ========================================= */

// יצירת הכרטיסיות בדף הראשי
function renderTopics() {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const [key, data] of Object.entries(physicsData)) {
        const card = document.createElement('div');
        card.className = 'card';
        // שימוש בתמונה של הנושא כרקע
        card.style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.image}')`;
        card.onclick = () => startPractice(key);
        
        card.innerHTML = `
            <div class="card-overlay">
                <h3>${data.title}</h3>
                <button class="card-btn">התחל תרגול <i class="fa-solid fa-arrow-left"></i></button>
            </div>
        `;
        grid.appendChild(card);
    }
}

// התחלת תרגול בנושא מסוים
function startPractice(topicKey) {
    // אם רוצים לחייב התחברות לפני תרגול - בטל את ההערה הבאה:
    // if (!currentUser) { alert('עליך להתחבר כדי לתרגל ולצבור נקודות!'); return; }

    currentTopic = physicsData[topicKey];
    currentQuestionIndex = 0;
    score = 0;
    
    // גלילה חלקה לאזור הלמידה
    document.getElementById('learning').scrollIntoView({ behavior: 'smooth' });
    
    // החלפת תוכן ה-Main לשאלה
    const app = document.getElementById('app-container');
    showQuestion(app);
}

// הצגת שאלה על המסך
function showQuestion(container) {
    const q = currentTopic.questions[currentQuestionIndex];
    
    container.innerHTML = `
        <div style="max-width:700px; margin: 0 auto; text-align:center; padding-top: 20px;">
            <h2 class="section-title" style="font-size:2.5rem; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${currentTopic.title}</h2>
            
            <div class="summary-card">
                <div style="display:flex; justify-content:space-between; color:#64748b; margin-bottom:15px; font-weight:bold;">
                    <span>שאלה ${currentQuestionIndex + 1} מתוך ${currentTopic.questions.length}</span>
                    <span>ניקוד נוכחי: ${score}</span>
                </div>
                
                <h3 style="font-size:1.6rem; margin-bottom:30px; line-height:1.4;">${q.q}</h3>
                
                <input type="number" id="user-answer" placeholder="הקלד תשובה מספרית..." 
                       style="text-align:center; font-size:1.3rem; max-width: 300px; margin: 0 auto 20px auto; display:block;">
                
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button class="btn-main" onclick="checkAnswer()">בדיקה</button>
                    <button class="btn-back" style="margin:0;" onclick="location.reload()">יציאה</button>
                </div>
            </div>
        </div>
    `;
    
    // פוקוס אוטומטי לשדה הקלט
    setTimeout(() => document.getElementById('user-answer').focus(), 100);
}

// בדיקת התשובה
window.checkAnswer = function() {
    const input = document.getElementById('user-answer');
    if (!input.value) return; // לא לבדוק אם ריק

    const userAnswer = parseFloat(input.value);
    const questionData = currentTopic.questions[currentQuestionIndex];
    const correctAnswer = questionData.a;
    
    // בדיקה עם טווח שגיאה קטן (למקרה של שברים עשרוניים)
    if (Math.abs(userAnswer - correctAnswer) < 0.1) {
        // תשובה נכונה!
        alert("כל הכבוד! תשובה נכונה 🎯\nקיבלת 50 XP!");
        score++;
        addXP(50); // הוספת XP
    } else {
        // תשובה שגויה
        alert(`לא נורא! התשובה הנכונה היא ${correctAnswer} ${questionData.unit}`);
    }
    
    // מעבר לשאלה הבאה
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentTopic.questions.length) {
        showQuestion(document.getElementById('app-container'));
    } else {
        showSummary();
    }
};

// הצגת סיכום בסוף התרגול
function showSummary() {
    const app = document.getElementById('app-container');
    
    // חישוב בונוס סיום
    let bonusXP = 0;
    if (score === currentTopic.questions.length) {
        bonusXP = 100; // בונוס על הצלחה מושלמת
        addXP(bonusXP);
    } else if (score > 0) {
        bonusXP = 20; // בונוס קטן על סיום
        addXP(bonusXP);
    }
    
    app.innerHTML = `
        <div style="text-align:center; margin-top:50px; padding: 20px;">
            <h1 style="font-size:3rem; color:white; text-shadow: 0 0 20px var(--primary);">סיימת את התרגול!</h1>
            <div class="summary-card" style="max-width: 500px; margin: 40px auto;">
                <h2 style="font-size: 2rem; margin-bottom: 20px;">הציון שלך: ${score} / ${currentTopic.questions.length}</h2>
                
                <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color:var(--primary); margin:0;">סה"כ XP שנצבר: ${(score * 50) + bonusXP}</h3>
                    ${bonusXP > 0 ? `<p style="color:#059669; font-size:0.9rem; margin-top:5px;">(כולל בונוס סיום!)</p>` : ''}
                </div>

                <button class="btn-main" onclick="location.reload()">חזרה לדף הבית</button>
            </div>
        </div>
    `;
}

/* =========================================
   5. ניהול משתמשים והתחברות (Auth)
   ========================================= */

// מעבר בין טאבים (כניסה / הרשמה)
window.switchTab = function(tab) {
    const loginBtn = document.getElementById('tab-login');
    const signupBtn = document.getElementById('tab-signup');
    const nameField = document.getElementById('name-field');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit');
    
    if (tab === 'signup') {
        loginBtn.classList.remove('active');
        signupBtn.classList.add('active');
        nameField.style.display = 'block'; // מציג שדה שם
        title.innerText = 'הרשמה למערכת';
        submitBtn.innerText = 'הרשם והתחל ללמוד';
    } else {
        signupBtn.classList.remove('active');
        loginBtn.classList.add('active');
        nameField.style.display = 'none'; // מסתיר שדה שם
        title.innerText = 'התחברות';
        submitBtn.innerText = 'התחבר';
    }
};

// טיפול בטופס התחברות (סימולציה)
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault(); // מונע רענון דף
        
        const email = document.getElementById('auth-email').value;
        const nameInput = document.getElementById('auth-name');
        // אם זה הרשמה ניקח את השם, אם כניסה נקרא לו "משתמש"
        const name = (nameInput.offsetParent !== null && nameInput.value) ? nameInput.value : "דניאל תלמיד";
        
        // סגירת המודל
        document.getElementById('auth-modal').style.display = 'none';
        
        // ביצוע "התחברות"
        currentUser = { name: name, email: email };
        
        updateUIAfterLogin();
    });
}

function updateUIAfterLogin() {
    // הסתרת כפתור התחברות
    document.getElementById('login-trigger-btn').style.display = 'none';
    
    // הצגת פרופיל
    const profile = document.getElementById('user-profile');
    profile.style.display = 'flex';
    
    // עדכון פרטים בפרופיל
    document.getElementById('user-name-display').innerText = currentUser.name;
    document.getElementById('user-email-display').innerText = currentUser.email;
    
    // יצירת תמונה (Avatar) לפי השם
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff`;
    document.getElementById('user-photo').src = avatarUrl;
    
    // הצגת ווידג'ט ה-XP
    const xpWidget = document.getElementById('level-widget');
    xpWidget.style.display = 'flex';
    
    // שמירה ב-LocalStorage כדי שנזכור שהמשתמש מחובר (אופציונלי)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', currentUser.name);
    
    loadStats(); // טעינת הסטטיסטיקות של המשתמש
}

// התנתקות
window.handleLogout = function() {
    localStorage.removeItem('isLoggedIn');
    location.reload();
};

// גלילה חלקה
window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior: 'smooth'});
};

/* =========================================
   6. אתחול (Initialization)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. טעינת הנושאים
    renderTopics();
    
    // 2. בדיקה אם המשתמש כבר מחובר מפעם קודמת
    if (localStorage.getItem('isLoggedIn') === 'true') {
        currentUser = {
            name: localStorage.getItem('userName') || 'משתמש',
            email: 'user@example.com'
        };
        updateUIAfterLogin();
    }
});
