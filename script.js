// --- הגדרות ראשוניות ---
(function() {
    emailjs.init("IbRpfo53sxGuf4aZY"); 
})();

// --- בדיקת מכשיר (חסימה) ---
function checkDeviceSupport() {
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
}

// --- מבנה הנתונים (היררכיה מלאה) ---
const contentData = {
    // רמה 1: קטגוריות ראשיות
    categories: [
    { 
        id: 'explanations', 
        title: 'סרטונים 📚', 
        image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473362594596262107/image.png?ex=6995ef58&is=69949dd8&hm=48abbc8fad90982ece9029740a29e510ffbb2c11f52b72f67a9d6b854a7d484b&')" 
    },
    { 
        id: 'exercises', 
        title: 'תרגול שאלות 📝', 
        image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473366111197073599/image.png?ex=6995f29e&is=6994a11e&hm=c7b7e6a7b229fbae86baa067063af3fcbafb77d6aa95718932690ec46dac564d&')" 
    },
    { 
        id: 'simulations', 
        title: 'סימולציות 🧪', 
        image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473362255843295386/image.png?ex=6995ef07&is=69949d87&hm=b9a7739ee29f80b64c8c4de4fd168320b83247449b9dcf75eea4576479bd4026&')" 
    }
],

    
    // רמה 2: נושאים ראשיים
    subjects: [
        { id: 'mechanics', title: 'מכניקה', desc: 'קינמטיקה, דינמיקה, אנרגיה ותנע', image: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { id: 'electricity', title: 'חשמל ומגנטיות', desc: 'אלקטרוסטטיקה ומעגלים', image: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { id: 'radiation', title: 'קרינה וחומר', desc: 'אופטיקה ופיזיקה מודרנית', image: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    ],

    // רמה 3: תוכן מכניקה - מסודר לפי נושאים
    mechanics_content: [
        // --- תיקיית קינמטיקה ---
        { 
            type: 'folder', 
            id: 'kinematics_folder',
            title: 'קינמטיקה', 
            image: 'linear-gradient(to right, #3b82f6, #60a5fa)',
            desc: 'תנועה בקו ישר, נפילה חופשית וזריקות'
        },
        // --- תיקיית תנע ואנרגיה ---
        { 
            type: 'folder', 
            id: 'energy_momentum_folder',
            title: 'תנע ואנרגיה', 
            image: 'linear-gradient(to right, #10b981, #34d399)',
            desc: 'שימור תנע, עבודה ואנרגיה מכנית'
        },
        // --- נושאים נפרדים ---
        { 
            type: 'video', 
            title: 'תנועה הרמונית', 
            url: 'https://youtu.be/FFj3V4CiElI',
            desc: 'קפיצים ומטוטלות'
        },
        { 
            type: 'video', 
            title: 'כוחות וחוקי ניוטון', 
            url: 'https://youtu.be/L1uIXFfcAHQ', 
            desc: 'שלושת החוקים ותרשימי כוחות' 
        },
        { 
            type: 'video', 
            title: 'כבידה', 
            url: 'https://youtu.be/o2UOq8rQd6g',
            desc: 'עבודה ואנרגיה בשדה כבידה'
        }
    ],

    // --- פירוט התיקיות הפנימיות ---

    // 1. קינמטיקה (כולל זריקה משופעת)
    kinematics_folder: [
        { 
            type: 'video', 
            title: 'קינמטיקה (בסיס)', 
            url: 'https://youtu.be/q8K73P4hft8', 
            desc: 'תנועה בקו ישר ונפילה חופשית' 
        },
        { 
            type: 'video', 
            title: 'זריקה משופעת ואופקית', 
            url: 'https://youtu.be/x3gni5NU8x0', 
            desc: 'תנועה במישור (דו-ממדית)' 
        }
    ],


    // 3. תנע ואנרגיה
    energy_momentum_folder: [
        { 
            type: 'video', 
            title: 'שימור תנע', 
            url: 'https://youtu.be/6k8Hd3wPoU0', 
            desc: 'התנגשויות ומתקף' 
        },
        { 
            type: 'video', 
            title: 'אנרגיה ועבודה', 
            url: 'https://youtu.be/xfUsUoy-bBk', 
            desc: 'אנרגיה מכנית ושימורה' 
        },
        { 
            type: 'video', 
            title: 'תנועה במעגל אנכי', 
            url: 'https://youtu.be/fvGxsSZBqek?t=8103', 
            desc: 'שילוב של כוחות ואנרגיה' 
        }
    ]
};

// --- ניהול הניתוב ---
const app = document.getElementById('app-container');

function router(view, data = null) {
    window.scrollTo(0, 0);
    app.innerHTML = '';

    switch(view) {
        case 'home': renderHomePage(); break;
        case 'learning_main': renderLearningCategories(); break;
        case 'subject_select': renderSubjects(data); break; // data = category type (explain/exercise)
        case 'content_list': renderContentList(data); break; // data = subject id (mechanics)
        case 'folder_view': renderFolderContent(data); break; // data = folder id
        case 'admin': renderAdminLogin(); break;
        default: renderHomePage();
    }
}

// --- דפים ופונקציות רנדר ---

// 1. דף הבית (גלילה)
// --- עדכון נתונים: עוד תגובות ---
const testimonialsData = [
    { 
        name: "יהונתן אדיב", 
        text: "הסרטונים המפורטים של אריאל ליבזון לא הותירו לי שום בעיה בפתרון התרגילים", 
        img: "https://cdn.discordapp.com/attachments/1195498441267216494/1473313644186964101/image.png?ex=6995c1c1&is=69947041&hm=bb34dc6de66721d24eb01e3ce7319c7b52e7470fb46e658008bb2fd55910ee39&" 
    },
    { 
        name: "סתיו שיריזלי", 
        text: "הסימולציות עוזרות להבין את החומר באמת, לא רק לשנן נוסחאות כמו תוכי.", 
        img: "https://cdn.discordapp.com/attachments/1195498441267216494/1473314095884271843/image.png?ex=6995c22d&is=699470ad&hm=99a6f52c026d14d2729ead5e6998eb1b10f2a08a5d121ae32655fe85444752ca&" 
    },
    { 
        name: "ניתי ווליך", 
        text: "האתר הכי טוב שמצאתי לבגרות. הכל מסודר, נקי וברור. תודה רבה!", 
        img: "https://cdn.discordapp.com/attachments/1195498441267216494/1473315220213469225/IMG_3477.png?ex=6995c339&is=699471b9&hm=5e459de90573ad806f30d8fe7ee39d32fc0783b8e9daa03a33c04a57b476986d&" 
    },
    { 
        name: "מיכל שרון", 
        text: "לא האמנתי שאצליח להבין חשמל, אבל הסרטונים כאן עשו לי סדר בראש.", 
        img: "https://i.pravatar.cc/150?u=4" 
    },
    { 
        name: "איתי גולן", 
        text: "ממליץ בחום לכל מי שניגש ל-5 יח\"ל. התרגול כאן הוא ברמה של הבגרות בול.", 
        img: "https://i.pravatar.cc/150?u=5" 
    },
    { 
        name: "רוני טל", 
        text: "עיצוב מהמם וחוויית למידה כיפית. סוף סוף אתר שלא נראה כמו משנות ה-90.", 
        img: "https://i.pravatar.cc/150?u=6" 
    }
];

// --- עדכון פונקציית דף הבית ---
function renderHomePage() {
    app.innerHTML = `
        <div class="hero">
            <h1>PhysicsMaster 🚀</h1>
            <p>המקום שלך להצטיין בפיזיקה לבגרות</p>
            <button class="btn-main" onclick="scrollToSection('learning')">התחל ללמוד</button>
        </div>

        <section id="learning">
            <h2 class="section-title">📚 מרכז הלמידה</h2>
            <div style="text-align:center;">
                <p style="font-size:1.4rem; margin-bottom:30px;">בחר את דרך הלימוד המתאימה לך</p>
                <div class="grid-full">
                    ${contentData.categories.map(cat => `
                        <div class="card" onclick="handleCategoryClick('${cat.id}')" style="background: ${cat.image}">
                            <div class="card-overlay">
                                <h3>${cat.title}</h3>
                                <button class="card-btn">כנס לקטגוריה</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section id="about" style="background:white;">
            <h2 class="section-title">🔍 אודות</h2>
            <div style="max-width:800px; margin:0 auto;">
                <p style="font-size:1.3rem; line-height:1.8;">
                    אנחנו ב-PhysicsMaster מאמינים שפיזיקה לא צריכה להיות מפחידה. המטרה שלנו היא להפוך את הנוסחאות המסובכות והתיאוריות המורכבות להסברים פשוטים, ויזואליים וברורים. האתר נבנה מתוך הבנה אמיתית של הקושי בכיתה והלחץ לפני מבחנים. כאן לא 'משננים' חומר - כאן מבינים איך העולם עובד באמת, בדרך להצלחה בבגרות
                </p>
            </div>
        </section>

        <section id="testimonials">
            <h2 class="section-title">💬 מה תלמידים אומרים</h2>
            
            <div class="carousel-wrapper">
                <button class="scroll-btn prev-btn" onclick="scrollTestimonials(-1)">
                    <i class="fa-solid fa-chevron-right"></i> </button>
                
                <div class="testimonials-scroll-container" id="testimonials-container">
                    ${testimonialsData.map(t => `
                        <div class="testimonial-card">
                            <img src="${t.img}" class="profile-img">
                            <h4>${t.name}</h4>
                            <p>"${t.text}"</p>
                        </div>
                    `).join('')}
                </div>

                <button class="scroll-btn next-btn" onclick="scrollTestimonials(1)">
                    <i class="fa-solid fa-chevron-left"></i> </button>
            </div>
        </section>

        <section id="contact" style="background:#f1f5f9;">
            <h2 class="section-title">📬 צור קשר</h2>
            <div class="form-container">
                <form onsubmit="handleContact(event)">
                    <input type="text" id="c-name" placeholder="שם מלא" required>
                    <input type="email" id="c-email" placeholder="אימייל" required>
                    <textarea id="c-msg" rows="5" placeholder="הודעה..." required></textarea>
                    <button type="submit" id="submit-btn" class="btn-main" style="width:100%">שלח הודעה</button>
                </form>
            </div>
        </section>
    `;
}

// לוגיקה ללחיצה על קטגוריה ראשית
function handleCategoryClick(catId) {
    if (catId === 'explanations') {
        router('subject_select', 'explanations');
    } else {
        alert('קטגוריה זו בבנייה כרגע... נסה את "הסברים וסרטונים"');
    }
}

// 2. בחירת נושא ראשי (מכניקה/חשמל)
function renderSubjects(categoryType) {
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">בחר נושא לימוד</h2>
            <div class="grid-full" style="max-width:1200px; margin:0 auto;">
                ${contentData.subjects.map(sub => `
                    <div class="card" onclick="handleSubjectClick('${sub.id}')" style="background: ${sub.image}">
                        <div class="card-overlay">
                            <h3>${sub.title}</h3>
                            <p>${sub.desc}</p>
                            <button class="card-btn">לרשימת התכנים</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-back" onclick="router('home')">חזור לדף הבית</button>
        </section>
    `;
    app.innerHTML = html;
}

function handleSubjectClick(subId) {
    if (subId === 'mechanics') {
        router('content_list', 'mechanics');
    } else {
        alert('נושא זה יעלה בקרוב!');
    }
}

// 3. רשימת התוכן של מכניקה (רמה 3)
function renderContentList(subjectId) {
    const items = contentData[subjectId + '_content']; // mechanics_content
    
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">מכניקה - תכנים</h2>
            <div class="grid-full" style="max-width:1200px; margin:0 auto;">
    `;

    items.forEach(item => {
        if (item.type === 'folder') {
            // תיקייה
            html += `
                <div class="card" onclick="router('folder_view', '${item.id}')" style="background: ${item.image}">
                    <div class="card-overlay">
                        <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-folder-open"></i></div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button class="card-btn">פתח תיקייה</button>
                    </div>
                </div>
            `;
        } else {
            // סרטון בודד
            const thumb = getYoutubeThumb(item.url);
            html += `
                <div class="card" onclick="window.open('${item.url}')" style="background-image: url('${thumb}')">
                    <div class="card-overlay" style="background: linear-gradient(to top, black, transparent);">
                        <div style="font-size:3rem; margin-bottom:10px; color:#ef4444;"><i class="fa-brands fa-youtube"></i></div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button class="card-btn">צפה בסרטון</button>
                    </div>
                </div>
            `;
        }
    });

    html += `</div><button class="btn-back" onclick="router('subject_select')">חזור לנושאים</button></section>`;
    app.innerHTML = html;
}

// 4. תוכן פנימי של תיקייה (דינמיקה/תנע)
function renderFolderContent(folderId) {
    const items = contentData[folderId];
    
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תוכן התיקייה</h2>
            <div class="grid-full" style="max-width:1200px; margin:0 auto;">
    `;

    items.forEach(item => {
        if (item.type === 'text') {
             // פריט טקסט בלבד
             html += `
                <div class="card" style="background: ${item.image}; cursor: default;">
                    <div class="card-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
        } else {
            // סרטון
            const thumb = getYoutubeThumb(item.url);
            html += `
                <div class="card" onclick="window.open('${item.url}')" style="background-image: url('${thumb}')">
                    <div class="card-overlay" style="background: linear-gradient(to top, black, transparent);">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button class="card-btn">צפה בסרטון</button>
                    </div>
                </div>
            `;
        }
    });

    html += `</div><button class="btn-back" onclick="router('content_list', 'mechanics')">חזור למכניקה</button></section>`;
    app.innerHTML = html;
}

