import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc,
} from "firebase/firestore";

const CLOUD_NAME    = "agp6pdkw";
const UPLOAD_PRESET = "upmc-uploads";

const firebaseConfig = {
  apiKey:            "AIzaSyBAO1aOwvJja2tzwrFy7blWPzuX2xbxgtc",
  authDomain:        "upmc-fa85e.firebaseapp.com",
  projectId:         "upmc-fa85e",
  storageBucket:     "upmc-fa85e.firebasestorage.app",
  messagingSenderId: "848453582874",
  appId:             "1:848453582874:web:ad1c44fdcebbe3c13511a3",
};

export const isCloudEnabled = (): boolean =>
  !!(CLOUD_NAME && UPLOAD_PRESET && firebaseConfig.apiKey && firebaseConfig.projectId);

let _app: ReturnType<typeof initializeApp> | null = null;
function getFirebaseApp() {
  if (!isCloudEnabled()) return null;
  if (!_app) {
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return _app;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!isCloudEnabled()) return toBase64(file);
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: form }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.secure_url) return json.secure_url as string;
      }
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    } catch {
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  console.error("[cloud] Cloudinary upload failed after retries, falling back to base64");
  return toBase64(file);
}

const DATA_DOC_PATH = { collection: "upmc-site", doc: "data" };

const _recentLocalUpdates: Record<string, number> = {};
const RECENT_THRESHOLD_MS = 5000;

export function markLocalUpdate(key: string): void {
  _recentLocalUpdates[key] = Date.now();
}

export async function syncSingleKey(key: string, value: string): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  try {
    const db = getFirestore(app);
    await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { [key]: value }, { merge: true });
    markLocalUpdate(key);
    console.log("[cloud] Synced single key:", key);
  } catch (err) { console.error("[cloud] syncSingleKey failed:", err); }
}

export async function fetchAndSyncFromCloud(): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  try {
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc));
    if (!snap.exists()) return;
    const record = snap.data() as Record<string, string>;
    const now = Date.now();
    Object.entries(record).forEach(([k, v]) => {
      if (v == null) return;
      const lastLocal = _recentLocalUpdates[k] || 0;
      if (now - lastLocal < RECENT_THRESHOLD_MS) return;
      localStorage.setItem(k, v);
    });
    console.log("[cloud] Synced", Object.keys(record).length, "keys from Firestore");
  } catch (err) { console.error("[cloud] fetchAndSyncFromCloud failed:", err); }
}

let _syncTimer: ReturnType<typeof setTimeout> | null = null;
export function syncAllToCloud(): void {
  const app = getFirebaseApp();
  if (!app) return;
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("upmc-")) continue;
        const val = localStorage.getItem(key);
        if (val && !val.startsWith("data:")) data[key] = val;
      }
      const db = getFirestore(app);
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), data, { merge: true });
      Object.keys(data).forEach(k => markLocalUpdate(k));
      console.log("[cloud] Synced", Object.keys(data).length, "keys to Firestore");
    } catch (err) { console.error("[cloud] syncAllToCloud failed:", err); }
  }, 600);
}
