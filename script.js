// --- אתחול EmailJS ---
(function() {
    // המפתח הציבורי שלך כפי שמופיע בהודעה הקודמת
    emailjs.init("IbRpfo53sxGuf4aZY"); 
})();

// --- בדיקת מכשיר (חוסם טלפונים) ---
function checkDeviceSupport() {
    if (window.innerWidth < 768) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; background: #f3f4f6; color: #1f2937; font-family: sans-serif; padding: 20px; direction: rtl;">
                <i class="fa-solid fa-mobile-screen-button" style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h1 style="font-size: 1.8rem; margin-bottom: 10px;">האתר מותאם למחשב וטאבלט בלבד 🖥️</h1>
                <p style="font-size: 1.1rem; color: #4b5563;">כדי ללמוד בנחת ולראות את הסימולציות והנוסחאות כמו שצריך,<br>אנא היכנס דרך מחשב או אייפד.</p>
            </div>
        `;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
        return false;
    }
    return true;
}

// --- נתונים (Database) ---
const savedMessages = JSON.parse(localStorage.getItem('physicsMessages')) || [];

const db = {
    topics: [
        { id: 1, title: 'קינמטיקה', desc: 'תנועה בקו ישר, נפילה חופשית וזריקות', type: 'bagrut', image: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
        { id: 2, title: 'דינמיקה', desc: 'חוקי ניוטון, כוחות וחיכוך', type: 'bagrut', image: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
        { id: 3, title: 'אופטיקה גיאומטרית', desc: 'עדשות, מראות ושבירת אור', type: 'grade10', image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
        { id: 4, title: 'אלקטרוסטטיקה', desc: 'חוק קולון ושדה חשמלי', type: 'bagrut', image: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
        { id: 5, title: 'קרינה וחומר', desc: 'האפקט הפוטואלקטרי ומודל האטום', type: 'bagrut', image: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }
    ],
    messages: savedMessages 
};

const videoData = {
    root: [
        { type: 'folder', title: 'מכניקה', id: 'mechanics', bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { type: 'folder', title: 'חשמל ומגנטיות', id: 'electricity', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { type: 'folder', title: 'קרינה וחומר', id: 'radiation', bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    ],
    mechanics: [
        { type: 'video', title: 'קינמטיקה', url: 'https://youtu.be/q8K73P4hft8' },
        { type: 'folder', title: 'דינמיקה', id: 'dynamics', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { type: 'folder', title: 'התנע ושימורו', id: 'momentum', bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
        { type: 'video', title: 'תנועה הרמונית', url: 'https://youtu.be/FFj3V4CiElI' },
        { type: 'video', title: 'כבידה: עבודה ואנרגיה', url: 'https://youtu.be/o2UOq8rQd6g' }
    ],
    dynamics: [
        { type: 'video', title: 'זריקה משופעת ואופקית', url: 'https://youtu.be/x3gni5NU8x0' },
        { type: 'video', title: 'כוחות וחוקי ניוטון', url: 'https://youtu.be/L1uIXFfcAHQ' },
        { type: 'video', title: 'תנועה מעגלית לא קצובה', url: 'https://youtu.be/fvGxsSZBqek' }
    ],
    momentum: [
        { type: 'video', title: 'שימור תנע', url: 'https://youtu.be/6k8Hd3wPoU0' },
        { type: 'video', title: 'תנועה במעגל אנכי', url: 'https://youtu.be/fvGxsSZBqek?t=8103' },
        { type: 'playlist', title: 'היבטים אנרגטיים (פלייליסט)', url: 'https://youtube.com/playlist?list=PLFDIWxImUbLjBpPGDHVMTrBCu_3hTut8q' }
    ],
    electricity: [],
    radiation: []
};

// --- לוגיקת ניווט ---
const app = document.getElementById('app-container');

function router(page) {
    window.scrollTo(0, 0);
    app.innerHTML = ''; 
    const nav = document.querySelector('.nav-links');
    if(nav) nav.classList.remove('active');

    switch(page) {
        case 'home': renderHome(); break;
        case 'lessons': renderLessons(); break;
        case 'exercises': renderExercises(); break;
        case 'videos': renderVideos(); break;
        case 'exams': renderExams(); break;
        case 'simulation': renderSimulation(); break;
        case 'contact': renderContact(); break;
        case 'admin': renderAdminLogin(); break;
        default: renderHome();
    }
}

function renderHome() {
    let html = `
        <div class="hero">
            <div class="hero-content">
                <h1>🚀 PhysicsMaster</h1>
                <p>כל החומר לבגרות בפיזיקה במקום אחד.</p>
                <button class="btn" onclick="router('lessons')">התחל ללמוד עכשיו</button>
            </div>
        </div>
        <div class="grid-container">
    `;
    db.topics.forEach(topic => {
        html += `
            <div class="card" onclick="router('lessons')" style="background: ${topic.image};">
                <div class="card-overlay">
                    <div class="card-header"><span class="badge">${topic.type === 'bagrut' ? '📚 לבגרות' : '🎓 כיתה י\''}</span></div>
                    <h3>${topic.title}</h3>
                    <p>${topic.desc}</p>
                    <button class="btn" style="width:100%">כנס לנושא</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    app.innerHTML = html;
}

// --- ניהול סרטונים ---
function getVideoID(url) {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/v=([^&]+)/);
    if (longMatch) return longMatch[1];
    return null; 
}

