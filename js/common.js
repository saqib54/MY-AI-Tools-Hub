// ============================================
// ToolHub 2.0 Shared System — common.js
// ============================================
// Security, Limits Enforcement, Sanitization & SaaS UI Helpers

const Common = {

  /** Call at top of app init */
  initPage(toolName = null) {
    if (!window.Auth) return true;
    
    const user = Auth.getCurrentUser();
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
      // Completely clean up all previous auth elements
      navRight.querySelectorAll('.nav-user-chip, .nav-user-dropdown-wrap, .logout-btn, .login-btn-group, .admin-btn, .btn-signin, .btn-getstarted').forEach(e => e.remove());

      if (user) {
        const initial = (user.name || user.email || 'U')[0].toUpperCase();
        const firstName = (user.name || user.email || 'User').split(' ')[0];

        const userDropdownWrap = document.createElement('div');
        userDropdownWrap.className = 'nav-user-dropdown-wrap';

        userDropdownWrap.innerHTML = `
          <button type="button" class="nav-user-chip-btn" id="user-menu-btn" title="Account Menu">
            <div class="nav-avatar">${initial}</div>
            <span class="user-chip-name">${this.escapeHtml(firstName)}</span>
            <span class="user-chip-arrow">▾</span>
          </button>
          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <div class="user-dropdown-header">
              <div class="nav-avatar lg">${initial}</div>
              <div style="overflow:hidden;flex:1;">
                <div class="user-dropdown-name">${this.escapeHtml(user.name || 'User')}</div>
                <div class="user-dropdown-email">${this.escapeHtml(user.email)}</div>
                ${user.isOwner ? '<span class="owner-badge">👑 OWNER ADMIN</span>' : '<span class="plan-badge">FREE PLAN</span>'}
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            ${user.isOwner ? '<a href="admin-view.html" class="user-dropdown-item admin">👑 Admin Dashboard</a>' : ''}
            <a href="#settings" class="user-dropdown-item">⚙️ Account Settings</a>
            <a href="#support" class="user-dropdown-item">❓ Help & Support</a>
            <a href="#about" class="user-dropdown-item">ℹ️ About ToolHub</a>
            <div class="user-dropdown-divider"></div>
            <button type="button" class="user-dropdown-item logout" onclick="Auth.logout(); location.reload();">
              🚪 Sign Out
            </button>
          </div>
        `;

        navRight.insertBefore(userDropdownWrap, navRight.firstChild);

        // Bind dropdown toggle
        const menuBtn = userDropdownWrap.querySelector('#user-menu-btn');
        const dropdown = userDropdownWrap.querySelector('#user-dropdown-menu');
        if (menuBtn && dropdown) {
          menuBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
          };
          document.addEventListener('click', (e) => {
            if (!userDropdownWrap.contains(e.target)) {
              dropdown.classList.remove('open');
            }
          });
        }
      } else {
        const btnGroup = document.createElement('div');
        btnGroup.className = 'login-btn-group';
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '8px';
        btnGroup.innerHTML = `
          <button type="button" class="btn btn-ghost btn-signin" onclick="Auth.openModal('login')" style="font-size:13px;padding:7px 14px;">Sign In</button>
          <button type="button" class="btn btn-primary btn-getstarted" onclick="Auth.openModal('register')" style="font-size:13px;padding:7px 16px;">Get Started →</button>
        `;
        navRight.insertBefore(btnGroup, navRight.firstChild);
      }
    }

    // Setup hamburger drawer
    this.initHamburger(user);

    if (toolName && window.Tracker) Tracker.log('page_view', { tool: toolName });
    return true;
  },

  /** Init mobile hamburger menu drawer */
  initHamburger(user) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ham = navbar.querySelector('.nav-hamburger');
    if (!ham) {
      ham = document.createElement('button');
      ham.className = 'nav-hamburger';
      ham.setAttribute('aria-label', 'Menu');
      ham.innerHTML = '<span></span><span></span><span></span>';
      navbar.appendChild(ham);
    }

    let drawer = document.querySelector('.nav-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'nav-drawer';
      document.body.appendChild(drawer);
    }

    const navLinks = document.querySelector('.nav-links');
    let drawerContent = navLinks ? navLinks.innerHTML : '';
    
    if (user) {
      drawerContent += `
        <div class="drawer-divider"></div>
        <div style="padding:10px 14px;font-size:13px;color:var(--muted);">
          Logged in as <strong style="color:var(--text);">${this.escapeHtml(user.name || user.email)}</strong>
          ${user.isOwner ? '<span style="margin-left:6px;background:gold;color:black;font-size:10px;font-weight:900;padding:2px 6px;border-radius:4px;">OWNER</span>' : ''}
        </div>
        ${user.isOwner ? '<a href="admin-view.html" style="color:var(--accent);font-weight:700;">👑 Admin Console</a>' : ''}
        <button onclick="Auth.logout();location.reload();" 
          style="color:var(--red);text-align:left;padding:12px 14px;border-radius:10px;background:none;width:100%;border:none;cursor:pointer;font-size:15px;font-weight:600;">
          🚪 Logout
        </button>
      `;
    } else {
      drawerContent += `
        <div class="drawer-divider"></div>
        <button onclick="Auth.openModal('login');document.querySelector('.nav-hamburger').classList.remove('open');document.querySelector('.nav-drawer').classList.remove('open');" style="color:var(--accent);background:none;border:none;padding:12px 14px;text-align:left;font-size:15px;font-weight:700;cursor:pointer;width:100%;">🔐 Sign In</button>
        <button onclick="Auth.openModal('register');document.querySelector('.nav-hamburger').classList.remove('open');document.querySelector('.nav-drawer').classList.remove('open');" style="color:var(--green);background:none;border:none;padding:12px 14px;text-align:left;font-size:15px;font-weight:700;cursor:pointer;width:100%;">✨ Create Free Account</button>
      `;
    }

    drawer.innerHTML = drawerContent;

    ham.onclick = () => {
      ham.classList.toggle('open');
      drawer.classList.toggle('open');
    };

    drawer.querySelectorAll('a').forEach(a => {
      a.onclick = () => { ham.classList.remove('open'); drawer.classList.remove('open'); };
    });
  },

  /** XSS Sanitizer */
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /** File Security Validator */
  validateFile(file, allowedTypes = ['image/'], maxMb = 25) {
    if (!file) return { valid: false, error: 'No file selected.' };
    
    const name = file.name.toLowerCase();
    const badExts = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.msi', '.jar', '.scr', '.pif'];
    if (badExts.some(ext => name.endsWith(ext))) {
      return { valid: false, error: '⛔ Security Alert: Executable file types are strictly prohibited.' };
    }

    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, error: `File size exceeds the max ${maxMb} MB limit.` };
    }

    const typeOk = allowedTypes.some(t => file.type.startsWith(t) || file.type === t);
    if (!typeOk) {
      return { valid: false, error: `Invalid file format (${file.type || 'unknown'}). Please upload a valid file.` };
    }

    return { valid: true };
  },

  /** Render 3D usage badge + check limit */
  initLimits(toolName, container) {
    if (!container || !window.Limits) return { allowed: true };
    const status = Limits.renderBadge(toolName, container);
    return status;
  },

  /** Check limit before running/downloading tool action */
  checkAndConsume(toolName, workspaceEl = null, extraData = {}) {
    if (!window.Auth || !Auth.isLoggedIn()) {
      this.showToast('🔐 Login is required first to process or edit files!');
      Auth.openModal('login');
      return false;
    }

    let fileName = extraData.fileName || null;
    if (!fileName && workspaceEl) {
      const fileInput = workspaceEl.querySelector('input[type="file"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        fileName = fileInput.files[0].name;
      }
    }

    if (window.Auth && Auth.isOwner()) {
      if (window.Tracker) Tracker.logToolUse(toolName, 'use', { fileName, ...extraData });
      return true;
    }

    const status = Limits.getStatus(toolName);
    if (!status.allowed) {
      const cd = Limits.formatCountdown(status.resetAt);
      this.showToast(`⛔ Daily Download Limit Reached! Resets in ${cd}.`);
      
      if (workspaceEl) {
        let block = workspaceEl.querySelector('.limit-block');
        if (!block) {
          block = document.createElement('div');
          block.className = 'limit-block';
          workspaceEl.prepend(block);
        }
        block.innerHTML = `
          <h3>⛔ Daily Download Limit Reached</h3>
          <p>You have used all 5 free daily uses for <strong>${this.escapeHtml(toolName)}</strong>.</p>
          <div class="limit-countdown">Resets in ${cd}</div>
          <p style="font-size:12px;margin-top:10px;">Create a free account or come back when timer resets!</p>
        `;
      }
      return false;
    }

    Limits.consume(toolName);
    if (window.Tracker) Tracker.logToolUse(toolName, 'use', { fileName, ...extraData });

    const usageWrap = document.getElementById('usage-wrap');
    if (usageWrap) Limits.renderBadge(toolName, usageWrap);

    return true;
  },

  showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = this.escapeHtml(msg); t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  },

  createThumbnail(source, maxDim = 800) {
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
      } else return null;

      const w = canvas.width, h = canvas.height;
      if (!w || !h) return null;

      const scale = Math.min(1, maxDim / Math.max(w, h));
      const thumbC = document.createElement('canvas');
      thumbC.width = Math.round(w * scale);
      thumbC.height = Math.round(h * scale);
      const ctx = thumbC.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, thumbC.width, thumbC.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, thumbC.width, thumbC.height);

      return thumbC.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      return null;
    }
  }
};

window.Common = Common;