// --- פונקציות עזר ---
function scrollToSection(id) {
    // אם אנחנו לא בדף הבית, קודם נעבור אליו
    if (!document.getElementById(id)) {
        renderHomePage();
        setTimeout(() => {
            const el = document.getElementById(id);
            if(el) el.scrollIntoView({behavior: 'smooth'});
        }, 100);
    } else {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    }
}

function getYoutubeThumb(url) {
    if (!url) return '';
    let vidId = '';
    if (url.includes('youtu.be')) vidId = url.split('/').pop().split('?')[0];
    else if (url.includes('v=')) vidId = url.split('v=')[1].split('&')[0];
    else if (url.includes('playlist')) return 'https://i.ytimg.com/vi/PLFDIWxImUbLjBpPGDHVMTrBCu_3hTut8q/hqdefault.jpg'; // תמונה כללית לפלייליסט
    
    return `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
}

function handleContact(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = 'שולח...';
    
    const params = {
        name: document.getElementById('c-name').value,
        email: document.getElementById('c-email').value,
        message: document.getElementById('c-msg').value
    };

    emailjs.send('service_dqa02j8', 'template_i5v64r8', params)
        .then(() => {
            alert('ההודעה נשלחה!');
            document.getElementById('c-msg').value = '';
            btn.innerText = 'שלח הודעה';
        }, (err) => {
            alert('שגיאה בשליחה');
            btn.innerText = 'שלח הודעה';
        });
}

// --- ניהול אדמין (בסיסי) ---
function renderAdminLogin() {
    app.innerHTML = `<section><div class="form-container" style="text-align:center;"><h2>כניסת מנהל</h2><input type="password" id="pass" placeholder="סיסמה"><button class="btn-main" onclick="if(document.getElementById('pass').value=='admin123') alert('ברוך הבא מנהל'); else alert('שגיאה')">כנס</button></div><button class="btn-back" onclick="router('home')">חזור</button></section>`;
}

// --- טעינה ראשונית ---
window.onload = function() {
    if (checkDeviceSupport()) {
        router('home');
    }
};

// --- פונקציה לגלילת התגובות ---
function scrollTestimonials(direction) {
    const container = document.getElementById('testimonials-container');
    const scrollAmount = 350; // רוחב כרטיס + רווח
    
    // direction: 1 = שמאלה (הבא), -1 = ימינה (הקודם)
    // בגלל RTL (ימין לשמאל), כיוון הגלילה הוא הפוך לוגית בציר ה-X
    // במרבית הדפדפנים ב-RTL, מספר שלילי גולל ימינה ומספר חיובי שמאלה
    
    container.scrollBy({
        left: direction * scrollAmount * -1, // ה-מינוס 1 מתקן את הכיוון לעברית
        behavior: 'smooth'
    });
}

