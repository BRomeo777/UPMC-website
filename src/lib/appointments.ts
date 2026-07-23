import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, query, orderBy, where, serverTimestamp, Timestamp,
} from "firebase/firestore";

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

export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "cancelled" | "completed";

export interface Appointment {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  preferred_doctor: string;
  preferred_date: string;
  preferred_time: string;
  reason: string;
  status: AppointmentStatus;
  created_at?: Timestamp | string;
  updated_at?: Timestamp | string;
}

const COLLECTION = "appointments";
const LOCAL_KEY = "upmc-appointments";

function getDb() {
  return getFirestore(getFirebaseApp());
}

export async function saveAppointment(data: Omit<Appointment, "id" | "status" | "created_at" | "updated_at">): Promise<{ id: string; firestore: boolean }> {
  const entry: Record<string, unknown> = {
    ...data,
    status: "pending" as AppointmentStatus,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  try {
    const db = getDb();
    const ref = await addDoc(collection(db, COLLECTION), entry);
    saveToLocal({ ...data, id: ref.id, status: "pending", created_at: new Date().toISOString() });
    return { id: ref.id, firestore: true };
  } catch {
    const fallbackId = Date.now().toString();
    saveToLocal({ ...data, id: fallbackId, status: "pending", created_at: new Date().toISOString() });
    return { id: fallbackId, firestore: false };
  }
}

export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const db = getDb();
    const q = query(collection(db, COLLECTION), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Appointment, "id">) }));
    }
  } catch { /* fall through to localStorage */ }
  return loadFromLocal();
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<boolean> {
  try {
    const db = getDb();
    await updateDoc(doc(db, COLLECTION, id), { status, updated_at: serverTimestamp() });
    updateLocalStatus(id, status);
    return true;
  } catch {
    updateLocalStatus(id, status);
    return false;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, COLLECTION, id));
  } catch { /* ignore */ }
  deleteFromLocal(id);
  return true;
}

function saveToLocal(data: Appointment): void {
  try {
    const list = loadFromLocal();
    list.unshift(data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}

function loadFromLocal(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function updateLocalStatus(id: string, status: AppointmentStatus): void {
  try {
    const list = loadFromLocal();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    }
  } catch { /* ignore */ }
}

function deleteFromLocal(id: string): void {
  try {
    const list = loadFromLocal().filter(a => a.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}
