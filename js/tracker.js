// ============================================
// ToolHub Silent Tracker — tracker.js
// Logs user activity silently to localStorage & Firebase
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

const Tracker = {

  /** Log any event with user context */
  log(event, data = {}) {
    try {
      const raw  = localStorage.getItem(TRACK_KEY);
      const logs = raw ? JSON.parse(raw) : [];

      // Get current session user info
      const session = this._getSession();

      const entry = {
        t:     Date.now(),
        dt:    new Date().toISOString(),
        ev:    event,
        uid:   session ? session.id    : null,
        email: session ? session.email : null,
        name:  session ? session.name  : null,
        ua:    navigator.userAgent.slice(0, 100),
      };

      // Merge extra data (tool, fileName, etc.)
      Object.assign(entry, data);

      logs.push(entry);

      // Trim to max
      if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);

      localStorage.setItem(TRACK_KEY, JSON.stringify(logs));

      // ── Sync to Supabase Cloud (Non-blocking) ────────────
      if (window.SupabaseTracker && typeof window.SupabaseTracker.log === 'function') {
        window.SupabaseTracker.log(event, data);
      }
    } catch (e) {
      // Silent fail — never break the page
    }
  },

  /** Log a tool use action */
  logToolUse(tool, action, extra = {}) {
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

