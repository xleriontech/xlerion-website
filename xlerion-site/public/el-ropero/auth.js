(function () {
    const API_BASE = 'http://127.0.0.1:8000/api';

    function qs(sel) { return document.querySelector(sel); }

    // Optional Firebase integration: if you provide `window.FIREBASE_CONFIG` (see index.html),
    // this script will load the Firebase SDK and use Firebase Authentication.
    let useFirebase = false;
    async function initFirebaseIfConfigured() {
        if (!window.FIREBASE_CONFIG) return false;
        if (useFirebase) return true;
        try {
            await new Promise((resolve, reject) => {
                const s1 = document.createElement('script');
                s1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
                s1.onload = () => {
                    const s2 = document.createElement('script');
                    s2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
                    s2.onload = resolve;
                    s2.onerror = reject;
                    document.head.appendChild(s2);
                };
                s1.onerror = reject;
                document.head.appendChild(s1);
            });
            firebase.initializeApp(window.FIREBASE_CONFIG);
            useFirebase = !!firebase.auth();
            return useFirebase;
        } catch (err) {
            console.warn('Firebase SDK failed to load', err);
            return false;
        }
    }

    const btnLogin = qs('#btnLogin');
    const btnRegister = qs('#btnRegister');
    const authModal = qs('#authModal');
    const authClose = qs('#authClose');
    const authTitle = qs('#authTitle');
    const authForm = qs('#authForm');
    const nameInput = qs('#name');
    const emailInput = qs('#email');
    const passwordInput = qs('#password');
    const passwordConfirmWrap = qs('#passwordConfirmWrap');
    const passwordConfirm = qs('#password_confirmation');
    const submitAuth = qs('#submitAuth');
    const authMessage = qs('#authMessage');

    let mode = 'login'; // or 'register'

    function openModal(m) {
        mode = m;
        authMessage.textContent = '';
        if (m === 'login') {
            authTitle.textContent = 'Iniciar Sesión';
            nameInput.style.display = 'none';
            passwordConfirmWrap.style.display = 'none';
        } else {
            authTitle.textContent = 'Registrarse';
            nameInput.style.display = 'block';
            passwordConfirmWrap.style.display = 'block';
        }
        authModal.style.display = 'flex';
    }

    function closeModal() { authModal.style.display = 'none'; }

    authClose && authClose.addEventListener('click', closeModal);
    btnLogin && btnLogin.addEventListener('click', () => openModal('login'));
    btnRegister && btnRegister.addEventListener('click', () => openModal('register'));

    async function post(path, body) {
        try {
            const res = await fetch(API_BASE + path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await res.json().catch(() => null);
            return { ok: res.ok, status: res.status, json };
        } catch (err) {
            return { ok: false, error: err };
        }
    }

    submitAuth && submitAuth.addEventListener('click', async () => {
        authMessage.style.color = 'crimson';
        authMessage.textContent = '';
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const password_confirmation = passwordConfirm.value;

        if (!email || !password) { authMessage.textContent = 'Email y contraseña son requeridos.'; return; }

        if (mode === 'register') {
            if (!name) { authMessage.textContent = 'Nombre requerido para registro.'; return; }
            if (password !== password_confirmation) { authMessage.textContent = 'Las contraseñas no coinciden.'; return; }

            // If Firebase configured, use Firebase Auth and exchange id_token with backend
            if (window.FIREBASE_CONFIG) {
                authMessage.textContent = 'Registrando con Firebase...';
                try {
                    await initFirebaseIfConfigured();
                    const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    await userCred.user.updateProfile({ displayName: name });
                    const idToken = await userCred.user.getIdToken();
                    const r = await post('/register', { id_token: idToken, device_name: 'web' });
                    if (r.ok) {
                        authMessage.style.color = 'green';
                        authMessage.textContent = 'Registro correcto.';
                        if (r.json && r.json.token) localStorage.setItem('api_token', r.json.token);
                        setTimeout(closeModal, 800);
                        return;
                    } else if (r.json && r.json.errors) {
                        authMessage.textContent = Object.values(r.json.errors).map(v => Array.isArray(v) ? v.join(' ') : v).join(' ');
                        return;
                    } else if (r.json && r.json.message) { authMessage.textContent = r.json.message; return; }
                    else { authMessage.textContent = 'Error en el registro.'; return; }
                } catch (err) {
                    authMessage.textContent = 'Error Firebase: ' + (err && err.message ? err.message : String(err));
                    return;
                }
            }

            const payload = { name, email, password, password_confirmation, role: 'buyer', device_name: 'web' };
            const r = await post('/register', payload);
            if (r.ok) {
                authMessage.style.color = 'green';
                authMessage.textContent = 'Registro correcto.';
                if (r.json && r.json.token) { localStorage.setItem('api_token', r.json.token); }
                setTimeout(closeModal, 800);
            } else if (r.json && r.json.errors) {
                const e = r.json.errors;
                authMessage.textContent = Object.values(e).map(v => Array.isArray(v) ? v.join(' ') : v).join(' ');
            } else if (r.json && r.json.message) {
                authMessage.textContent = r.json.message;
            } else {
                authMessage.textContent = 'Error en el registro.';
            }
        } else {
            // login
            if (window.FIREBASE_CONFIG) {
                authMessage.textContent = 'Iniciando con Firebase...';
                try {
                    await initFirebaseIfConfigured();
                    const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
                    const idToken = await userCred.user.getIdToken();
                    const r = await post('/login', { id_token: idToken, device_name: 'web' });
                    if (r.ok) {
                        authMessage.style.color = 'green';
                        authMessage.textContent = 'Login correcto.';
                        if (r.json && r.json.token) localStorage.setItem('api_token', r.json.token);
                        setTimeout(closeModal, 500);
                        return;
                    } else if (r.json && r.json.errors) {
                        authMessage.textContent = Object.values(r.json.errors).map(v => Array.isArray(v) ? v.join(' ') : v).join(' ');
                        return;
                    } else if (r.json && r.json.message) { authMessage.textContent = r.json.message; return; }
                    else { authMessage.textContent = 'Error en el login.'; return; }
                } catch (err) {
                    authMessage.textContent = 'Error Firebase: ' + (err && err.message ? err.message : String(err));
                    return;
                }
            }

            const payload = { email, password, device_name: 'web' };
            const r = await post('/login', payload);
            if (r.ok) {
                authMessage.style.color = 'green';
                authMessage.textContent = 'Login correcto.';
                if (r.json && r.json.token) { localStorage.setItem('api_token', r.json.token); }
                setTimeout(closeModal, 500);
            } else if (r.json && r.json.errors) {
                authMessage.textContent = Object.values(r.json.errors).map(v => Array.isArray(v) ? v.join(' ') : v).join(' ');
            } else if (r.json && r.json.message) {
                authMessage.textContent = r.json.message;
            } else {
                authMessage.textContent = 'Error en el login.';
            }
        }
    });

    // expose small helper to get token
    window.roperoAuth = {
        getToken() { return localStorage.getItem('api_token'); },
        logout: async function () {
            const token = this.getToken();
            if (!token) return;
            // call logout endpoint with Authorization
            await fetch(API_BASE + '/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' } });
            localStorage.removeItem('api_token');
        }
    };
})();
