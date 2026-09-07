// ============================================================
// ToolHub Supabase Cloud Tracker — supabase-tracker.js
// Ultra-fast HTTP REST API tracker (zero SDK, lightning fast)
// ============================================================

const SUPABASE_URL = "https://kjmyuubscymysykakfns.supabase.co";
const SUPABASE_KEY = "sb_publishable_oeIHYlIugfl05zJzGUGc-Q_K4fK1yYA";

function _getSession() {
  try {
    const raw = localStorage.getItem('_th_s');
    if (!raw) return null;
    const s = JSON.parse(raw);
    return (s && Date.now() < s.expiresAt) ? s : null;
  } catch { return null; }
}

const SupabaseTracker = {

  /** Log any activity event to Supabase cloud */
  async log(event, data = {}) {
    try {
      const session = _getSession();
      const entry = {
        t:         Date.now(),
        dt:        new Date().toISOString(),
        ev:        event,
        uid:       session?.id    ?? null,
        email:     session?.email ?? null,
        name:      session?.name  ?? null,
        ua:        navigator.userAgent.slice(0, 100),
        ...data,
      };

      fetch(`${SUPABASE_URL}/rest/v1/toolhub_events`, {
        method: 'POST',
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type':  'application/json',
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(entry),
      }).catch(err => console.warn('[Supabase] log fetch err:', err));
    } catch (e) {
      // Never block caller
    }
  },

  /** Log tool use */
  async logToolUse(tool, action, extra = {}) {
    this.log('tool_use', { tool, action, ...extra });
  },

  /** Log a download */
  async logDownload(tool, fileName, origSize, newSize, extra = {}) {
    this.log('download', {
      tool, fileName, origSize, newSize,
      saving: origSize > 0 ? Math.round((1 - newSize / origSize) * 100) : null,
      ...extra,
    });
  },

  /** Save registered user to Supabase cloud */
  async saveUser(user) {
    try {
      if (!user?.email) return;
      const record = {
        email:     user.email.toLowerCase(),
        id:        user.id ?? null,
        name:      user.name ?? null,
        createdAt: user.createdAt ?? Date.now(),
      };

      fetch(`${SUPABASE_URL}/rest/v1/toolhub_users`, {
        method: 'POST',
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type':  'application/json',
          'Prefer':        'resolution=merge-duplicates',
        },
        body: JSON.stringify(record),
      }).catch(err => console.warn('[Supabase] saveUser fetch err:', err));
    } catch (e) {
      // Never block caller
    }
  },

  // ── Admin queries ──────────────────────────────────────────

  /** Get events from last N hours */
  async getRecentEvents(hours = 24) {
    try {
      const since = Date.now() - hours * 3600 * 1000;
      const res = await fetch(`${SUPABASE_URL}/rest/v1/toolhub_events?t=gte.${since}&order=t.desc&limit=1000`, {
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  /** Get all registered users */
  async getAllUsers() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/toolhub_users?select=*`, {
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },
};

window.SupabaseTracker = SupabaseTracker;
