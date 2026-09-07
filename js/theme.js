// ============================================
// ToolHub Theme Manager — theme.js
// ============================================

const THEME_KEY = '_th_theme';

const Theme = {
  init() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    this.apply(saved);
  },

  apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_KEY, mode);
    // Update toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.textContent = mode === 'dark' ? '☀️' : '🌙';
      btn.title = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  },

  toggle() {
    const current = localStorage.getItem(THEME_KEY) || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  current() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }
};

// Init immediately on load
Theme.init();
window.Theme = Theme;
