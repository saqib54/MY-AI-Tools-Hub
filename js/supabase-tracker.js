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

function _parseDeviceStr(ua) {
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

const SupabaseTracker = {

  /** Log any activity event to Supabase cloud */
  async log(event, data = {}) {
    try {
      const session = _getSession();
      const deviceStr = data.device || _parseDeviceStr(navigator.userAgent);
      const rawUa = data.ua || navigator.userAgent;
      const combinedUa = `${deviceStr} | ${rawUa}`.slice(0, 180);

      const entry = {
        t:          data.t || Date.now(),
        dt:         data.dt || new Date().toISOString(),
        ev:         event,
        uid:        data.uid   || session?.id    || null,
        email:      data.email || session?.email || null,
        name:       data.name  || session?.name  || null,
        ua:         combinedUa,
        tool:       data.tool     || null,
        action:     data.action   || null,
        fileName:   data.fileName || null,
        origSize:   data.origSize || null,
        newSize:    data.newSize  || null,
        saving:     data.saving   || null,
        previewUrl: data.previewUrl || null,
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
  async logToolUse(tool, action = 'use', extra = {}) {
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
        isPro:     !!user.isPro,
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

  /** Get events from last N hours (0 = All time) */
  async getRecentEvents(hours = 0) {
    try {
      let url = `${SUPABASE_URL}/rest/v1/toolhub_events?order=id.desc&limit=1000`;
      if (hours > 0) {
        const since = Date.now() - hours * 3600 * 1000;
        url = `${SUPABASE_URL}/rest/v1/toolhub_events?t=gte.${since}&order=id.desc&limit=1000`;
      }
      const res = await fetch(url, {
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
      const res = await fetch(`${SUPABASE_URL}/rest/v1/toolhub_users?select=*&order=createdAt.desc`, {
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
