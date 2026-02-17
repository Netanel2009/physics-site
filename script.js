// --- Firebase Config ---
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

// --- Auth Logic ---
let isSignUpMode = false;
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

function toggleModal(show) { document.getElementById('login-modal').style.display = show ? 'flex' : 'none'; }
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('modal-title').innerText = isSignUpMode ? 'הרשמה' : 'התחברות';
    document.getElementById('toggle-text').innerText = isSignUpMode ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם כאן';
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    try {
        if (isSignUpMode) await auth.createUserWithEmailAndPassword(email, pass);
        else await auth.signInWithEmailAndPassword(email, pass);
        toggleModal(false);
    } catch (e) { alert(e.message); }
}
function handleLogout() { auth.signOut(); }

// --- Content Data ---
const contentData = {
    categories: [
        { id: 'explanations', title: 'סרטונים 📚', color: '#3b82f6' },
        { id: 'exercises', title: 'תרגול 📝', color: '#ef4444' },
        { id: 'simulations', title: 'סימולציות 🧪', color: '#10b981' }
    ],
    subjects: [
        { id: 'mechanics', title: 'מכניקה', desc: 'קינמטיקה ודינמיקה' },
        { id: 'electricity', title: 'חשמל', desc: 'מעגלים ושדות' }
    ]
};

// --- Router System ---
const app = document.getElementById('app-container');

function router(view, data = null) {
    app.innerHTML = '';
    window.scrollTo(0,0);

    if (view === 'home') renderHome();
    else if (view === 'subjects') renderSubjects(data);
}

function renderHome() {
    app.innerHTML = `
        <section class="hero" style="text-align:center; padding: 100px 5%; background: var(--dark); color: white;">
            <h1>ברוכים הבאים ל-PhysicsMaster</h1>
            <p>המקום שלך להצטיין בפיזיקה</p>
        </section>
        <div class="grid-container" id="learning">
            ${contentData.categories.map(cat => `
                <div class="card" onclick="router('subjects', '${cat.id}')">
                    <h3>${cat.title}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSubjects(categoryId) {
    app.innerHTML = `
        <h2 style="text-align:center; margin-top:40px;">בחר נושא</h2>
        <div class="grid-container">
            ${contentData.subjects.map(sub => `
                <div class="card" onclick="alert('בקרוב...')">
                    <h3>${sub.title}</h3>
                    <p>${sub.desc}</p>
                </div>
            `).join('')}
        </div>
        <button class="btn-main" onclick="router('home')" style="margin: 20px auto; display:block;">חזור</button>
    `;
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else router('home');
}

window.onload = () => router('home');
