import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyBAO1aOwvJja2tzwrFy7blWPzuX2xbxgtc",
  authDomain:        "upmc-fa85e.firebaseapp.com",
  projectId:         "upmc-fa85e",
  storageBucket:     "upmc-fa85e.firebasestorage.app",
  messagingSenderId: "848453582874",
  appId:             "1:848453582874:web:ad1c44fdcebbe3c13511a3",
};

let _app: ReturnType<typeof initializeApp> | null = null;
function getFirebaseApp() {
  if (!_app) {
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return _app;
}

const ANALYTICS_COLLECTION = "upmc-analytics";
const SESSION_KEY = "upmc-session-id";
const LAST_TRACK_KEY = "upmc-last-track";

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `s-${Date.now()}`;
  }
}

let currentPath = "";

export function trackPageView(path?: string) {
  try {
    const pagePath = path || window.location.pathname || "/";
    if (pagePath === currentPath) return;
    currentPath = pagePath;

    const now = Date.now();
    const lastTrack = Number(localStorage.getItem(LAST_TRACK_KEY) || 0);
    if (now - lastTrack < 3000) return;
    localStorage.setItem(LAST_TRACK_KEY, String(now));

    const db = getFirestore(getFirebaseApp());
    const ref = addDoc(collection(db, ANALYTICS_COLLECTION), {
      type: "page_view",
      path: pagePath,
      sessionId: getSessionId(),
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
      language: navigator.language || "",
      timestamp: serverTimestamp(),
      ts: now,
    });
    ref.catch(() => {});
  } catch { /* ignore */ }
}
