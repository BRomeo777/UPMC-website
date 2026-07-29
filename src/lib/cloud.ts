import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyBAO1aOwvJja2tzwrFy7blWPzuX2xbxgtc",
  authDomain:        "upmc-fa85e.firebaseapp.com",
  projectId:         "upmc-fa85e",
  storageBucket:     "upmc-fa85e.firebasestorage.app",
  messagingSenderId: "848453582874",
  appId:             "1:848453582874:web:ad1c44fdcebbe3c13511a3",
};

export const isCloudEnabled = (): boolean =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let _app: ReturnType<typeof initializeApp> | null = null;
function getFirebaseApp() {
  if (!isCloudEnabled()) return null;
  if (!_app) {
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return _app;
}

const DATA_DOC_PATH = { collection: "upmc-site", doc: "data" };
const IMAGES_COLLECTION = "upmc-site-images";
const SIZE_THRESHOLD = 50000; // Values larger than 50KB go to separate image docs

let _diagnosticsRun = false;
export async function runDiagnostics(): Promise<void> {
  if (_diagnosticsRun) return;
  _diagnosticsRun = true;
  const app = getFirebaseApp();
  if (!app) { console.warn("[cloud] Firebase not configured"); return; }

  console.log("%c[cloud] Running Firebase diagnostics...", "color:#0d9488;font-weight:bold");

  // Test Firestore read
  try {
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc));
    if (snap.exists()) {
      console.log(`%c[cloud] Firestore READ: OK (${Object.keys(snap.data() || {}).length} keys found)`, "color:#16a34a;font-weight:bold");
    } else {
      console.log("%c[cloud] Firestore READ: OK (empty - no data yet)", "color:#eab308;font-weight:bold");
    }
  } catch (err) {
    console.error("%c[cloud] Firestore READ FAILED - Check Firestore rules in Firebase Console!", "color:#ef4444;font-weight:bold", err);
  }

  // Test Firestore write
  try {
    const db = getFirestore(app);
    await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { _diag: Date.now().toString() }, { merge: true });
    console.log("%c[cloud] Firestore WRITE: OK", "color:#16a34a;font-weight:bold");
  } catch (err) {
    console.error("%c[cloud] Firestore WRITE FAILED - Check Firestore rules in Firebase Console!", "color:#ef4444;font-weight:bold", err);
  }

}

const compressImage = (file: File, maxW = 800, maxH = 800, quality = 0.7): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
        } else {
          if (height > maxH) { width = Math.round(width * maxH / height); height = maxH; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not supported")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        let q = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", q);
        while (dataUrl.length > 900000 && q > 0.1) {
          q -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", q);
        }
        if (dataUrl.length > 900000) {
          const scale = 0.7;
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL("image/jpeg", 0.3);
        }
        console.log(`[cloud] Image compressed: ${file.size} bytes -> ${dataUrl.length} chars`);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = r.result as string;
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export async function uploadToCloudinary(file: File): Promise<string> {
  return compressImage(file);
}

const _recentLocalUpdates: Record<string, number> = {};
const RECENT_THRESHOLD_MS = 60000;

export function markLocalUpdate(key: string): void {
  _recentLocalUpdates[key] = Date.now();
}

export async function syncSingleKey(key: string, value: string): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  try {
    const db = getFirestore(app);
    if (value.length > SIZE_THRESHOLD) {
      // Large value (image) → store in separate document to avoid 1MB limit
      await setDoc(doc(db, IMAGES_COLLECTION, key), { v: value });
      // Also remove it from the main doc if it was there before
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { [key]: "" }, { merge: true });
    } else if (value === "") {
      // Deletion: remove from main doc and delete image doc if it exists
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { [key]: "" }, { merge: true });
      try { await deleteDoc(doc(db, IMAGES_COLLECTION, key)); } catch {}
    } else {
      // Small value → store in main doc
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { [key]: value }, { merge: true });
    }
    markLocalUpdate(key);
    console.log("[cloud] Synced single key:", key, value.length > SIZE_THRESHOLD ? "(image doc)" : "(main doc)");
  } catch (err) { console.error("[cloud] syncSingleKey failed:", err); }
}

export async function fetchAndSyncFromCloud(initial = false): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  try {
    const db = getFirestore(app);
    const now = Date.now();
    let count = 0;

    // 1. Fetch main data document (text/JSON values)
    const snap = await getDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc));
    if (snap.exists()) {
      const record = snap.data() as Record<string, string>;
      Object.entries(record).forEach(([k, v]) => {
        if (v == null || v === "") return;  // skip empty values (cleared image keys)
        const lastLocal = _recentLocalUpdates[k] || 0;
        if (now - lastLocal < RECENT_THRESHOLD_MS) return;
        if (!initial) {
          const localVal = localStorage.getItem(k);
          if (localVal === v) return;
        }
        localStorage.setItem(k, v);
        count++;
      });
    }

    // 2. Fetch image documents from separate collection
    const imgSnap = await getDocs(collection(db, IMAGES_COLLECTION));
    imgSnap.forEach((d) => {
      const k = d.id;
      const v = (d.data() as Record<string, string>).v;
      if (v == null || v === "") return;
      const lastLocal = _recentLocalUpdates[k] || 0;
      if (now - lastLocal < RECENT_THRESHOLD_MS) return;
      if (!initial) {
        const localVal = localStorage.getItem(k);
        if (localVal === v) return;
      }
      localStorage.setItem(k, v);
      count++;
    });

    console.log(`[cloud] Synced ${count} keys from Firestore (${initial ? "initial" : "periodic"})`);
  } catch (err) { console.error("[cloud] fetchAndSyncFromCloud failed:", err); }
}

let _syncTimer: ReturnType<typeof setTimeout> | null = null;
export function syncAllToCloud(): void {
  const app = getFirebaseApp();
  if (!app) return;
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      const db = getFirestore(app);
      const smallData: Record<string, string> = {};
      const largeKeys: { key: string; val: string }[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("upmc-")) continue;
        const val = localStorage.getItem(key);
        if (!val) continue;
        if (val.length > SIZE_THRESHOLD) {
          largeKeys.push({ key, val });
        } else {
          smallData[key] = val;
        }
      }

      // Write small values to main doc
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), smallData, { merge: true });

      // Write each large value to its own image doc
      for (const { key, val } of largeKeys) {
        await setDoc(doc(db, IMAGES_COLLECTION, key), { v: val });
        // Clear from main doc to avoid stale large values there
        await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), { [key]: "" }, { merge: true });
      }

      Object.keys(smallData).forEach(k => markLocalUpdate(k));
      largeKeys.forEach(({ key }) => markLocalUpdate(key));
      console.log(`[cloud] Synced ${Object.keys(smallData).length} small + ${largeKeys.length} image keys to Firestore`);
    } catch (err) { console.error("[cloud] syncAllToCloud failed:", err); }
  }, 600);
}
