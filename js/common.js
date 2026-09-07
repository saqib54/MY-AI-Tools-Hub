// ============================================
// ToolHub Shared Page Init — common.js
// ============================================
// Load on every page AFTER auth.js, tracker.js, limits.js, theme.js

const Common = {

  /** Call at top of every protected page */
  initPage(toolName = null) {
    // Auth guard
    if (!Auth.requireAuth()) return false;

    const user = Auth.getCurrentUser();

    // Render nav user chip
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
      // Remove old login btn if any
      navRight.querySelectorAll('.nav-user-chip, .logout-btn').forEach(e => e.remove());

      const chip = document.createElement('div');
      chip.className = 'nav-user-chip';
      const initial = (user.name || user.email || 'U')[0].toUpperCase();
      chip.innerHTML = `
        <div class="nav-avatar">${initial}</div>
        <span style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name || user.email}</span>
      `;
      navRight.insertBefore(chip, navRight.firstChild);

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-ghost logout-btn';
      logoutBtn.style.fontSize = '13px';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = () => { Auth.logout(); location.href = '/auth.html'; };
      navRight.appendChild(logoutBtn);
    }

    // Setup hamburger
    this.initHamburger(user);

    // Track page view
    if (toolName) Tracker.log('page_view', { tool: toolName });

    return true;
  },

  /** Init navbar hamburger for mobile */
  initHamburger(user) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Create hamburger button
    const ham = document.createElement('button');
    ham.className = 'nav-hamburger';
    ham.setAttribute('aria-label', 'Menu');
    ham.innerHTML = '<span></span><span></span><span></span>';
    navbar.appendChild(ham);

    // Create drawer
    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      drawer.innerHTML = navLinks.innerHTML;
    }
    // Add divider + user info + logout to drawer
    if (user) {
      drawer.innerHTML += `
        <div class="drawer-divider"></div>
        <div style="padding:10px 14px;font-size:13px;color:var(--muted);">
          Logged in as <strong style="color:var(--text);">${user.name || user.email}</strong>
          <span style="display:inline-block;background:rgba(34,197,94,0.1);color:var(--green);font-size:11px;padding:2px 8px;border-radius:4px;margin-left:6px;">5 uses/day</span>
        </div>
        <button onclick="Auth.logout();location.href='/auth.html'" 
          style="color:var(--red);text-align:left;padding:12px 14px;border-radius:10px;background:none;width:100%;border:none;cursor:pointer;font-size:15px;">
          🚪 Logout
        </button>
      `;
    }
    document.body.insertBefore(drawer, document.body.firstChild.nextSibling || null);
    document.body.appendChild(drawer);

    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      drawer.classList.toggle('open');
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { ham.classList.remove('open'); drawer.classList.remove('open'); });
    });
  },

  /** Render usage badge + check limit. Returns {allowed} */
  initLimits(toolName, container) {
    if (!container) return { allowed: true };
    const status = Limits.renderBadge(toolName, container);

    // Auto-refresh countdown
    if (!status.allowed && status.resetAt) {
      const iv = setInterval(() => {
        const s2 = Limits.renderBadge(toolName, container);
        if (s2.allowed) clearInterval(iv);
      }, 30000);
    }

    return status;
  },

  /** Check limit before action. Shows toast if exceeded. */
  checkAndConsume(toolName) {
    const status = Limits.getStatus(toolName);
    if (!status.allowed) {
      const cd = Limits.formatCountdown(status.resetAt);
      Common.showToast(`⛔ Daily limit reached! Resets in ${cd}.`);
      return false;
    }
    const result = Limits.consume(toolName);
    Tracker.logToolUse(toolName, 'use');
    return true;
  },

  showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  },

  /** Generate compressed JPEG base64 thumbnail from img / canvas */
  createThumbnail(source, maxDim = 220) {
    try {
      let canvas;
      if (source instanceof HTMLCanvasElement) {
        canvas = source;
      } else if (source instanceof HTMLImageElement) {
        if (!source.naturalWidth) return null;
        canvas = document.createElement('canvas');
        canvas.width = source.naturalWidth;
        canvas.height = source.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
      } else {
        return null;
      }

      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return null;

      const scale = Math.min(1, maxDim / Math.max(w, h));
      const thumbC = document.createElement('canvas');
      thumbC.width = Math.round(w * scale);
      thumbC.height = Math.round(h * scale);
      const ctx = thumbC.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, thumbC.width, thumbC.height);
      ctx.drawImage(canvas, 0, 0, thumbC.width, thumbC.height);

      return thumbC.toDataURL('image/jpeg', 0.5);
    } catch (e) {
      return null;
    }
  }
};

window.Common = Common;