function renderVideos(categoryId = 'root') {
    const items = videoData[categoryId] || [];
    let html = `<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
        ${categoryId !== 'root' ? `<button onclick="renderVideos('root')" class="btn" style="background:#666; width:auto;">חזור</button>` : '<div></div>'}
        <h2 style="color:var(--primary-blue); font-size:2rem; margin:0;">🎬 סרטוני לימוד</h2><div></div></div><div class="grid-container">`;

    items.forEach(item => {
        if (item.type === 'folder') {
            html += `<div class="card" onclick="renderVideos('${item.id}')" style="background:${item.bg}; height:200px; display:flex; align-items:center; justify-content:center; color:white; cursor:pointer;">
                <div style="text-align:center;"><i class="fa-solid fa-folder-open" style="font-size:3rem; margin-bottom:10px;"></i><h3>${item.title}</h3></div></div>`;
        } else {
            const vidId = getVideoID(item.url);
            const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : '';
            html += `<div class="card video-card" onclick="window.open('${item.url}', '_blank')">
                <div class="video-thumbnail" style="background-image: url('${thumb}')"><div class="play-icon"><i class="fa-solid fa-play"></i></div></div>
                <div class="video-info"><h3>${item.title}</h3></div></div>`;
        }
    });
    html += '</div>';
    app.innerHTML = html;
}

// --- צור קשר (EmailJS) ---
function renderContact() { 
    app.innerHTML = `
        <div class="contact-form">
            <h2 style="text-align: center; color: var(--primary-blue);">📬 צור קשר</h2>
            <form onsubmit="handleContact(event)">
                <div class="form-group"><label>שם מלא</label><input type="text" id="c-name" required></div>
                <div class="form-group"><label>אימייל</label><input type="email" id="c-email" required></div>
                <div class="form-group"><label>טלפון</label><input type="tel" id="c-phone" required></div>
                <div class="form-group"><label>הודעה</label><textarea id="c-msg" rows="5" required></textarea></div>
                <button type="submit" id="submit-btn" class="btn" style="width:100%">שלח הודעה</button>
            </form>
        </div>
    `;
}

function handleContact(e) {
    e.preventDefault();
    const name = document.getElementById('c-name').value;
    const email = document.getElementById('c-email').value;
    const phone = document.getElementById('c-phone').value;
    const message = document.getElementById('c-msg').value;
    const date = new Date().toLocaleString('he-IL');

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = 'שולח...';
    submitBtn.disabled = true;

    const templateParams = { name, email, phone, message };

    emailjs.send('service_dqa02j8', 'template_i5v64r8', templateParams)
        .then(function() {
            const newMsg = { id: Date.now(), name, email, phone, content: message, date };
            db.messages.unshift(newMsg);
            localStorage.setItem('physicsMessages', JSON.stringify(db.messages));
            alert('ההודעה נשלחה בהצלחה למייל המורה!');
            router('home');
        }, function(error) {
            alert('שגיאה בשליחה. נסה שוב מאוחר יותר.');
            submitBtn.innerText = 'שלח הודעה';
            submitBtn.disabled = false;
        });
}

// --- ניהול מנהל ---
function renderAdminLogin() { 
    app.innerHTML = `<div class="contact-form" style="max-width:400px; margin:0 auto;"><h2 style="text-align:center;">🔒 כניסת מנהל</h2>
        <div class="form-group"><input type="password" id="adminPass" placeholder="סיסמה"></div>
        <button class="btn" onclick="checkAdmin()" style="width:100%">התחבר</button></div>`; 
}

window.checkAdmin = function() {
    if(document.getElementById('adminPass').value === 'admin123') renderAdminPanel();
    else alert('סיסמה שגויה!');
}

function renderAdminPanel() {
    let html = `<div style="display:flex; justify-content:space-between; align-items:center;"><h2>👋 שלום מנהל</h2><button class="btn" onclick="router('home')" style="background:#666">יציאה</button></div><h3>📥 הודעות נכנסות</h3><hr>`;
    if (db.messages.length === 0) html += `<p style="text-align:center;">אין הודעות חדשות.</p>`;
    else {
        db.messages.forEach(msg => {
            html += `<div class="message-card" style="background:white; padding:15px; border-radius:10px; margin-bottom:15px; border-right:5px solid var(--primary-blue); box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <strong>${msg.name}</strong> <span style="font-size:0.8em; color:#888;">${msg.date}</span><br>
                <small>${msg.email} | ${msg.phone}</small><p style="background:#f9fafb; padding:10px; border-radius:5px; margin-top:10px;">${msg.content}</p>
                <button onclick="deleteMessage(${msg.id})" style="color:#ef4444; border:none; background:none; cursor:pointer; font-weight:bold;">מחק</button></div>`;
        });
    }
    app.innerHTML = html;
}

window.deleteMessage = function(id) {
    if(confirm('למחוק?')) {
        db.messages = db.messages.filter(m => m.id !== id);
        localStorage.setItem('physicsMessages', JSON.stringify(db.messages));
        renderAdminPanel();
    }
}

// דפי בבנייה
function renderLessons() { app.innerHTML = '<div style="text-align:center; padding:50px;"><h2>📚 עמוד הסיכומים בבנייה...</h2><button class="btn" onclick="router(\'home\')">חזור</button></div>'; }
function renderExercises() { app.innerHTML = '<div style="text-align:center; padding:50px;"><h2>📝 מאגר תרגילים בבנייה...</h2></div>'; }
function renderExams() { app.innerHTML = '<div style="text-align:center; padding:50px;"><h2>🏆 בחינות בגרות בבנייה...</h2></div>'; }
function renderSimulation() { app.innerHTML = '<div style="text-align:center; padding:50px;"><h2>🧪 מעבדה וירטואלית בבנייה...</h2></div>'; }

// טעינה
window.onload = function() {
    if (checkDeviceSupport()) router('home');
};
