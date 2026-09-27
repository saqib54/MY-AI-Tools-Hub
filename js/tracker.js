// ============================================
// ToolHub Silent Tracker — tracker.js
// Logs user activity silently to localStorage & Supabase Cloud
// Keys must match admin-view.html constants
// ============================================

const TRACK_KEY = '_th_evts';   // same as KEY_LOGS in admin-view.html
const MAX_LOGS  = 3000;

// Dynamic auto-loader for supabase-tracker.js
if (typeof window !== 'undefined' && !document.querySelector('script[data-sb-tracker]')) {
  const script = document.createElement('script');
  script.dataset.sbTracker = '1';
  script.src = 'js/supabase-tracker.js';
  document.head.appendChild(script);
}

function parseDeviceStr(ua) {
  if (!ua) return 'Unknown Device';
  let os = 'Unknown OS';
  if (/android/i.test(ua)) os = '📱 Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = '📱 iOS';
  else if (/windows/i.test(ua)) os = '💻 Windows';
  else if (/macintosh|mac os/i.test(ua)) os = '💻 Mac';
  else if (/linux/i.test(ua)) os = '💻 Linux';

  let browser = '';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return browser ? `${os} (${browser})` : os;
}

const Tracker = {

  /** Log any event with user & device context */
  log(event, data = {}) {
    try {
      const raw  = localStorage.getItem(TRACK_KEY);
      const logs = raw ? JSON.parse(raw) : [];

      // Get current session user info
      const session = this._getSession();

      const entry = {
        t:       Date.now(),
        dt:      new Date().toISOString(),
        ev:      event,
        uid:     data.uid   || (session ? session.id    : null),
        email:   data.email || (session ? session.email : null),
        name:    data.name  || (session ? session.name  : null),
        device:  data.device || parseDeviceStr(navigator.userAgent),
        ua:      (data.ua || navigator.userAgent).slice(0, 120),
        ...data
      };

      logs.push(entry);

      // Trim to max
      if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);

      localStorage.setItem(TRACK_KEY, JSON.stringify(logs));

      // ── Sync to Supabase Cloud (Non-blocking) ────────────
      if (window.SupabaseTracker && typeof window.SupabaseTracker.log === 'function') {
        window.SupabaseTracker.log(event, entry);
      }
    } catch (e) {
      // Silent fail — never break caller
    }
  },

  /** Log a tool use action */
  logToolUse(tool, action = 'use', extra = {}) {
    this.log('tool_use', { tool, action, ...extra });
  },

  /** Log a file download */
  logDownload(tool, fileName, origSize, newSize, extra = {}) {
    this.log('download', {
      tool,
      fileName,
      origSize,
      newSize,
      saving: (origSize > 0)
        ? Math.round((1 - newSize / origSize) * 100)
        : null,
      ...extra,
    });
  },

  /** Internal: get current auth session */
  _getSession() {
    try {
      const raw = localStorage.getItem('_th_s');
      if (!raw) return null;
      const s = JSON.parse(raw);
      return (s && Date.now() < s.expiresAt) ? s : null;
    } catch {
      return null;
    }
  },
};

window.Tracker = Tracker;
