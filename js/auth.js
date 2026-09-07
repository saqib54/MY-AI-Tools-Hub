// ============================================
// ToolHub Auth Module — auth.js
// ============================================

const AUTH_USERS_KEY   = '_th_u';
const AUTH_SESSION_KEY = '_th_s';
const AUTH_PEPPER      = 'th_pepper_2026_xK9';

// ── Super user (owner) credentials ───────────
// These are checked BEFORE normal user lookup
const _SU_EMAIL = 'msaqibali433@gmail.com';
const _SU_PASS  = 'Saqib@23';
const _SU_NAME  = 'Saqib Ali';

// ── Utility ──────────────────────────────────
const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(AUTH_PEPPER + salt + password + salt.split('').reverse().join(''));
  const buf = await crypto.subtle.digest('SHA-256', data);
  const data2 = enc.encode(hex(buf) + AUTH_PEPPER + password.length);
  const buf2 = await crypto.subtle.digest('SHA-256', data2);
  return hex(buf2);
}

function randomHex(n = 16) {
  return hex(crypto.getRandomValues(new Uint8Array(n)));
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}'); }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
    if (!s || Date.now() > s.expiresAt) { localStorage.removeItem(AUTH_SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

function saveSession(session) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

// ── Public API ────────────────────────────────
const Auth = {

  /** Register new user. Returns { ok, error } */
  async register(name, email, password) {
    email = email.trim().toLowerCase();
    name  = name.trim();
    if (!name || name.length < 2)
      return { ok: false, error: 'Name must be at least 2 characters.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, error: 'Enter a valid email address.' };
    if (password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters.' };
    // Block owner email from registering as normal user
    if (email === _SU_EMAIL.toLowerCase())
      return { ok: false, error: 'This email is not available.' };

    const users = getUsers();
    if (users[email]) return { ok: false, error: 'An account with this email already exists.' };

    const salt = randomHex(16);
    const hash = await hashPassword(password, salt);
    const id   = randomHex(8);
    users[email] = { id, name, email, hash, salt, createdAt: Date.now() };
    saveUsers(users);

    const token = randomHex(32);
    saveSession({ id, name, email, token, isOwner: false, expiresAt: Date.now() + 7 * 86400000 });

    if (window.Tracker) Tracker.log('register', { name, email });
    // Sync to Firebase so admin sees this user
    if (window.FirebaseTracker) {
      FirebaseTracker.saveUser({ id, name, email, createdAt: Date.now() });
      FirebaseTracker.log('register', { name, email });
    }
    return { ok: true, user: { id, name, email }, redirect: null };

  },

  /** Login. Returns { ok, error, redirect } */
  async login(email, password) {
    email = email.trim().toLowerCase();

    // ── Owner / super-user check ──────────────
    if (email === _SU_EMAIL.toLowerCase() && password === _SU_PASS) {
      const token = randomHex(32);
      saveSession({
        id: 'owner',
        name: _SU_NAME,
        email: _SU_EMAIL,
        token,
        isOwner: true,
        expiresAt: Date.now() + 30 * 86400000   // 30 days for owner
      });
      if (window.Tracker) Tracker.log('owner_login', { email });
      return { ok: true, user: { id: 'owner', name: _SU_NAME, email: _SU_EMAIL }, redirect: '/admin-view.html' };
    }

    // ── Normal user ───────────────────────────
    const users = getUsers();
    const user  = users[email];
    if (!user) return { ok: false, error: 'Email or password is incorrect.' };

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) return { ok: false, error: 'Email or password is incorrect.' };

    const token = randomHex(32);
    saveSession({ id: user.id, name: user.name, email, token, isOwner: false, expiresAt: Date.now() + 7 * 86400000 });

    if (window.Tracker) Tracker.log('login', { email });
    // Sync to Firebase so admin sees login activity
    if (window.FirebaseTracker) {
      FirebaseTracker.saveUser({ id: user.id, name: user.name, email, createdAt: user.createdAt });
      FirebaseTracker.log('login', { name: user.name, email });
    }
    return { ok: true, user: { id: user.id, name: user.name, email }, redirect: null };
  },

  /** Logout current user */
  logout() {
    const session = getSession();
    if (session && window.Tracker) Tracker.log('logout', { email: session.email });
    localStorage.removeItem(AUTH_SESSION_KEY);
  },

  /** Get current user or null */
  getCurrentUser() { return getSession(); },

  /** Is current user the owner? */
  isOwner() {
    const s = getSession();
    return !!(s && s.isOwner);
  },

  /** Redirect to auth page if not logged in */
  requireAuth() {
    const s = getSession();
    if (!s) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      location.href = '/auth.html?redirect=' + redirect;
      return false;
    }
    // If owner lands on a tool page, let them through too
    return true;
  },

  /** Require owner access — redirect non-owners to home */
  requireOwner() {
    const s = getSession();
    if (!s) { location.href = '/auth.html'; return false; }
    if (!s.isOwner) { location.href = '/index.html'; return false; }
    return true;
  },

  /** Check if logged in */
  isLoggedIn() { return !!getSession(); }
};

window.Auth = Auth;
