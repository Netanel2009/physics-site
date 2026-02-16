// --- Mock Database (נתונים) ---
const savedMessages = JSON.parse(localStorage.getItem('physicsMessages')) || [];

const db = {
    topics: [
        { 
            id: 1, 
            title: 'קינמטיקה', 
            desc: 'תנועה בקו ישר, נפילה חופשית וזריקות', 
            type: 'bagrut', 
            // רכבת הרים
            image: 'https://images.unsplash.com/photo-1533575770077-47e38dd75feb?auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 2, 
            title: 'דינמיקה', 
            desc: 'חוקי ניוטון, כוחות וחיכוך', 
            type: 'bagrut', 
            // עריסת ניוטון
            image: 'https://images.unsplash.com/photo-1582718188437-4e596363c323?auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 3, 
            title: 'אופטיקה גיאומטרית', 
            desc: 'עדשות, מראות ושבירת אור', 
            type: 'grade10', 
            // פריזמה
            image: 'https://images.unsplash.com/photo-1506351582236-41f237303c80?auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 4, 
            title: 'אלקטרוסטטיקה', 
            desc: 'חוק קולון ושדה חשמלי', 
            type: 'bagrut', 
            // ברקים
            image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 5, 
            title: 'קרינה וחומר', 
            desc: 'האפקט הפוטואלקטרי ומודל האטום', 
            type: 'bagrut', 
            // חלקיקים
            image: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&w=800&q=80' 
        }
    ],
    messages: savedMessages 
};

// --- App Logic ---
const app = document.getElementById('app-container');

