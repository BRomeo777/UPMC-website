import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc,
} from "firebase/firestore";
import {
  getStorage, ref, uploadBytes, getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export const isCloudEnabled = (): boolean =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket);

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
  const app = getFirebaseApp();
  if (!app) return toBase64(file);
  try {
    const storage = getStorage(app);
    const path = `upmc-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch {
    return toBase64(file);
  }
}

const DATA_DOC_PATH = { collection: "upmc-site", doc: "data" };

export async function fetchAndSyncFromCloud(): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  try {
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc));
    if (!snap.exists()) return;
    const record = snap.data() as Record<string, string>;
    Object.entries(record).forEach(([k, v]) => {
      if (v != null) localStorage.setItem(k, v);
    });
  } catch { /* silent — use localStorage as fallback */ }
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
      await setDoc(doc(db, DATA_DOC_PATH.collection, DATA_DOC_PATH.doc), data);
    } catch { /* silent */ }
  }, 600);
}
