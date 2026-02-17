// --- אתחול EmailJS ---
(function() {
    emailjs.init("IbRpfo53sxGuf4aZY"); 
})();

// תפריט המבורגר
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// --- בדיקת מכשיר (חוסם טלפונים) ---
function checkDeviceSupport() {
    if (window.innerWidth < 768) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; background: #f3f4f6; padding: 20px; direction: rtl;">
                <i class="fa-solid fa-mobile-screen-button" style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h1>האתר מותאם למחשב בלבד 🖥️</h1>
                <p>כדי לצפות בסימולציות ובנוסחאות, אנא היכנס ממחשב או טאבלט.</p>
            </div>
        `;
        return false;
    }
    return true;
}

// --- נתונים ---
const db = {
    topics: [
        { id: 1, title: 'קינמטיקה', desc: 'תנועה בקו ישר, נפילה חופשית וזריקות', type: 'bagrut', image: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
        { id: 2, title: 'דינמיקה', desc: 'חוקי ניוטון, כוחות וחיכוך', type: 'bagrut', image: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
        { id: 3, title: 'אופטיקה גיאומטרית', desc: 'עדשות, מראות ושבירת אור', type: 'grade10', image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }
    ],
    messages: JSON.parse(localStorage.getItem('physicsMessages')) || []
};

const videoData = {
    root: [
        { type: 'folder', title: 'מכניקה', id: 'mechanics', bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }
    ],
    mechanics: [
        { type: 'video', title: 'קינמטיקה', url: 'https://youtu.be/q8K73P4hft8' }
    ]
};

// --- ניווט ---
const app = document.getElementById('app-container');

function router(page) {
    window.scrollTo(0, 0);
    app.innerHTML = ''; 
    document.getElementById('navLinks').classList.remove('active');

    switch(page) {
        case 'home': renderHome(); break;
        case 'videos': renderVideos(); break;
        case 'contact': renderContact(); break;
        case 'admin': renderAdminLogin(); break;
        default: renderHome();
    }
}

function renderHome() {
    let html = `<div class="hero"><div class="hero-content"><h1>🚀 PhysicsMaster</h1><p>כל החומר לבגרות במקום אחד.</p><button class="btn" onclick="router('videos')">לסרטוני לימוד</button></div></div><div class="grid-container">`;
    db.topics.forEach(t => {
        html += `<div class="card" style="background: ${t.image}"><div class="card-overlay"><span class="badge">בגרות</span><h3>${t.title}</h3><p>${t.desc}</p></div></div>`;
    });
    app.innerHTML = html + `</div>`;
}

function renderVideos(cat = 'root') {
    const items = videoData[cat] || [];
    let html = `<h2 style="margin-bottom:20px;">🎬 סרטוני לימוד</h2><div class="grid-container">`;
    items.forEach(item => {
        if(item.type === 'folder') {
            html += `<div class="card" onclick="renderVideos('${item.id}')" style="background:${item.bg}; display:flex; align-items:center; justify-content:center;"><h3>${item.title}</h3></div>`;
        } else {
            const id = item.url.split('/').pop();
            html += `<div class="card video-card" onclick="window.open('${item.url}')">
                <div class="video-thumbnail" style="background-image:url('https://img.youtube.com/vi/${id}/hqdefault.jpg')"><i class="fa-solid fa-play play-icon"></i></div>
                <div class="video-info"><h3>${item.title}</h3></div></div>`;
        }
    });
    app.innerHTML = html + `</div>`;
}

function renderContact() {
    app.innerHTML = `
        <div class="contact-form">
            <h2>📬 צור קשר</h2>
            <form onsubmit="handleContact(event)">
                <div class="form-group"><input type="text" id="c-name" placeholder="שם מלא" required></div>
                <div class="form-group"><input type="email" id="c-email" placeholder="אימייל" required></div>
                <div class="form-group"><input type="tel" id="c-phone" placeholder="טלפון" required></div>
                <div class="form-group"><textarea id="c-msg" placeholder="הודעה" rows="5" required></textarea></div>
                <button type="submit" id="submit-btn" class="btn" style="width:100%">שלח</button>
            </form>
        </div>`;
}

function handleContact(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = 'שולח...';
    
    const params = {
        name: document.getElementById('c-name').value,
        email: document.getElementById('c-email').value,
        phone: document.getElementById('c-phone').value,
        message: document.getElementById('c-msg').value
    };

    emailjs.send('service_dqa02j8', 'template_i5v64r8', params)
        .then(() => {
            alert('הודעה נשלחה!');
            router('home');
        }, (err) => {
            alert('שגיאה בשליחה');
            btn.innerText = 'שלח';
        });
}

function renderAdminLogin() {
    app.innerHTML = `<div class="contact-form" style="max-width:300px;"><h2>🔒 ניהול</h2><input type="password" id="pass" class="form-group" style="width:100%; padding:10px;"><button class="btn" onclick="checkAdmin()" style="width:100%">כניסה</button></div>`;
}

function checkAdmin() {
    if(document.getElementById('pass').value === 'admin123') {
        app.innerHTML = '<h2>הודעות שהתקבלו:</h2>' + db.messages.map(m => `<div style="background:white; margin:10px; padding:10px;">${m.name}: ${m.content}</div>`).join('');
    } else alert('טעות');
}

window.onload = () => { if(checkDeviceSupport()) router('home'); };