// מערכת ניווט
function router(page) {
    window.scrollTo(0, 0);
    app.innerHTML = ''; // מנקה את המסך
    
    // סגירת תפריט במובייל אם פתוח
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

// דף הבית
function renderHome() {
    let html = `
        <div class="hero">
            <div class="hero-content">
                <h1>🚀 אתר פיזיקה מקיף לבגרות</h1>
                <p>כל החומר, התרגולים והסימולציות במקום אחד. כולל חומר לכיתה י'!</p>
                <button class="btn" onclick="router('lessons')" style="font-size:1.1rem; padding:12px 30px;">התחל ללמוד עכשיו</button>
            </div>
        </div>
        
        <h2 style="margin-bottom: 25px; font-size: 2rem; text-align:center; color: var(--primary-blue);">נושאי הלימוד</h2>
        <div class="grid-container">
    `;

    db.topics.forEach(topic => {
        html += `
            <div class="card" onclick="router('lessons')" style="background-image: url('${topic.image}');">
                <div class="card-overlay">
                    <div class="card-header">
                        <span class="badge">
                            ${topic.type === 'bagrut' ? '📚 לבגרות' : '🎓 כיתה י\''}
                        </span>
                    </div>
                    <div>
                        <h3>${topic.title}</h3>
                        <p>${topic.desc}</p>
                        <button class="btn" style="width:100%; opacity:0.9;">כנס לנושא</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    app.innerHTML = html;
}

// דף צור קשר
function renderContact() { 
    app.innerHTML = `
        <div class="contact-form">
            <h2 style="text-align: center; color: var(--primary-blue); margin-bottom: 20px;">📬 צור קשר</h2>
            <form onsubmit="handleContact(event)">
                <div class="form-group"><label>שם מלא</label><input type="text" id="c-name" required></div>
                <div class="form-group"><label>אימייל</label><input type="email" id="c-email" required></div>
                <div class="form-group"><label>מספר טלפון</label><input type="tel" id="c-phone" required></div>
                <div class="form-group"><label>הודעה</label><textarea id="c-msg" rows="5" required></textarea></div>
                <button type="submit" class="btn" style="width:100%">שלח הודעה</button>
            </form>
        </div>
    `;
}

function handleContact(e) {
    e.preventDefault();
    const name = document.getElementById('c-name').value;
    const email = document.getElementById('c-email').value;
    const phone = document.getElementById('c-phone').value;
    const content = document.getElementById('c-msg').value;
    const date = new Date().toLocaleString('he-IL');

    const newMsg = { id: Date.now(), name, email, phone, content, date };
    db.messages.unshift(newMsg);
    localStorage.setItem('physicsMessages', JSON.stringify(db.messages));
    
    alert('ההודעה נשלחה בהצלחה! צוות האתר יחזור אליך בהקדם.');
    router('home');
}

// ניהול וכניסה
function renderAdminLogin() { 
    app.innerHTML = `
        <div class="contact-form" style="max-width:400px; margin:0 auto;">
            <h2 style="text-align:center;">🔒 כניסת מנהל</h2>
            <div class="form-group"><input type="password" id="adminPass" placeholder="סיסמה"></div>
            <button class="btn" onclick="checkAdmin()" style="width:100%">התחבר</button>
        </div>`; 
}

window.checkAdmin = function() {
    const pass = document.getElementById('adminPass').value;
    if(pass === 'admin123') {
        renderAdminPanel();
    } else {
        alert('סיסמה שגויה! נסה שוב.');
    }
}

function renderAdminPanel() {
    const msgCount = db.messages.length;
    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
            <h2>👋 שלום מנהל</h2>
            <button class="btn" onclick="router('home')" style="background:#666">יציאה</button>
        </div>
        
        <div class="grid-container" style="margin-bottom:30px;">
            <div class="contact-form" style="text-align:center; border-top:4px solid var(--primary-blue);">
                <h3 style="font-size:2rem; color:var(--primary-blue);">${msgCount}</h3>
                <p>הודעות חדשות</p>
            </div>
        </div>

        <h3>📥 דואר נכנס</h3>
        <hr style="margin: 10px 0 20px 0;">
    `;
    
    if (msgCount === 0) {
        html += `<p style="text-align:center; color:#666;">אין הודעות חדשות כרגע.</p>`;
    } else {
        db.messages.forEach(msg => {
            html += `
                <div class="message-card">
                    <div class="msg-header">
                        <strong>${msg.name}</strong> 
                        <span style="font-size:0.9em; color:#666">${msg.date}</span>
                    </div>
                    <div style="margin-bottom:10px; color:#555; font-size:0.9em;">
                        ${msg.email} | ${msg.phone}
                    </div>
                    <p style="background:#f9fafb; padding:10px; border-radius:5px;">${msg.content}</p>
                    <button onclick="deleteMessage(${msg.id})" style="background:#fee2e2; color:#ef4444; border:none; padding:8px 15px; border-radius:5px; margin-top:10px; cursor:pointer; font-weight:bold;">
                        <i class="fa-solid fa-trash"></i> מחק הודעה
                    </button>
                </div>
            `;
        });
    }
    app.innerHTML = html;
}

window.deleteMessage = function(id) {
    if(confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) {
        db.messages = db.messages.filter(msg => msg.id !== id);
        localStorage.setItem('physicsMessages', JSON.stringify(db.messages));
        renderAdminPanel(); // רענון המסך
    }
}

// דפי "בבנייה" (Placeholder) לשאר הכפתורים
function renderLessons() { app.innerHTML = '<div class="contact-form" style="text-align:center"><h2>📚 סיכומים והסברים</h2><p>כאן יופיעו הסיכומים לכל נושא.</p><button class="btn" onclick="router(\'home\')">חזור הביתה</button></div>'; }
function renderExercises() { app.innerHTML = '<div class="contact-form" style="text-align:center"><h2>📝 מאגר שאלות</h2><p>כאן יופיעו תרגילים לתרגול עצמי.</p><button class="btn" onclick="router(\'home\')">חזור הביתה</button></div>'; }


// --- מבנה הנתונים של הסרטונים (עץ קטגוריות) ---
const videoData = {
    // המסך הראשי של הסרטונים
    root: [
        { 
            type: 'folder', 
            title: 'מכניקה', 
            id: 'mechanics', 
            // רקע כחול/תכלת
            bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
        },
        { 
            type: 'folder', 
            title: 'חשמל ומגנטיות', 
            id: 'electricity', 
            // רקע צהוב/כתום
            bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
        },
        { 
            type: 'folder', 
            title: 'קרינה וחומר', 
            id: 'radiation', 
            // רקע סגול
            bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
        }
    ],

    // בתוך מכניקה
    mechanics: [
        { 
            type: 'video', 
            title: 'קינמטיקה', 
            url: 'https://youtu.be/q8K73P4hft8' 
        },
        { 
            type: 'folder', 
            title: 'דינמיקה', 
            id: 'dynamics', 
            bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        },
        { 
            type: 'folder', 
            title: 'התנע ושימורו', 
            id: 'momentum', 
            bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' 
        },
        { 
            type: 'video', 
            title: 'תנועה הרמונית', 
            url: 'https://youtu.be/FFj3V4CiElI' 
        },
        { 
            type: 'video', 
            title: 'כבידה: עבודה ואנרגיה', 
            url: 'https://youtu.be/o2UOq8rQd6g' 
        }
    ],

    // בתוך דינמיקה
    dynamics: [
        { 
            type: 'video', 
            title: 'זריקה משופעת ואופקית', 
            url: 'https://youtu.be/x3gni5NU8x0' 
        },
        { 
            type: 'video', 
            title: 'כוחות וחוקי ניוטון', 
            url: 'https://youtu.be/L1uIXFfcAHQ' 
        },
        { 
            type: 'video', 
            title: 'תנועה מעגלית לא קצובה', 
            url: 'https://youtu.be/fvGxsSZBqek' 
        }
    ],

    // בתוך התנע ושימורו
    momentum: [
        { 
            type: 'video', 
            title: 'שימור תנע', 
            url: 'https://youtu.be/6k8Hd3wPoU0' 
        },
        { 
            type: 'video', 
            title: 'תנועה במעגל אנכי', 
            url: 'https://youtu.be/fvGxsSZBqek?t=8103' // קישור עם זמן
        },
        { 
            type: 'playlist', 
            title: 'היבטים אנרגטיים (פלייליסט)', 
            url: 'https://youtube.com/playlist?list=PLFDIWxImUbLjBpPGDHVMTrBCu_3hTut8q&si=TuSGAIjcM-rXpCPe' 
        }
    ],

    // קטגוריות ריקות לבינתיים
    electricity: [],
    radiation: []
};

// פונקציית עזר לשליפת ID של סרטון מתוך הקישור
function getVideoID(url) {
    // טיפול בקישורים קצרים (youtu.be)
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    
    // טיפול בקישורים רגילים (youtube.com)
    const longMatch = url.match(/v=([^&]+)/);
    if (longMatch) return longMatch[1];

    return null; 
}

// הפונקציה הראשית שמנהלת את התצוגה
function renderVideos(categoryId = 'root') {
    const items = videoData[categoryId] || [];
    
    // כותרת
    let headerText = '🎬 סרטוני לימוד';
    if (categoryId === 'mechanics') headerText = 'מכניקה';
    if (categoryId === 'dynamics') headerText = 'דינמיקה';
    if (categoryId === 'momentum') headerText = 'התנע ושימורו';

    let html = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
            ${categoryId !== 'root' ? 
                `<button onclick="goBackVideo('${categoryId}')" class="btn" style="background:#666; width:auto;">
                    <i class="fa-solid fa-arrow-right"></i> חזור
                </button>` : '<div></div>'
            }
            <h2 style="color:var(--primary-blue); font-size:2rem; margin:0;">${headerText}</h2>
            <div></div> 
        </div>
        
        <div class="grid-container">
    `;

    if (items.length === 0) {
        html += `<p style="grid-column: 1/-1; text-align:center;">עדיין אין סרטונים בקטגוריה זו.</p>`;
    }

    items.forEach(item => {
        if (item.type === 'folder') {
            // --- תצוגת תיקייה (קטגוריה) ---
            html += `
                <div class="card category-card" onclick="renderVideos('${item.id}')" style="background: ${item.bg}; height: 200px; display:flex; align-items:center; justify-content:center; text-align:center; color:white;">
                    <div>
                        <i class="fa-solid fa-folder-open" style="font-size: 4rem; margin-bottom: 10px; opacity:0.8;"></i>
                        <h3 style="font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${item.title}</h3>
                    </div>
                </div>
            `;
        } else {
            // --- תצוגת סרטון או פלייליסט ---
            let thumbUrl = '';
            let icon = 'fa-circle-play';
            
            if (item.type === 'playlist') {
                thumbUrl = 'https://img.youtube.com/vi/PLFDIWxImUbLjBpPGDHVMTrBCu_3hTut8q/hqdefault.jpg'; // תמונת ברירת מחדל לפלייליסט
                // במקרה של פלייליסט נשים תמונה גנרית יפה אם אין מזהה
                if (!thumbUrl.includes('hqdefault')) thumbUrl = ''; 
                icon = 'fa-list-ul';
            } else {
                const vidId = getVideoID(item.url);
                thumbUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
            }

            // אם זה פלייליסט ואין תמונה, נשים צבע רקע
            const bgStyle = thumbUrl ? `background-image: url('${thumbUrl}');` : 'background: #333;';

            html += `
                <div class="card video-card" onclick="window.open('${item.url}', '_blank')">
                    <div class="video-thumbnail" style="${bgStyle}">
                        <div class="play-icon">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3>${item.title}</h3>
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    app.innerHTML = html;
}

// לוגיקה לכפתור "חזור"
function goBackVideo(currentId) {
    if (currentId === 'dynamics' || currentId === 'momentum') {
        renderVideos('mechanics');
    } else {
        renderVideos('root');
    }
}

function renderExams() { app.innerHTML = '<div class="contact-form" style="text-align:center"><h2>🏆 בחינות בגרות</h2><p>פתרונות מלאים לבגרויות משנים קודמות.</p><button class="btn" onclick="router(\'home\')">חזור הביתה</button></div>'; }
function renderSimulation() { app.innerHTML = '<div class="contact-form" style="text-align:center"><h2>🧪 מעבדה וירטואלית</h2><p>כאן תהיה סימולציה אינטראקטיבית.</p><button class="btn" onclick="router(\'home\')">חזור הביתה</button></div>'; }

// טעינה ראשונית של האתר
window.onload = function() {
    router('home');
};