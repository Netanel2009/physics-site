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
    categories: [
        { id: 'explanations', title: 'סרטונים 📚', image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473362594596262107/image.png?ex=6995ef58&is=69949dd8&hm=48abbc8fad90982ece9029740a29e510ffbb2c11f52b72f67a9d6b854a7d484b&')" },
        { id: 'exercises', title: 'תרגול שאלות 📝', image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473366111197073599/image.png?ex=6995f29e&is=6994a11e&hm=c7b7e6a7b229fbae86baa067063af3fcbafb77d6aa95718932690ec46dac564d&')" },
        { id: 'simulations', title: 'סימולציות 🧪', image: "url('https://cdn.discordapp.com/attachments/1195498441267216494/1473362594596262107/image.png')" }
    ],

    subjects: [
        { id: 'mechanics', title: 'מכניקה', desc: 'קינמטיקה, דינמיקה, אנרגיה ותנע', image: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { id: 'electricity', title: 'חשמל ומגנטיות', desc: 'אלקטרוסטטיקה ומעגלים', image: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { id: 'radiation', title: 'קרינה וחומר', desc: 'אופטיקה ופיזיקה מודרנית', image: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    ],

    // תכני סרטונים - מכניקה
    mechanics_content: [
        { type: 'folder', id: 'kinematics_folder', title: 'קינמטיקה', image: 'linear-gradient(to right, #3b82f6, #60a5fa)', desc: 'תנועה בקו ישר, נפילה חופשית וזריקות' },
        { type: 'folder', id: 'energy_momentum_folder', title: 'תנע ואנרגיה', image: 'linear-gradient(to right, #10b981, #34d399)', desc: 'שימור תנע, עבודה ואנרגיה מכנית' },
        { type: 'video', title: 'תנועה הרמונית', url: 'https://youtu.be/FFj3V4CiElI', desc: 'קפיצים ומטוטלות' }
    ],

    // תכני תרגול - מכניקה (חדש!)
    mechanics_exercises: [
        { id: 'ex_kinematics', title: 'תרגול קינמטיקה', desc: 'שאלות על תנועה שוות תאוצה', image: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' },
        { id: 'ex_momentum', title: 'תרגול תנע', desc: 'התנגשויות ומתקף', image: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }
    ],

    kinematics_folder: [
        { type: 'video', title: 'קינמטיקה (בסיס)', url: 'https://youtu.be/q8K73P4hft8', desc: 'תנועה בקו ישר ונפילה חופשית' }
    ],
    
    energy_momentum_folder: [
        { type: 'video', title: 'שימור תנע', url: 'https://youtu.be/6k8Hd3wPoU0', desc: 'התנגשויות ומתקף' }
    ]
};

// בנק שאלות לתרגול
const questionsBank = {
    'ex_kinematics': [
        { 
            q: "גוף מתחיל לנוע ממנוחה בתאוצה קבועה של 2m/s². מה יהיה המרחק שיעבור הגוף כעבור 5 שניות?", 
            a: "25 מ'", 
            options: ["10 מ'", "25 מ'", "50 מ'", "100 מ'"] 
        },
        { 
            q: "כדור נזרק אנכית מעלה במהירות של 30m/s (בהנחה ש-g=10). תוך כמה זמן יגיע הכדור לשיא הגובה?", 
            a: "3 שניות", 
            options: ["1 שניה", "3 שניות", "5 שניות", "30 שניות"] 
        },
        { 
            q: "מה מייצג השיפוע בגרף מהירות-זמן (v כפונקציה של t)?", 
            a: "תאוצה", 
            options: ["העתק", "מהירות ממוצעת", "תאוצה", "זמן"] 
        },
        { 
            q: "מכונית נוסעת במהירות קבועה של 72 קמ\"ש. מהי מהירותה ביחידות של מטר לשנייה (m/s)?", 
            a: "20 m/s", 
            options: ["10 m/s", "20 m/s", "25 m/s", "72 m/s"] 
        },
        { 
            q: "גוף נע שמאלה (כיוון שלילי) אך מהירותו הולכת וקטנה. מה ניתן לומר על תאוצת הגוף?", 
            a: "התאוצה חיובית", 
            options: ["התאוצה שלילית", "התאוצה חיובית", "התאוצה היא אפס", "לא ניתן לדעת"] 
        },
        { 
            q: "מה מייצג השטח הכלוא מתחת לגרף מהירות-זמן?", 
            a: "העתק", 
            options: ["תאוצה", "מהירות רגעית", "העתק", "כוח"] 
        }
    ],
    'ex_momentum': [
        { 
            q: "מהי ההגדרה הפיזיקלית של תנע?", 
            a: "מכפלת המסה במהירות", 
            options: ["מכפלת המסה בתאוצה", "מכפלת המסה במהירות", "האנרגיה הקינטית של הגוף", "הכוח הפועל על הגוף"] 
        },
        { 
            q: "גוף שמסתו 2 ק\"ג נע במהירות של 5 מ' לשנייה. מהו התנע שלו?", 
            a: "10 kg*m/s", 
            options: ["2.5 kg*m/s", "7 kg*m/s", "10 kg*m/s", "20 kg*m/s"] 
        },
        { 
            q: "בהתנגשות פלסטית בין שני גופים:", 
            a: "הגופים נצמדים זה לזה", 
            options: ["האנרגיה הקינטית נשמרת", "הגופים נצמדים זה לזה", "המהירות היחסית לא משתנה", "התנע הכולל לא נשמר"] 
        },
        { 
            q: "מה מייצג השטח הכלוא מתחת לגרף כוח כפונקציה של זמן (F כפונקציה של t)?", 
            a: "מתקף (שינוי בתנע)", 
            options: ["עבודה", "מהירות", "מתקף (שינוי בתנע)", "הספק"] 
        },
        { 
            q: "שני גופים בעלי מסה זהה נעים זה לקראת זה במהירות זהה ומתנגשים התנגשות פלסטית. מה תהיה מהירותם לאחר ההתנגשות?", 
            a: "0", 
            options: ["פעמיים המהירות המקורית", "חצי מהמהירות המקורית", "0", "המהירות המקורית"] 
        },
        { 
            q: "חוק שימור התנע מתקיים כאשר:", 
            a: "סכום הכוחות החיצוניים על המערכת הוא אפס", 
            options: ["אין חיכוך בכלל", "ההתנגשות היא אלסטית בלבד", "סכום הכוחות החיצוניים על המערכת הוא אפס", "הגופים נעים במהירות קבועה"] 
        },
        { 
            q: "כדור טניס פוגע בקיר במהירות v וחוזר ממנו באותה מהירות v. מהו גודל השינוי בתנע שלו?", 
            a: "2mv", 
            options: ["0", "mv", "2mv", "-mv"] 
        },
        { 
            q: "מהן היחידות של מתקף (Impulse)?", 
            a: "N*s", 
            options: ["N/m", "N*s", "Joule", "Watt"] 
        },
        { 
            q: "תותח מסה M יורה פגז מסה m קדימה. מה יקרה לתותח?", 
            a: "ירתע לאחור כדי לשמר את התנע", 
            options: ["ישאר במקום", "ינוע קדימה עם הפגז", "ירתע לאחור כדי לשמר את התנע", "יעלה למעלה"] 
        },
        { 
            q: "בהתנגשות אלסטית לחלוטין מתקיימים:", 
            a: "שימור תנע ושימור אנרגיה קינטית", 
            options: ["שימור תנע בלבד", "שימור אנרגיה קינטית בלבד", "שימור תנע ושימור אנרגיה קינטית", "אף אחד מהם"] 
        }
    ]
};

// --- ניהול הניתוב ---
const app = document.getElementById('app-container');
let currentMode = 'explanations'; // גלובלי כדי לדעת אם אנחנו בסרטונים או תרגול

function router(view, data = null) {
    window.scrollTo(0, 0);
    app.innerHTML = '';

    switch(view) {
        case 'home': renderHomePage(); break;
        case 'subject_select': 
            currentMode = data; 
            renderSubjects(); 
            break;
        case 'content_list': renderContentList(data); break; 
        case 'exercise_list': renderExerciseList(data); break;
        case 'folder_view': renderFolderContent(data); break;
        case 'active_exercise': renderActiveExercise(data); break;
        case 'admin': renderAdminLogin(); break;
        default: renderHomePage();
    }
}

// --- דפים ופונקציות רנדר ---

const testimonialsData = [
    { name: "יהונתן אדיב", text: "הסרטונים המפורטים לא הותירו לי שום בעיה בפתרון התרגילים. מומלץ בחום!", img: "https://i.pravatar.cc/150?u=1" },
    { name: "סתיו שיריזלי", text: "הסימולציות עוזרות להבין את החומר באמת, ולא רק לשנן נוסחאות.", img: "https://i.pravatar.cc/150?u=2" },
    { name: "ניתי ווליך", text: "האתר הכי טוב שמצאתי לבגרות. הכל מסודר, נקי וברור מאוד.", img: "https://i.pravatar.cc/150?u=3" },
    { name: "רוני אלוני", text: "מערכת התרגול החדשה פשוט גאונית. הפידבק המיידי עוזר לי לתקן טעויות במקום.", img: "https://i.pravatar.cc/150?u=4" },
    { name: "עידו קופר", text: "סוף סוף אתר שלא נראה משנות ה-90. כיף ללמוד כאן פיזיקה!", img: "https://i.pravatar.cc/150?u=5" },
    { name: "מאיה לוי", text: "הצלחתי לעבור את המבחן במכניקה רק בזכות התרגול של התנע והקינמטיקה כאן.", img: "https://i.pravatar.cc/150?u=6" },
    { name: "איתי גלזר", text: "הסברים בגובה העיניים. מרגיש כאילו יש לי מורה פרטי בתוך המחשב.", img: "https://i.pravatar.cc/150?u=7" },
    { name: "דניאל מזרחי", text: "הגרפים בקינמטיקה תמיד סיבכו אותי, השאלות כאן סידרו לי את הראש.", img: "https://i.pravatar.cc/150?u=8" }
];

function renderHomePage() {
    app.innerHTML = `
        <div class="hero">
            <h1>PhysicsMaster 🚀</h1>
            <p>המקום שלך להצטיין בפיזיקה לבגרות</p>
            <button class="btn-main" onclick="scrollToSection('learning')">התחל ללמוד</button>
        </div>

        <section id="learning">
            <h2 class="section-title">📚 מרכז הלמידה</h2>
            <div class="grid-full">
                ${contentData.categories.map(cat => `
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
    <div style="max-width:900px; margin:0 auto; text-align: right; line-height: 1.8;">
        <p style="font-size:1.4rem; color: var(--dark); font-weight: 700;">הופכים את הפיזיקה מחובה – לחוויה.</p>
        
        <p style="font-size:1.2rem; margin-top: 20px;">
            אתר <strong>PhysicsMaster</strong> הוקם כדי לספק לתלמידי התיכון בישראל מעטפת לימודית מלאה לבגרות בפיזיקה. 
            אנחנו מבינים שנושאים כמו <em>תרשים כוחות</em> או <em>שימור תנע</em> יכולים להיות מאתגרים, ולכן בנינו מערכת שמשלבת:
        </p>
        
        <ul style="font-size:1.1rem; margin-top: 15px; list-style: none; padding: 0;">
            <li>✅ <strong>למידה עצמית:</strong> סרטוני הסבר ממוקדים לכל נושא בבגרות.</li>
            <li>✅ <strong>תרגול חכם:</strong> מאות שאלות עם משוב מיידי לתיקון טעויות בזמן אמת.</li>
            <li>✅ <strong>הבנה עמוקה:</strong> סימולציות ויזואליות שממחישות את חוקי הפיזיקה בפעולה.</li>
        </ul>

        <p style="font-size:1.2rem; margin-top: 20px; font-style: italic; border-right: 4px solid var(--primary); padding-right: 15px;">
            המשימה שלנו היא אחת: להביא אותך לבגרות כשאתה לא רק יודע להציב בנוסחאות, אלא באמת מבין מה קורה בשטח.
        </p>
    </div>
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
                    <input type="text" id="c-name" placeholder="שם מלא" required>
                    <input type="email" id="c-email" placeholder="אימייל" required>
                    <textarea id="c-msg" rows="5" placeholder="הודעה..." required></textarea>
                    <button type="submit" id="submit-btn" class="btn-main" style="width:100%">שלח הודעה</button>
                </form>
            </div>
        </section>
    `;
}

function handleCategoryClick(catId) {
    if (catId === 'explanations' || catId === 'exercises') {
        router('subject_select', catId);
    } else {
        alert('קטגוריה זו בבנייה כרגע...');
    }
}

function renderSubjects() {
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">${currentMode === 'exercises' ? 'תרגול שאלות' : 'סרטונים והסברים'}</h2>
            <div class="grid-full">
                ${contentData.subjects.map(sub => `
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
    app.innerHTML = html;
}

function handleSubjectClick(subId) {
    if (subId !== 'mechanics') {
        alert('נושא זה יעלה בקרוב!');
        return;
    }
    
    if (currentMode === 'exercises') {
        router('exercise_list', 'mechanics');
    } else {
        router('content_list', 'mechanics');
    }
}

// רנדור רשימת התרגילים (בול כמו הסרטונים)
function renderExerciseList(subjectId) {
    const items = contentData[subjectId + '_exercises'];
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">מכניקה - רשימת תרגול</h2>
            <div class="grid-full">
                ${items.map(item => `
                    <div class="card" onclick="router('active_exercise', '${item.id}')" style="background: ${item.image}">
                        <div class="card-overlay">
                            <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-pen-to-square"></i></div>
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                            <button class="card-btn">התחל תרגול</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-back" onclick="router('subject_select', 'exercises')">חזור לנושאים</button>
        </section>
    `;
    app.innerHTML = html;
}

function renderContentList(subjectId) {
    const items = contentData[subjectId + '_content'];
    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">מכניקה - תכנים</h2>
            <div class="grid-full">
                ${items.map(item => {
                    if (item.type === 'folder') {
                        return `
                            <div class="card" onclick="router('folder_view', '${item.id}')" style="background: ${item.image}">
                                <div class="card-overlay">
                                    <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-folder-open"></i></div>
                                    <h3>${item.title}</h3>
                                    <p>${item.desc}</p>
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
    app.innerHTML = html;
}

function renderActiveExercise(exId) {
    const questions = questionsBank[exId];
    if (!questions) { 
        app.innerHTML = `
            <section style="min-height:100vh;">
                <h2 class="section-title">בקרוב...</h2>
                <p>אנחנו עובדים על שאלות חדשות לנושא זה.</p>
                <button class="btn-back" onclick="router('exercise_list', 'mechanics')">חזור לרשימה</button>
            </section>`; 
        return; 
    }

    let html = `
        <section style="min-height:100vh; padding-top:40px;">
            <h2 class="section-title">תרגול שאלות</h2>
            <div class="form-container" style="text-align:right; direction:rtl; max-width:800px;">
                <div id="exercise-container">
                    ${questions.map((q, i) => `
                        <div class="question-block" style="margin-bottom:30px; border: 2px solid #f1f5f9; padding:25px; border-radius:20px; transition: all 0.4s ease; background: #fff;">
                            <p style="font-size:1.3rem; font-weight:700; margin-bottom:15px; color: var(--dark);">${i+1}. ${q.q}</p>
                            <div class="options-group">
                                ${q.options.map(opt => `
                                    <label style="display:block; margin:12px 0; cursor:pointer; font-size:1.1rem; padding:8px; border-radius:8px; transition: 0.2s;">
                                        <input type="radio" name="q${i}" value="${opt}" style="margin-left:10px; transform: scale(1.2);"> 
                                        ${opt}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-main" style="width:100%; margin-top:20px; font-size:1.5rem;" onclick="checkAnswers('${exId}')">
                    <i class="fa-solid fa-check-double"></i> בדוק תשובות
                </button>
            </div>
            <button class="btn-back" onclick="router('exercise_list', 'mechanics')">חזור לרשימה</button>
        </section>
    `;
    app.innerHTML = html;
}

function renderFolderContent(folderId) {
    const items = contentData[folderId];
    let html = `
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
            <button class="btn-back" onclick="router('content_list', 'mechanics')">חזור למכניקה</button>
        </section>
    `;
    app.innerHTML = html;
}

// --- פונקציות עזר ---
function scrollToSection(id) {
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
    return `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
}

function handleContact(e) {
    e.preventDefault();
    alert('ההודעה נשלחה בהצלחה!');
}

function renderAdminLogin() {
    app.innerHTML = `<section><div class="form-container"><h2>כניסת מנהל</h2><input type="password" id="pass" placeholder="סיסמה"><button class="btn-main" onclick="alert('גישה נדחתה')">כנס</button></div><button class="btn-back" onclick="router('home')">חזור</button></section>`;
}

window.onload = function() {
    if (checkDeviceSupport()) {
        router('home');
    }
};

function scrollTestimonials(direction) {
    const container = document.getElementById('testimonials-container');
    container.scrollBy({ left: direction * 350 * -1, behavior: 'smooth' });
}

function checkAnswers(exId) {
    const questions = questionsBank[exId];
    let score = 0;
    let summaryHTML = '';
    
    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = document.getElementsByName(`q${i}`)[0].closest('.question-block');
        
        let isCorrect = selected && selected.value === q.a;
        
        if (isCorrect) {
            score++;
            questionDiv.style.border = "2px solid #22c55e"; // מסגרת ירוקה
            questionDiv.style.background = "#f0fdf4";
        } else {
            questionDiv.style.border = "2px solid #ef4444"; // מסגרת אדומה
            questionDiv.style.background = "#fef2f2";
        }
        
        // בניית פירוט לסיכום
        summaryHTML += `
            <div style="text-align:right; margin-bottom:10px; color: ${isCorrect ? '#15803d' : '#b91c1c'}">
                <strong>שאלה ${i+1}:</strong> ${isCorrect ? '✅ צדקת!' : `❌ טעית (התשובה הנכונה: ${q.a})`}
            </div>
        `;
    });

    const finalScore = Math.round((score / questions.length) * 100);

    // יצירת אלמנט הסיכום והזרקתו מתחת לשאלות
    const resultDiv = document.getElementById('exercise-results') || document.createElement('div');
    resultDiv.id = 'exercise-results';
    resultDiv.className = 'summary-card';
    resultDiv.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 15px;">סיכום התוצאות 🏁</h3>
        <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 20px;">ציון סופי: ${finalScore}</div>
        <div style="margin-bottom: 25px;">${summaryHTML}</div>
        <button class="btn-main" onclick="router('exercise_list', 'mechanics')">חזור לרשימת התרגילים</button>
    `;

    // הוספה לדף אם זה עוד לא קיים
    if (!document.getElementById('exercise-results')) {
        document.getElementById('exercise-container').after(resultDiv);
    }
    
    // גלילה חלקה לתוצאה
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// אתחול Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBzZVWudrgjb-Qi-ln5Qm0u4L0PUlwbjUc",
  authDomain: "physicsmaster-app.firebaseapp.com",
  projectId: "physicsmaster-app",
  storageBucket: "physicsmaster-app.firebasestorage.app",
  messagingSenderId: "389250837755",
  appId: "1:389250837755:web:c088a4021e28ce0132945e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let isSignUpMode = false;

// מאזין למצב התחברות
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('logged-in-view').style.display = 'flex';
        document.getElementById('logged-out-view').style.display = 'none';
        document.getElementById('display-name').innerText = user.email.split('@')[0];
    } else {
        document.getElementById('logged-in-view').style.display = 'none';
        document.getElementById('logged-out-view').style.display = 'block';
    }
});

function toggleModal(show) {
    document.getElementById('login-modal').style.display = show ? 'flex' : 'none';
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('modal-title').innerText = isSignUpMode ? 'הרשמה' : 'התחברות';
    document.getElementById('toggle-text').innerText = isSignUpMode ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם כאן';
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;

    try {
        if (isSignUpMode) {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("נרשמת בהצלחה!");
        } else {
            await auth.signInWithEmailAndPassword(email, pass);
            alert("התחברת בהצלחה!");
        }
        toggleModal(false);
    } catch (error) {
        alert("שגיאה: " + error.message);
    }
}

function handleLogout() {
    auth.signOut();
}

