// ============================================
// ToolHub Daily Limits — limits.js
// ============================================
// 5 uses per tool per 24 hours per user
// Resets 24h after the first use of the day
// ============================================

const LIMITS_KEY   = '_th_lim';
const DAILY_LIMIT  = 5;
const WINDOW_MS    = 24 * 60 * 60 * 1000; // 24 hours

const Limits = {

  _getStore() {
    try { return JSON.parse(localStorage.getItem(LIMITS_KEY) || '{}'); }
    catch { return {}; }
  },

  _saveStore(store) {
    localStorage.setItem(LIMITS_KEY, JSON.stringify(store));
  },

  _userKey() {
    try {
      const s = JSON.parse(localStorage.getItem('_th_s'));
      return s?.id || 'guest';
    } catch { return 'guest'; }
  },

  /** Get usage status for a tool */
  getStatus(toolName) {
    const store = this._getStore();
    const uid = this._userKey();
    const key = uid + ':' + toolName;
    const entry = store[key];

    if (!entry || Date.now() > entry.resetAt) {
      // Fresh / expired window
      return { allowed: true, used: 0, remaining: DAILY_LIMIT, resetAt: null };
    }

    const remaining = Math.max(0, DAILY_LIMIT - entry.used);
    return {
      allowed: remaining > 0,
      used: entry.used,
      remaining,
      resetAt: entry.resetAt,
      msUntilReset: Math.max(0, entry.resetAt - Date.now())
    };
  },

  /** Consume one use. Returns { ok, remaining, resetAt } */
  consume(toolName) {
    const status = this.getStatus(toolName);
    if (!status.allowed) {
      return { ok: false, remaining: 0, resetAt: status.resetAt };
    }

    const store = this._getStore();
    const uid = this._userKey();
    const key = uid + ':' + toolName;
    const entry = store[key];

    if (!entry || Date.now() > entry.resetAt) {
      store[key] = { used: 1, resetAt: Date.now() + WINDOW_MS };
    } else {
      store[key].used += 1;
    }
    this._saveStore(store);

    const newStatus = this.getStatus(toolName);
    return { ok: true, remaining: newStatus.remaining, resetAt: store[key].resetAt };
  },

  /** Format reset time as human-readable countdown */
  formatCountdown(resetAt) {
    const ms = Math.max(0, resetAt - Date.now());
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  },

  /** Render a usage badge element */
  renderBadge(toolName, container) {
    const status = this.getStatus(toolName);
    container.innerHTML = '';

    const badge = document.createElement('div');
    badge.className = 'usage-badge';
    badge.id = 'usage-badge';

    if (status.allowed) {
      const pct = (status.remaining / DAILY_LIMIT) * 100;
      const color = status.remaining <= 1 ? '#ef4444' : status.remaining <= 2 ? '#f59e0b' : '#22c55e';
      badge.innerHTML = `
        <div class="ub-label">
          <span>Daily Uses</span>
          <strong style="color:${color}">${status.remaining}/${DAILY_LIMIT} remaining</strong>
        </div>
        <div class="ub-bar">
          <div class="ub-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      `;
    } else {
      const cd = this.formatCountdown(status.resetAt);
      badge.innerHTML = `
        <div class="ub-label" style="color:#ef4444">
          <span>⛔ Daily limit reached</span>
          <strong>Resets in ${cd}</strong>
        </div>
        <div class="ub-bar">
          <div class="ub-fill" style="width:100%;background:#ef4444;opacity:0.4"></div>
        </div>
        <div class="ub-note">You've used all 5 free uses today. Come back in ${cd}!</div>
      `;
    }

    container.appendChild(badge);
    return status;
  }
};

window.Limits = Limits;
window.DAILY_LIMIT = DAILY_LIMIT;
