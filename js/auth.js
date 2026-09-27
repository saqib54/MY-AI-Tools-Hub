// ============================================
// ToolHub Auth Module — auth.js
// Supports Email & Supabase Free Google OAuth Login
// ============================================

const AUTH_USERS_KEY   = '_th_u';
const AUTH_SESSION_KEY = '_th_s';
const AUTH_PEPPER      = 'th_pepper_2026_xK9';

// ── Super user (owner) credentials ───────────
const _SU_EMAIL = 'msaqibali433@gmail.com';
const _SU_PASS  = 'Saqib@23';
const _SU_NAME  = 'Saqib Ali';

const SUPABASE_OAUTH_URL = "https://kjmyuubscymysykakfns.supabase.co";
const SUPABASE_OAUTH_KEY = "sb_publishable_oeIHYlIugfl05zJzGUGc-Q_K4fK1yYA";

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

// ── Handle Supabase Google OAuth Redirect Callback ─────────
async function handleOAuthCallback() {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token=')) return;

    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    if (!accessToken) return;

    const res = await fetch(`${SUPABASE_OAUTH_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_OAUTH_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const user = await res.json();
      const email = (user.email || '').toLowerCase();
      const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
      const id = user.id || 'g_' + Date.now();
      const isOwner = (email === _SU_EMAIL.toLowerCase());
      const isPro = isOwner;

      const session = {
        id,
        name,
        email,
        token: accessToken,
        isOwner,
        isPro,
        expiresAt: Date.now() + 30 * 86400000
      };

      saveSession(session);

      if (window.SupabaseTracker) {
        SupabaseTracker.saveUser({ id, name, email, isPro, createdAt: Date.now() });
        SupabaseTracker.log('login', { name, email, provider: 'google' });
      }
      if (window.Tracker) Tracker.log('login', { name, email, provider: 'google' });

      history.replaceState(null, '', window.location.pathname);
      if (window.Common) Common.showToast(`🎉 Logged in with Google as ${name}!`);
      if (window.Common) Common.initPage();
      if (window.App && window.App.handleRoute) window.App.handleRoute();
      if (isOwner) location.href = 'admin-view.html';
    }
  } catch (err) {
    console.warn('Google OAuth handler err:', err);
  }
}

// Run OAuth check on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleOAuthCallback);
  } else {
    handleOAuthCallback();
  }
}

// ── Email Validation Helper ──────────────────
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email address is required.' };
  }

  const clean = email.trim().toLowerCase();

  // Length check (min 6 chars, max 254 chars according to RFC 5321)
  if (clean.length < 6 || clean.length > 254) {
    return { valid: false, reason: 'Email length must be between 6 and 254 characters.' };
  }

  // Must contain exactly one @
  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Email must contain exactly one "@" symbol.' };
  }

  const [user, domain] = parts;

  // Username validation
  if (!user || user.length < 1 || user.length > 64) {
    return { valid: false, reason: 'Invalid username before "@".' };
  }
  if (user.startsWith('.') || user.endsWith('.') || user.includes('..')) {
    return { valid: false, reason: 'Username cannot start/end with a dot or contain ".." .' };
  }

  // Domain validation
  if (!domain || domain.length < 4 || !domain.includes('.')) {
    return { valid: false, reason: 'Domain must be valid (e.g. gmail.com).' };
  }
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
    return { valid: false, reason: 'Domain cannot start/end with a dot or contain ".." .' };
  }

  // TLD check
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]{2,10}$/.test(tld)) {
    return { valid: false, reason: 'Invalid top-level domain extension (e.g. .com, .org, .net).' };
  }

  // Check for invalid or disposable fake test domains
  const invalidDomains = [
    'test.com', 'example.com', 'foo.bar', 'fake.com', 'asdf.com', 
    'temp.com', 'aaa.com', '123.com', 'sample.com', 'domain.com', 
    'mailinator.com', 'yopmail.com', 'tempmail.com', 'dispostable.com',
    'guerrillamail.com', '10minutemail.com', 'trashmail.com'
  ];
  if (invalidDomains.includes(domain)) {
    return { valid: false, reason: 'Disposable or fake test email domains are not allowed.' };
  }

  // Strict RFC 5322 regex
  const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!rfcRegex.test(clean)) {
    return { valid: false, reason: 'Enter a valid email address format (e.g. user@gmail.com).' };
  }

  return { valid: true };
}

// ── Public API ────────────────────────────────
const Auth = {

  validateEmail,

  /** Login via Supabase Google OAuth */
  loginWithGoogle() {
    const redirectUrl = window.location.origin + window.location.pathname;
    const googleUrl = `${SUPABASE_OAUTH_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
    
    if (window.Common) Common.showToast('🚀 Redirecting to Google Login...');
    window.location.href = googleUrl;
  },

  /** Register new user. Returns { ok, error } */
  async register(name, email, password) {
    email = email.trim().toLowerCase();
    name  = name.trim();
    if (!name || name.length < 2)
      return { ok: false, error: 'Name must be at least 2 characters.' };

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid)
      return { ok: false, error: emailCheck.reason };

    if (password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters.' };

    const users = getUsers();
    if (users[email]) return { ok: false, error: 'An account with this email already exists.' };

    const isOwner = (email === _SU_EMAIL.toLowerCase());
    const isPro = isOwner;

    const salt = randomHex(16);
    const hash = await hashPassword(password, salt);
    const id   = isOwner ? 'owner' : randomHex(8);
    users[email] = { id, name, email, hash, salt, isOwner, isPro, createdAt: Date.now() };
    saveUsers(users);

    const token = randomHex(32);
    saveSession({ id, name, email, token, isOwner, isPro, expiresAt: Date.now() + 30 * 86400000 });

    if (window.Tracker) Tracker.log('register', { name, email });
    if (window.SupabaseTracker) {
      SupabaseTracker.saveUser({ id, name, email, isPro, createdAt: Date.now() });
      SupabaseTracker.log('register', { name, email });
    }
    return { ok: true, user: { id, name, email }, redirect: isOwner ? 'admin-view.html' : null };
  },

  /** Login. Returns { ok, error, redirect } */
  async login(email, password) {
    email = email.trim().toLowerCase();
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return { ok: false, error: emailCheck.reason };
    }

    const isOwnerEmail = (email === _SU_EMAIL.toLowerCase());

    const users = getUsers();
    const user  = users[email];

    if (!user) {
      if (isOwnerEmail && password === _SU_PASS) {
        const token = randomHex(32);
        saveSession({
          id: 'owner',
          name: _SU_NAME,
          email: _SU_EMAIL,
          token,
          isOwner: true,
          isPro: true,
          expiresAt: Date.now() + 30 * 86400000
        });
        if (window.Tracker) Tracker.log('owner_login', { email });
        if (window.SupabaseTracker) {
          SupabaseTracker.saveUser({ id: 'owner', name: _SU_NAME, email: _SU_EMAIL, isPro: true, createdAt: Date.now() });
          SupabaseTracker.log('login', { name: _SU_NAME, email: _SU_EMAIL });
        }
        return { ok: true, user: { id: 'owner', name: _SU_NAME, email: _SU_EMAIL }, redirect: 'admin-view.html' };
      }
      return { ok: false, error: 'Email or password is incorrect.' };
    }

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) {
      if (isOwnerEmail && password === _SU_PASS) {
        // Fallback default pass for owner
      } else {
        return { ok: false, error: 'Email or password is incorrect.' };
      }
    }

    const isOwner = user.isOwner || isOwnerEmail;
    const isPro = user.isPro || isOwner;

    const token = randomHex(32);
    saveSession({ id: user.id, name: user.name, email, token, isOwner, isPro, expiresAt: Date.now() + 30 * 86400000 });

    if (window.Tracker) Tracker.log('login', { email });
    if (window.SupabaseTracker) {
      SupabaseTracker.saveUser({ id: user.id, name: user.name, email, isPro, createdAt: user.createdAt });
      SupabaseTracker.log('login', { name: user.name, email });
    }
    return { ok: true, user: { id: user.id, name: user.name, email }, redirect: isOwner ? 'admin-view.html' : null };
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

  /** Is current user Pro? */
  isPro() {
    const s = getSession();
    return !!(s && (s.isPro || s.isOwner));
  },

  /** Redirect to auth page if not logged in */
  requireAuth() {
    const s = getSession();
    if (!s) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      location.href = 'auth.html?redirect=' + redirect;
      return false;
    }
    return true;
  },

  /** Require owner access — redirect non-owners to home */
  requireOwner() {
    const s = getSession();
    if (!s) { location.href = 'auth.html'; return false; }
    if (!s.isOwner) { location.href = 'index.html'; return false; }
    return true;
  },

  /** Check if logged in */
  isLoggedIn() { return !!getSession(); },

  /** Open Auth Modal on SPA (PROTOTYPE SPLIT DESIGN MATCH) */
  openModal(view = 'login') {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div class="modal-card auth-modal-split" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="Auth.closeModal()">✕</button>

        <!-- LEFT VISUAL HERO PANEL (PROTOTYPE MATCH) -->
        <div class="auth-modal-left">
          <div class="nav-logo" style="margin-bottom:20px;">
            <div class="nav-logo-icon">🛠️</div>
            <div class="logo-title" style="font-size:18px;">Tool <span>Hub 2.0</span></div>
          </div>

          <h2 id="auth-left-title" style="font-size:26px;font-weight:900;line-height:1.2;margin-bottom:8px;">Welcome <span style="color:var(--blue);">Back!</span></h2>
          <p id="auth-left-desc" style="font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:24px;">Login to access all your tools, saved files and premium features.</p>

          <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;font-weight:600;margin-bottom:24px;">
            <div style="display:flex;align-items:center;gap:10px;color:var(--text);"><span style="color:var(--blue);font-weight:900;">✓</span> Access all 30+ media & document tools</div>
            <div style="display:flex;align-items:center;gap:10px;color:var(--text);"><span style="color:var(--blue);font-weight:900;">✓</span> 100% Browser-local private file processing</div>
            <div style="display:flex;align-items:center;gap:10px;color:var(--text);"><span style="color:var(--blue);font-weight:900;">✓</span> Sync preferences across all your devices</div>
            <div style="display:flex;align-items:center;gap:10px;color:var(--text);"><span style="color:var(--blue);font-weight:900;">✓</span> Instant processing with zero server uploads</div>
          </div>

          <div class="hero-visual-box" style="padding:16px;background:var(--card);border-radius:16px;text-align:center;">
            <div style="font-size:32px;margin-bottom:4px;">📦</div>
            <div style="font-size:11px;font-weight:800;color:var(--blue);">Your Media Toolkit — Always with You</div>
          </div>
        </div>

        <!-- RIGHT FORM PANEL -->
        <div class="auth-modal-right">
          <div style="margin-bottom:18px;">
            <h3 id="auth-right-heading" style="font-size:20px;font-weight:900;">Login to Tool Hub</h3>
            <p id="auth-right-subheading" style="font-size:12px;color:var(--muted);">Sign in with Google or Email</p>
          </div>

          <!-- GOOGLE ONE-CLICK LOGIN BUTTON -->
          <button type="button" class="btn btn-secondary btn-full" onclick="Auth.loginWithGoogle()" style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;background:var(--card);border:1px solid var(--border);color:var(--text);font-weight:700;padding:12px 18px;border-radius:12px;box-shadow:var(--shadow-sm);cursor:pointer;width:100%;">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.41-1.57-5.13-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.87 10.78c-.19-.53-.3-1.1-.3-1.78s.11-1.25.3-1.78L.97 4.96C.35 6.18 0 7.55 0 9s.35 2.82.97 4.04l2.9-2.26z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0 5.48 0 2.45 2.02.97 4.96l2.9 2.26C4.59 5.05 6.62 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div style="display:flex;align-items:center;margin:14px 0;color:var(--muted);font-size:11px;">
            <div style="flex:1;height:1px;background:var(--border);"></div>
            <span style="padding:0 10px;">or email credentials</span>
            <div style="flex:1;height:1px;background:var(--border);"></div>
          </div>

          <div class="auth-tabs">
            <button type="button" class="auth-tab ${view === 'login' ? 'active' : ''}" onclick="Auth.switchModalTab('login', event)">✉ Email Login</button>
            <button type="button" class="auth-tab ${view === 'register' ? 'active' : ''}" onclick="Auth.switchModalTab('register', event)">✨ Create Account</button>
          </div>

          <div id="modal-form-error" class="form-error" hidden>
            <span>⚠️</span><span id="modal-error-text"></span>
          </div>

          <!-- LOGIN FORM -->
          <div id="modal-login-view" ${view === 'register' ? 'hidden' : ''}>
            <form id="modal-login-form">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" id="modal-login-email" placeholder="you@example.com" required>
                <div id="modal-login-email-feedback" style="font-size:11px;margin-top:4px;display:none;font-weight:600;"></div>
              </div>
              <div class="form-group">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <label class="form-label">Password</label>
                </div>
                <div style="position:relative;">
                  <input class="form-input" type="password" id="modal-login-password" placeholder="Enter your password" required style="width:100%;padding-right:40px;">
                  <button type="button" onclick="const p=document.getElementById('modal-login-password'); p.type=p.type==='password'?'text':'password';" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);font-size:14px;">👁</button>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;font-size:12px;color:var(--muted);">
                <input type="checkbox" id="modal-remember" checked>
                <label for="modal-remember">Remember me on this browser</label>
              </div>
              <button class="btn btn-primary btn-full btn-lg" type="submit" id="modal-login-btn">Login →</button>
            </form>
          </div>

          <!-- REGISTER FORM -->
          <div id="modal-register-view" ${view === 'login' ? 'hidden' : ''}>
            <form id="modal-register-form">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input class="form-input" type="text" id="modal-reg-name" placeholder="Enter your full name" required minlength="2">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" id="modal-reg-email" placeholder="you@example.com" required>
                <div id="modal-reg-email-feedback" style="font-size:11px;margin-top:4px;display:none;font-weight:600;"></div>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input class="form-input" type="password" id="modal-reg-password" placeholder="Create a password (min. 6 chars)" required minlength="6">
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;font-size:11.5px;color:var(--muted);">
                <input type="checkbox" id="modal-terms-check" checked required>
                <label for="modal-terms-check">I agree to the <a href="#terms" style="color:var(--blue);">Terms of Service</a> and <a href="#privacy" style="color:var(--blue);">Privacy Policy</a></label>
              </div>
              <button class="btn btn-primary btn-full btn-lg" type="submit" id="modal-reg-btn">Sign Up →</button>
            </form>
          </div>
        </div>
      </div>
    `;

    modal.onclick = () => Auth.closeModal();

    setTimeout(() => modal.classList.add('open'), 10);

    // Live Email Validation Listeners
    const bindLiveValidation = (inputId, feedbackId) => {
      const el = document.getElementById(inputId);
      const fb = document.getElementById(feedbackId);
      if (!el || !fb) return;
      el.addEventListener('input', () => {
        const val = el.value.trim();
        if (!val) {
          fb.style.display = 'none';
          el.style.borderColor = '';
          return;
        }
        const res = Auth.validateEmail(val);
        fb.style.display = 'block';
        if (res.valid) {
          fb.style.color = 'var(--green, #10b981)';
          fb.innerHTML = '✓ Valid email address format';
          el.style.borderColor = 'var(--green, #10b981)';
        } else {
          fb.style.color = '#ef4444';
          fb.innerHTML = '⚠️ ' + res.reason;
          el.style.borderColor = '#ef4444';
        }
      });
    };

    bindLiveValidation('modal-login-email', 'modal-login-email-feedback');
    bindLiveValidation('modal-reg-email', 'modal-reg-email-feedback');

    // Bind login form
    document.getElementById('modal-login-form').onsubmit = async e => {
      e.preventDefault();
      const email = document.getElementById('modal-login-email').value;
      const pass = document.getElementById('modal-login-password').value;
      const res = await Auth.login(email, pass);
      if (res.ok) {
        Auth.closeModal();
        if (window.Common) Common.showToast(`✅ Welcome back, ${res.user.name}!`);
        if (window.Common) Common.initPage();
        if (window.App && window.App.handleRoute) window.App.handleRoute();
        if (res.redirect && Auth.isOwner()) location.href = res.redirect;
      } else {
        Auth.showModalError(res.error);
      }
    };

    // Bind register form
    document.getElementById('modal-register-form').onsubmit = async e => {
      e.preventDefault();
      const name = document.getElementById('modal-reg-name').value;
      const email = document.getElementById('modal-reg-email').value;
      const pass = document.getElementById('modal-reg-password').value;
      const res = await Auth.register(name, email, pass);
      if (res.ok) {
        Auth.closeModal();
        if (window.Common) Common.showToast(`🎉 Account created! Welcome, ${res.user.name}!`);
        if (window.Common) Common.initPage();
        if (window.App && window.App.handleRoute) window.App.handleRoute();
      } else {
        Auth.showModalError(res.error);
      }
    };
  },

  switchModalTab(view, evt) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');
    document.getElementById('modal-login-view').hidden = (view !== 'login');
    document.getElementById('modal-register-view').hidden = (view !== 'register');
    document.getElementById('modal-form-error').hidden = true;
  },

  showModalError(msg) {
    const errBox = document.getElementById('modal-form-error');
    document.getElementById('modal-error-text').textContent = msg;
    errBox.hidden = false;
  },

  closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
  }
};

window.Auth = Auth;
