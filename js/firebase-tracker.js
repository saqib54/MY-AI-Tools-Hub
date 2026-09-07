// ============================================================
// ToolHub Firebase Tracker — firebase-tracker.js
// Syncs user activity to Firestore so admin sees ALL users
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── Firebase Config (my-brand-b9124) ──────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAZJ5_djd6D4zikxEHHbZdX9DvS10lW0PU",
  authDomain:        "my-brand-b9124.firebaseapp.com",
  projectId:         "my-brand-b9124",
  storageBucket:     "my-brand-b9124.firebasestorage.app",
  messagingSenderId: "687002771469",
  appId:             "1:687002771469:web:73c18b0d41b0efe07bf544",
  measurementId:     "G-G796Y518L9",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Collections ────────────────────────────────────────────
const EVENTS_COL = 'toolhub_events';   // activity logs
const USERS_COL  = 'toolhub_users';    // registered users

// ── Helper: get local session ──────────────────────────────
function _getSession() {
  try {
    const raw = localStorage.getItem('_th_s');
    if (!raw) return null;
    const s = JSON.parse(raw);
    return (s && Date.now() < s.expiresAt) ? s : null;
  } catch { return null; }
}

// ══════════════════════════════════════════════════════════
//  FirebaseTracker — public API
// ══════════════════════════════════════════════════════════
const FirebaseTracker = {

  /**
   * Log any event to Firestore.
   * Also saves locally as backup (tracker.js still handles localStorage).
   */
  async log(event, data = {}) {
    try {
      const session = _getSession();
      const entry = {
        t:         serverTimestamp(),          // Firestore server time
        dt:        new Date().toISOString(),   // client ISO string
        ev:        event,
        uid:       session?.id    ?? null,
        email:     session?.email ?? null,
        name:      session?.name  ?? null,
        ua:        navigator.userAgent.slice(0, 120),
        ...data,
      };
      await addDoc(collection(db, EVENTS_COL), entry);
    } catch (e) {
      // Silent fail — never break the page
      console.warn('[FirebaseTracker] log failed:', e.message);
    }
  },

  /** Log a tool use */
  async logToolUse(tool, action, extra = {}) {
    await this.log('tool_use', { tool, action, ...extra });
  },

  /** Log a download */
  async logDownload(tool, fileName, origSize, newSize) {
    await this.log('download', {
      tool, fileName, origSize, newSize,
      saving: origSize > 0 ? Math.round((1 - newSize / origSize) * 100) : null,
    });
  },

  /**
   * Save / update user profile to Firestore.
   * Call this after register or login.
   */
  async saveUser(user) {
    try {
      if (!user?.email) return;
      const ref = doc(db, USERS_COL, user.email.toLowerCase());
      await setDoc(ref, {
        id:        user.id    ?? null,
        name:      user.name  ?? null,
        email:     user.email.toLowerCase(),
        updatedAt: serverTimestamp(),
        createdAt: user.createdAt ?? serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn('[FirebaseTracker] saveUser failed:', e.message);
    }
  },

  // ── Admin helpers ────────────────────────────────────────

  /**
   * Fetch events from last N hours (default 24).
   * Returns array sorted newest-first.
   */
  async getRecentEvents(hours = 24) {
    try {
      const since = Timestamp.fromMillis(Date.now() - hours * 3600 * 1000);
      const q = query(
        collection(db, EVENTS_COL),
        where('t', '>=', since),
        orderBy('t', 'desc'),
        limit(1000)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ _id: d.id, ...d.data(), t: d.data().t?.toMillis?.() ?? Date.now() }));
    } catch (e) {
      console.warn('[FirebaseTracker] getRecentEvents failed:', e.message);
      return [];
    }
  },

  /**
   * Fetch all registered users from Firestore.
   */
  async getAllUsers() {
    try {
      const snap = await getDocs(collection(db, USERS_COL));
      return snap.docs.map(d => ({ ...d.data(), createdAt: d.data().createdAt?.toMillis?.() ?? null }));
    } catch (e) {
      console.warn('[FirebaseTracker] getAllUsers failed:', e.message);
      return [];
    }
  },
};

window.FirebaseTracker = FirebaseTracker;
export default FirebaseTracker;
