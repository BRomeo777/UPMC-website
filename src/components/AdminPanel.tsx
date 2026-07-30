// ──────────────────────────────────────────────────────────────────────────────
//  UPMC Full-Page Admin Panel
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { uploadToCloudinary, syncAllToCloud, syncSingleKey } from "../lib/cloud";
import { fetchAppointments, updateAppointmentStatus, deleteAppointment, type Appointment, type AppointmentStatus } from "../lib/appointments";
import { loadStaff, saveStaff, type StaffEntry } from "../pages/StaffPage";
import { loadDeptItems, saveDeptItems, type DeptItem } from "../pages/DepartmentsPage";

const STORAGE_KEY = "upmc-partners-v4";
const ADMIN_PASSWORD = "UPMCADMIN";

const ALL_SERVICES = [
  { key: "spirometry",              label: "Spirometry",                       dept: "Pulmonology"           },
  { key: "epet",                    label: "Electro-Pulmonary Exercise Test",   dept: "Pulmonology"           },
  { key: "chester",                 label: "Chester Step Test",                 dept: "Pulmonology"           },
  { key: "endoscopy-pulmo",         label: "Endoscopy",                         dept: "Pulmonology"           },
  { key: "cardiology",              label: "Cardiology",                        dept: "Cardiology"            },
  { key: "ecg",                     label: "Electrocardiography (ECG)",         dept: "Cardiology"            },
  { key: "echocardiography",        label: "Echocardiography",                  dept: "Cardiology"            },
  { key: "hospitalisation-internal",label: "Hospitalisation",                   dept: "Internal Medicine"     },
  { key: "pediatric-consult",       label: "General Pediatric Consultations",   dept: "Pediatrics"            },
  { key: "growth",                  label: "Growth & Development Monitoring",   dept: "Pediatrics"            },
  { key: "vaccination",             label: "Vaccination & Immunisation",        dept: "Pediatrics"            },
  { key: "pediatric-respiratory",   label: "Respiratory Care for Children",     dept: "Pediatrics"            },
  { key: "maternal-child",          label: "Maternal & Child Health",           dept: "Pediatrics"            },
  { key: "endoscopy-peds",          label: "Endoscopy",                         dept: "Pediatrics"            },
  { key: "hospitalisation-peds",    label: "Hospitalisation",                   dept: "Pediatrics"            },
  { key: "general-consultation",    label: "General Consultation",              dept: "General Consultation"  },
  { key: "cpd-training",            label: "CPD Training",                      dept: "CPD Training"          },
] as const;

interface Partner {
  name: string;
  logoUrl: string;
  url: string;
}

export const loadPartners = (): Partner[] => {
  try {
    // Clear any old test data from previous keys
    ["upmc-partners", "upmc-partners-v2", "upmc-partners-v3"].forEach(k => localStorage.removeItem(k));
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const savePartners = (partners: Partner[]) => {
  const s = JSON.stringify(partners);
  localStorage.setItem(STORAGE_KEY, s);
  window.dispatchEvent(new Event("partners-updated"));
  syncSingleKey(STORAGE_KEY, s);
  syncAllToCloud();
};

// ─── Password Gate ────────────────────────────────────────────────────────────
const PasswordGate: React.FC<{ onSuccess: () => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError("Incorrect password. Access denied.");
      setShake(true);
      setPwd("");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className={`relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden ${shake ? "animate-shake" : ""}`} style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
        {/* Header bar */}
        <div className="px-8 py-7 text-white" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center" style={{ backdropFilter: "blur(4px)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest opacity-70 block">UPMC Admin</span>
              <h2 className="text-lg font-bold leading-tight">Secure Access</h2>
            </div>
          </div>
          <p className="text-teal-50 text-sm mt-1 opacity-90">Enter your admin credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Password</label>
          <input
            ref={inputRef}
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(""); }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            style={{ fontSize: 15 }}
          />
          {error && (
            <p className="mt-3 text-xs text-red-600 flex items-center gap-1.5" style={{ background: "#fef2f2", padding: "8px 12px", borderRadius: 8 }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full py-3 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)", boxShadow: "0 4px 14px rgba(13,148,136,0.35)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(13,148,136,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(13,148,136,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Unlock Admin Panel
          </button>
          <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
            Cancel
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  );
};

// ─── Reusable upload box (must be outside AdminDashboard to avoid remount) ────
interface UploadBoxProps {
  preview: string | null;
  fileName: string;
  onBoxClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const UploadBox: React.FC<UploadBoxProps> = ({ preview, fileName, onBoxClick, inputRef, onChange }) => (
  <div
    onClick={onBoxClick}
    className="cursor-pointer w-full border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-2 transition bg-white"
  >
    {preview ? (
      <img src={preview} alt="preview" className="h-16 w-16 object-cover rounded-full border-2 border-teal-200 shadow" />
    ) : (
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )}
    <p className="text-xs text-gray-400 text-center">
      {fileName || "Click to upload PNG, JPG or SVG"}
    </p>
    <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
  </div>
);

// ─── Site Image Slot ─────────────────────────────────────────────────────────
const SiteImageSlot: React.FC<{ storageKey: string; label: string; description: string }> = ({ storageKey, label, description }) => {
  const [src, setSrc] = React.useState(() => localStorage.getItem(storageKey) || "");
  const dispatch = () => window.dispatchEvent(new Event("site-images-updated"));
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = "";
    uploadToCloudinary(file).then(url => { localStorage.setItem(storageKey, url); setSrc(url); syncSingleKey(storageKey, url); syncAllToCloud(); dispatch(); });
  };
  const remove = () => { localStorage.removeItem(storageKey); setSrc(""); syncSingleKey(storageKey, ""); syncAllToCloud(); dispatch(); };
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", background: "#fff", marginBottom: 12 }}>
      <div style={{ background: "#f8fafc", padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{description}</p>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ position: "relative", height: 120, background: src ? "#000" : "#f9fafb", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          {src
            ? <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, pointerEvents: "none" }}>
                <svg width="28" height="28" fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Click to upload</span>
              </div>
          }
          <input type="file" accept="image/*" onChange={handleFile}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} />
        </div>
        {src && <button onClick={remove} style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Remove</button>}
      </div>
    </div>
  );
};

// ─── Publications Admin ───────────────────────────────────────────────────────
interface PubData { id: string; title: string; journal: string; doi: string; }

const PublicationsAdmin: React.FC = () => {
  const load = (): PubData[] => { try { return JSON.parse(localStorage.getItem('upmc-publications') || '[]'); } catch { return []; } };
  const [pubs, setPubs]       = React.useState<PubData[]>(load);
  const [title, setTitle]     = React.useState('');
  const [journal, setJournal] = React.useState('');
  const [doi, setDoi]         = React.useState('');

  const dispatch = () => window.dispatchEvent(new Event('publications-updated'));

  const add = () => {
    if (!title.trim()) return;
    const updated = [{ id: Date.now().toString(), title: title.trim(), journal: journal.trim(), doi: doi.trim() }, ...pubs];
    setPubs(updated);
    const s = JSON.stringify(updated); localStorage.setItem('upmc-publications', s); syncSingleKey('upmc-publications', s); syncAllToCloud(); dispatch(); setTitle(''); setJournal(''); setDoi('');
  };

  const remove = (id: string) => {
    const updated = pubs.filter(p => p.id !== id);
    setPubs(updated);
    const s = JSON.stringify(updated); localStorage.setItem('upmc-publications', s); syncSingleKey('upmc-publications', s); syncAllToCloud(); dispatch();
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12, boxSizing: 'border-box', marginBottom: 6 };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 3 };

  return (
    <div>
      {/* Add form */}
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 14, border: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Add New Publication</p>
        <label style={labelStyle}>Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Full publication title" style={inputStyle} />
        <label style={labelStyle}>Journal</label>
        <input value={journal} onChange={e => setJournal(e.target.value)} placeholder="e.g. The Lancet, NEJM" style={inputStyle} />
        <label style={labelStyle}>DOI or URL</label>
        <input value={doi} onChange={e => setDoi(e.target.value)} placeholder="e.g. 10.1016/j.chest.2020.01.001" style={inputStyle} />
        <button onClick={add} disabled={!title.trim()}
          style={{ width: '100%', padding: '8px', background: title.trim() ? '#0f172a' : '#e5e7eb', color: title.trim() ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: title.trim() ? 'pointer' : 'default', marginTop: 4 }}>
          + Add Publication
        </button>
      </div>
      {/* List */}
      {pubs.length === 0
        ? <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>No publications added yet.</p>
        : pubs.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{p.title}</p>
              {p.journal && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#0d9488' }}>{p.journal}</p>}
              {p.doi && <p style={{ margin: '2px 0 0', fontSize: 10, color: '#64748b', wordBreak: 'break-all' }}>{p.doi}</p>}
            </div>
            <button onClick={() => remove(p.id)} style={{ flexShrink: 0, fontSize: 10, color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}>Delete</button>
          </div>
        ))
      }
    </div>
  );
};

// ─── Researcher Admin Slot ───────────────────────────────────────────────────
const RESEARCHERS_ADMIN = [
  { id: "director", role: "Senior Research Associate" },
  { id: "senior",   role: "Research Assistant"    },
];

const ResearcherAdminSlot: React.FC<{ r: typeof RESEARCHERS_ADMIN[0] }> = ({ r }) => {
  const photoKey = `upmc-researcher-photo-${r.id}`;
  const bioKey   = `upmc-researcher-bio-${r.id}`;
  const nameKey  = `upmc-researcher-name-${r.id}`;
  const dispatch = () => window.dispatchEvent(new Event("researchers-updated"));
  const [photo, setPhoto] = React.useState(() => localStorage.getItem(photoKey) || "");
  const [bio,   setBio  ] = React.useState(() => localStorage.getItem(bioKey)   || "");
  const [name,  setName ] = React.useState(() => localStorage.getItem(nameKey)  || "");
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = "";
    uploadToCloudinary(file).then(url => { localStorage.setItem(photoKey, url); setPhoto(url); syncSingleKey(photoKey, url); syncAllToCloud(); dispatch(); });
  };
  const saveBio  = () => { localStorage.setItem(bioKey, bio);   syncSingleKey(bioKey, bio); syncAllToCloud(); dispatch(); };
  const saveName = () => { localStorage.setItem(nameKey, name); syncSingleKey(nameKey, name); syncAllToCloud(); dispatch(); };
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", marginBottom: 14, background: "#fff" }}>
      <div style={{ background: "#f1f5f9", padding: "8px 14px", borderBottom: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#0f172a" }}>{r.role}</p>
      </div>
      <div style={{ padding: 12 }}>
        {/* Photo */}
        <div style={{ position: "relative", height: 100, background: photo ? "#000" : "#f9fafb", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          {photo
            ? <img src={photo} alt={r.role} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Click to upload photo</span>
              </div>
          }
          <input type="file" accept="image/*" onChange={handleFile}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} />
        </div>
        {photo && <button onClick={() => { localStorage.removeItem(photoKey); setPhoto(""); syncSingleKey(photoKey, ""); syncAllToCloud(); dispatch(); }} style={{ fontSize: 10, color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>Remove photo</button>}
        {/* Name */}
        <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Full Name</label>
        <div style={{ display: "flex", gap: 6, marginTop: 3, marginBottom: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. John Doe"
            style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
          <button onClick={saveName} style={{ padding: "6px 12px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Save</button>
        </div>
        {/* Bio */}
        <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Write a short bio..."
          style={{ width: "100%", marginTop: 3, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, resize: "vertical", boxSizing: "border-box" }} />
        <button onClick={saveBio} style={{ marginTop: 6, width: "100%", padding: "7px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Save Bio</button>
      </div>
    </div>
  );
};

// ─── Doctor Admin Slot ───────────────────────────────────────────────────────
const DOCTORS_ADMIN = [
  { id: "sibomana",   name: "Dr. SIBOMANA JEAN PIERRE" },
  { id: "niyonshuti", name: "Dr. NIYONSHUTI THEOPIST"  },
  { id: "uwamaliya",  name: "Dr. UWAMALIYA MODETSE"    },
];

const DoctorAdminSlot: React.FC<{ doc: typeof DOCTORS_ADMIN[0] }> = ({ doc }) => {
  const photoKey = `upmc-doctor-photo-${doc.id}`;
  const bioKey   = `upmc-doctor-bio-${doc.id}`;

  const [photo, setPhoto] = React.useState(() => localStorage.getItem(photoKey) || "");
  const [bio,   setBio  ] = React.useState(() => localStorage.getItem(bioKey)   || "");

  const dispatch = () => window.dispatchEvent(new Event("doctors-updated"));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = "";
    uploadToCloudinary(file).then(url => { localStorage.setItem(photoKey, url); setPhoto(url); syncSingleKey(photoKey, url); syncAllToCloud(); dispatch(); });
  };
  const removePhoto = () => { localStorage.removeItem(photoKey); setPhoto(""); syncSingleKey(photoKey, ""); syncAllToCloud(); dispatch(); };
  const saveBio  = () => { localStorage.setItem(bioKey, bio);   syncSingleKey(bioKey, bio); syncAllToCloud(); dispatch(); };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", background: "#fff", marginBottom: 16 }}>
      {/* Header */}
      <div style={{ background: "#f0fdfa", padding: "10px 14px", borderBottom: "1px solid #99f6e4" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0d9488" }}>{doc.name}</p>
      </div>
      {/* Photo */}
      <div style={{ padding: "12px 14px 0" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Photo</p>
        <div style={{ position: "relative", height: 130, background: photo ? "#000" : "#f9fafb", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          {photo
            ? <img src={photo} alt={doc.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, pointerEvents: "none" }}>
                <svg width="28" height="28" fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Click to upload</span>
              </div>
          }
          <input type="file" accept="image/*" onChange={handlePhoto} title="Upload photo"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} />
        </div>
        {photo && <button onClick={removePhoto} style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", marginBottom: 10 }}>Remove Photo</button>}
      </div>
      {/* Bio */}
      <div style={{ padding: "0 14px 14px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Biography</p>
        <textarea value={bio} onChange={e => setBio(e.target.value)}
          rows={6} placeholder="Write the doctor's bio — including clinical specialization and research interests..."
          style={{ width: "100%", fontSize: 12, color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
        <button onClick={saveBio} style={{ marginTop: 4, fontSize: 12, fontWeight: 700, background: "#0d9488", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>Save Bio</button>
      </div>
    </div>
  );
};

// ─── Service Photo Slot ──────────────────────────────────────────────────────
const ServicePhotoSlot: React.FC<{ svcKey: string; label: string; dept: string }> = ({ svcKey, label, dept }) => {
  const storageKey = `upmc-service-img-${svcKey}`;
  const [src, setSrc] = React.useState<string>(() => localStorage.getItem(storageKey) || "");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    uploadToCloudinary(file).then(url => {
      localStorage.setItem(storageKey, url);
      setSrc(url);
      syncSingleKey(storageKey, url);
      syncAllToCloud();
      window.dispatchEvent(new Event("service-photos-updated"));
    });
  };

  const handleRemove = () => {
    localStorage.removeItem(storageKey);
    setSrc("");
    syncSingleKey(storageKey, "");
    syncAllToCloud();
    window.dispatchEvent(new Event("service-photos-updated"));
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      {/* Photo area with invisible file input overlay */}
      <div style={{ position: "relative", height: 140, background: src ? "#000" : "#f9fafb", overflow: "hidden" }}>
        {src ? (
          <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, pointerEvents: "none" }}>
            <svg width="32" height="32" fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Click to upload</span>
          </div>
        )}
        {/* Invisible full-area file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          title="Upload photo"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }}
        />
        {/* Dept badge */}
        <div style={{ position: "absolute", top: 6, left: 6, background: "#0d9488", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, zIndex: 5, pointerEvents: "none" }}>{dept}</div>
      </div>
      {/* Label + remove button */}
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</p>
        {src && (
          <button onClick={handleRemove} title="Remove photo" style={{ flexShrink: 0, background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Remove</button>
        )}
      </div>
    </div>
  );
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const ls = {
  get: <T,>(key: string, fallback: T): T => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key: string, v: unknown) => { const s = JSON.stringify(v); localStorage.setItem(key, s); syncSingleKey(key, s); syncAllToCloud(); },
};
const field: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box", background: "#fff", color: "#0f172a" };
const btnStyle = (bg: string, fg = "#fff"): React.CSSProperties => ({ padding: "8px 18px", background: bg, color: fg, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" as const });
const cardBox: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", marginBottom: 10 };
const sectionTitle = (t: string) => <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>{t}</h2>;

interface SvcCard { id: string; dept: string; subDept: string; title: string; description: string; imageKey: string; translations?: { rw?: { title?: string; description?: string }; fr?: { title?: string; description?: string }; sw?: { title?: string; description?: string }; }; }
interface DocEntry { id: string; name: string; specialty: string; clinicalSpec: string; research: string; }
interface TeamMember { id: string; name: string; role: string; bio: string; }
interface ResArea { id: string; category: string; items: string[]; }
interface EduItem { id: string; title: string; description: string; }
interface ContactInfo { address: string; phone: string; email: string; hours: string; emergency: string; }

// ─── News Ticker Admin ────────────────────────────────────────────────────────
const DEFAULT_NEWS = [
  "Welcome to Umurinzi Petros Medical Center: Compassionate Care, Excellence in Medicine",
  "Consultations available Monday to Sunday: Emergency services 24/7",
  "Our Research & Education Department offers CPD Training for healthcare professionals",
  "Cardiology, Pulmonology, Pediatrics & Internal Medicine services now available",
  "New research collaborations underway: advancing evidence-based medicine in Rwanda",
];
const NewsTickerAdmin: React.FC = () => {
  const load = (): string[] => { try { return JSON.parse(localStorage.getItem("upmc-news-ticker") || "null") || DEFAULT_NEWS; } catch { return DEFAULT_NEWS; } };
  const save = (items: string[]) => { const s = JSON.stringify(items); localStorage.setItem("upmc-news-ticker", s); syncSingleKey("upmc-news-ticker", s); syncAllToCloud(); window.dispatchEvent(new Event("news-ticker-updated")); };
  const [items, setItems] = React.useState<string[]>(load);
  const [draft, setDraft] = React.useState("");
  const add = () => { if (!draft.trim()) return; const n = [...items, draft.trim()]; setItems(n); save(n); setDraft(""); };
  const remove = (i: number) => { const n = items.filter((_, idx) => idx !== i); setItems(n); save(n); };
  const reset = () => { setItems(DEFAULT_NEWS); save(DEFAULT_NEWS); };
  const moveUp = (i: number) => { if (i === 0) return; const n = [...items]; [n[i-1], n[i]] = [n[i], n[i-1]]; setItems(n); save(n); };
  const moveDown = (i: number) => { if (i === items.length - 1) return; const n = [...items]; [n[i], n[i+1]] = [n[i+1], n[i]]; setItems(n); save(n); };
  return (
    <div style={{ maxWidth: 600 }}>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Add or remove scrolling news items shown at the very top of the website. When all items are removed, the defaults will show automatically.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Type a news item and press Enter or Add..."
          style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }} />
        <button onClick={add} style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", marginBottom: 8, border: "1px solid #e2e8f0" }}>
          <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>✦ {item}</span>
          <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 6, padding: "3px 8px", cursor: i === 0 ? "default" : "pointer", fontSize: 11, fontWeight: 700, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
          <button onClick={() => moveDown(i)} disabled={i === items.length - 1} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 6, padding: "3px 8px", cursor: i === items.length - 1 ? "default" : "pointer", fontSize: 11, fontWeight: 700, opacity: i === items.length - 1 ? 0.4 : 1 }}>↓</button>
          <button onClick={() => remove(i)} style={{ background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Remove</button>
        </div>
      ))}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
        <button onClick={reset} style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Reset to defaults</button>
      </div>
    </div>
  );
};

// ─── Label field wrapper ───────────────────────────────────────────────────────
const LF: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</label>
    {children}
  </div>
);

// ─── Sub-tab pill nav ─────────────────────────────────────────────────────────
const SubTabs: React.FC<{ tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }> = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)}
        style={{ padding: "7px 16px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
          background: active === t.id ? "#0f172a" : "#f1f5f9", color: active === t.id ? "#fff" : "#64748b", transition: "all 0.15s" }}>
        {t.label}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  HOME SECTION
// ─────────────────────────────────────────────────────────────────────────────
const HomeSectionAdmin: React.FC<{ partners: Partner[]; setPartners: (p: Partner[]) => void }> = ({ partners, setPartners }) => {
  const [sub, setSub] = useState("site");
  const [newName, setNewName] = useState(""); const [newUrl, setNewUrl] = useState(""); const [newLogo, setNewLogo] = useState<string>("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState(""); const [editUrl, setEditUrl] = useState(""); const [editLogo, setEditLogo] = useState("");

  const addPartner = () => {
    if (!newName.trim() || !newLogo) return;
    const updated = [...partners, { name: newName.trim(), url: newUrl.trim(), logoUrl: newLogo }];
    setPartners(updated); savePartners(updated); setNewName(""); setNewUrl(""); setNewLogo("");
  };
  const deletePartner = (i: number) => { const u = partners.filter((_, x) => x !== i); setPartners(u); savePartners(u); };
  const saveEdit = () => {
    if (editIdx === null) return;
    const u = partners.map((p, i) => i === editIdx ? { name: editName, url: editUrl, logoUrl: editLogo || p.logoUrl } : p);
    setPartners(u); savePartners(u); setEditIdx(null);
  };
  const readImg = (file: File, cb: (url: string) => void) => { uploadToCloudinary(file).then(cb); };

  const HOME_GALLERY = Array.from({ length: 10 }, (_, i) => ({ key: `gallery-${i + 1}`, label: `Slide ${i + 1}` }));

  return (
    <div>
      {sectionTitle("Home")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Manage site logo, hero image, gallery photos and home page partners.</p>
      <SubTabs tabs={[{ id: "site", label: "🖼 Site Images" }, { id: "news", label: "📢 News Ticker" }, { id: "gallery", label: "📷 Gallery" }, { id: "partners", label: "🤝 Partners" }]} active={sub} onChange={setSub} />

      {sub === "news" && <NewsTickerAdmin />
      }

      {sub === "site" && (
        <div style={{ maxWidth: 600 }}>
          <SiteImageSlot storageKey="upmc-logo" label="Clinic Logo" description="Appears in header & footer. PNG with transparent background recommended." />
          <SiteImageSlot storageKey="upmc-home-bg" label="Home Page Background Photo" description="Full-page background image for the entire Home page. Use a high-resolution clinic photo." />
          <SiteImageSlot storageKey="upmc-hero-img" label="Hero Section Image" description="Main photo displayed inside the hero card on the Home page." />
        </div>
      )}

      {sub === "gallery" && (
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Upload up to 10 photos for the home gallery slider.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
            {HOME_GALLERY.map(s => <ServicePhotoSlot key={s.key} svcKey={s.key} label={s.label} dept="Home" />)}
          </div>
        </div>
      )}

      {sub === "partners" && (
        <div>
          {/* Add form */}
          <div style={{ ...cardBox, background: "#f8fafc", marginBottom: 16 }}>
            <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 12px" }}>Add New Partner</p>
            <LF label="Name *"><input style={field} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Partner organisation name" /></LF>
            <LF label="Website URL"><input style={field} value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." /></LF>
            <LF label="Logo *">
              <div style={{ position: "relative", height: 80, background: newLogo ? "#000" : "#f1f5f9", borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
                {newLogo ? <img src={newLogo} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 12, color: "#94a3b8" }}>Click to upload</div>}
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) readImg(f, setNewLogo); e.target.value = ""; }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              </div>
            </LF>
            <button style={btnStyle("#0f172a")} onClick={addPartner}>+ Add Partner</button>
          </div>
          {/* List */}
          {partners.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: 20 }}>No partners added yet.</p>}
          {partners.map((p, i) => (
            <div key={i} style={cardBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={p.logoUrl} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{p.name}</p>
                  {p.url && <p style={{ margin: 0, fontSize: 11, color: "#0d9488" }}>{p.url}</p>}
                </div>
                <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => { setEditIdx(i); setEditName(p.name); setEditUrl(p.url); setEditLogo(p.logoUrl); }}>Edit</button>
                <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => deletePartner(i)}>Delete</button>
              </div>
              {editIdx === i && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
                  <LF label="Name"><input style={field} value={editName} onChange={e => setEditName(e.target.value)} /></LF>
                  <LF label="URL"><input style={field} value={editUrl} onChange={e => setEditUrl(e.target.value)} /></LF>
                  <LF label="Replace Logo">
                    <div style={{ position: "relative", height: 70, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", cursor: "pointer" }}>
                      <img src={editLogo} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) readImg(f, setEditLogo); e.target.value = ""; }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </div>
                  </LF>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveEdit}>Save</button>
                    <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditIdx(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SERVICES SECTION
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: SvcCard[] = [
  { id: "general-consultation", dept: "General Consultation", subDept: "", title: "General Consultation", description: "Comprehensive first-contact medical consultations for patients of all ages.", imageKey: "general-consultation" },
  { id: "spirometry", dept: "Internal Medicine", subDept: "Pulmonology", title: "Spirometry", description: "Lung function testing that measures airflow and breathing capacity.", imageKey: "spirometry" },
  { id: "epet", dept: "Internal Medicine", subDept: "Pulmonology", title: "Electro-Pulmonary Exercise Test", description: "Advanced cardio-pulmonary exercise assessment.", imageKey: "epet" },
  { id: "chester", dept: "Internal Medicine", subDept: "Pulmonology", title: "Chester Step Test", description: "Standardised fitness assessment evaluating cardiovascular endurance.", imageKey: "chester" },
  { id: "endoscopy-pulmo", dept: "Internal Medicine", subDept: "Pulmonology", title: "Endoscopy (Pulmonology)", description: "Minimally invasive visual examination of the respiratory tract.", imageKey: "endoscopy-pulmo" },
  { id: "cardiology", dept: "Internal Medicine", subDept: "Cardiology", title: "Cardiology", description: "Comprehensive evaluation and management of cardiovascular diseases.", imageKey: "cardiology" },
  { id: "ecg", dept: "Internal Medicine", subDept: "Cardiology", title: "Electrocardiography (ECG)", description: "Non-invasive recording of the electrical activity of the heart.", imageKey: "ecg" },
  { id: "echocardiography", dept: "Internal Medicine", subDept: "Cardiology", title: "Echocardiography", description: "Ultrasound imaging of the heart to assess structure and function.", imageKey: "echocardiography" },
  { id: "hospitalisation-internal", dept: "Hospitalisation", subDept: "", title: "Adult Hospitalisation", description: "Inpatient care for adult patients under the Internal Medicine team.", imageKey: "hospitalisation-internal" },
  { id: "pediatric-consult", dept: "Pediatrics", subDept: "", title: "General Pediatric Consultations", description: "Medical assessments for infants, children, and adolescents.", imageKey: "pediatric-consult" },
  { id: "endoscopy-peds", dept: "Pediatrics", subDept: "", title: "Endoscopy (Pediatrics)", description: "Minimally invasive endoscopic procedures adapted for children.", imageKey: "endoscopy-peds" },
  { id: "hospitalisation-peds", dept: "Hospitalisation", subDept: "", title: "Pediatric Hospitalisation", description: "Dedicated inpatient care for children in a child-friendly environment.", imageKey: "hospitalisation-peds" },
  { id: "cpd-training", dept: "CPD Training", subDept: "", title: "CPD Training", description: "Accredited CPD programmes keeping clinical teams updated.", imageKey: "cpd-training" },
];

export const loadServices = (): SvcCard[] => ls.get<SvcCard[]>("upmc-services-v3", DEFAULT_SERVICES);
const saveServices = (d: SvcCard[]) => { ls.set("upmc-services-v3", d); syncAllToCloud(); window.dispatchEvent(new Event("services-updated")); };

const ServicesSectionAdmin: React.FC = () => {
  const [sub, setSub] = useState("cards");
  const [services, setServices] = useState<SvcCard[]>(loadServices);
  const [editId, setEditId] = useState<string | null>(null);
  const [editSnap, setEditSnap] = useState<SvcCard | null>(null); // snapshot for cancel
  const [addOpen, setAddOpen] = useState(false);
  type AddFormData = Partial<SvcCard> & { title_rw?: string; desc_rw?: string; title_fr?: string; desc_fr?: string; title_sw?: string; desc_sw?: string; };
  const [addForm, setAddForm] = useState<AddFormData>({});
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [addErr, setAddErr] = useState("");

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const upd = (id: string, key: keyof SvcCard, val: string) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const updTrans = (id: string, lang: "rw"|"fr"|"sw", key: "title"|"description", val: string) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, translations: { ...s.translations, [lang]: { ...s.translations?.[lang], [key]: val } } } : s));

  const openEdit = (s: SvcCard) => { setEditSnap({ ...s }); setEditId(s.id); };

  const cancelEdit = () => {
    if (editSnap) setServices(prev => prev.map(s => s.id === editSnap.id ? editSnap : s));
    setEditId(null); setEditSnap(null);
  };

  const save = () => {
    saveServices(services);
    setEditId(null); setEditSnap(null);
    showToast("✅ Service saved successfully!");
  };

  const del = (id: string) => {
    if (!window.confirm("Delete this service card?")) return;
    const u = services.filter(s => s.id !== id);
    setServices(u); saveServices(u);
    showToast("🗑 Service deleted.");
  };

  const addService = () => {
    if (!addForm.title?.trim()) { setAddErr("Title is required."); return; }
    if (!addForm.dept?.trim())  { setAddErr("Department is required."); return; }
    const newId = `custom-${Date.now()}`;
    const s: SvcCard = { id: newId, dept: addForm.dept || "", subDept: addForm.subDept || "", title: addForm.title || "", description: addForm.description || "", imageKey: newId,
      translations: {
        rw: { title: addForm.title_rw || undefined, description: addForm.desc_rw || undefined },
        fr: { title: addForm.title_fr || undefined, description: addForm.desc_fr || undefined },
        sw: { title: addForm.title_sw || undefined, description: addForm.desc_sw || undefined },
      }
    };
    const u = [...services, s];
    setServices(u); saveServices(u);
    setAddOpen(false); setAddForm({}); setAddErr("");
    showToast(`✅ "${s.title}" added successfully!`);
  };

  const depts = Array.from(new Set(services.map(s => s.dept)));

  return (
    <div>
      {sectionTitle("Services")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Add, edit or remove service cards.</p>

      {/* Toast */}
      {toast && (
        <div style={{ marginBottom: 14, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: toast.ok ? "#f0fdfa" : "#fef2f2",
          border: `1px solid ${toast.ok ? "#86efac" : "#fca5a5"}`,
          color: toast.ok ? "#0d9488" : "#dc2626" }}>
          {toast.msg}
        </div>
      )}

      <SubTabs tabs={[{ id: "cards", label: "📋 Service Cards" }]} active={sub} onChange={setSub} />

      {sub === "cards" && (
        <div>
          <button style={{ ...btnStyle("#0d9488"), marginBottom: 16 }} onClick={() => { setAddOpen(o => !o); setAddErr(""); setAddForm({}); }}>
            {addOpen ? "✕ Cancel" : "+ Add New Service"}
          </button>

          {addOpen && (
            <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
              <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 12px", color: "#0d9488" }}>New Service Card</p>
              <LF label="Title *"><input style={field} placeholder="Service title" value={addForm.title || ""} onChange={e => { setAddForm(f => ({ ...f, title: e.target.value })); setAddErr(""); }} /></LF>
              <LF label="Department *"><input style={field} placeholder="e.g. Internal Medicine" value={addForm.dept || ""} onChange={e => { setAddForm(f => ({ ...f, dept: e.target.value })); setAddErr(""); }} /></LF>
              <LF label="Sub-department"><input style={field} placeholder="e.g. Cardiology (optional)" value={addForm.subDept || ""} onChange={e => setAddForm(f => ({ ...f, subDept: e.target.value }))} /></LF>
              <LF label="Description"><textarea style={{ ...field, resize: "vertical" }} rows={3} placeholder="Short description of this service" value={addForm.description || ""} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} /></LF>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #99f6e4" }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#0d9488", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>🌍 Translations (optional)</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "0 0 6px" }}>🇷🇼 Kinyarwanda</p>
                <LF label="Title (Kinyarwanda)"><input style={field} placeholder="Intitulé mu Kinyarwanda" value={addForm.title_rw || ""} onChange={e => setAddForm(f => ({ ...f, title_rw: e.target.value }))} /></LF>
                <LF label="Description (Kinyarwanda)"><textarea style={{ ...field, resize: "vertical" }} rows={2} placeholder="Ibisobanuro mu Kinyarwanda" value={addForm.desc_rw || ""} onChange={e => setAddForm(f => ({ ...f, desc_rw: e.target.value }))} /></LF>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "10px 0 6px" }}>🇫🇷 Français</p>
                <LF label="Titre (Français)"><input style={field} placeholder="Titre en français" value={addForm.title_fr || ""} onChange={e => setAddForm(f => ({ ...f, title_fr: e.target.value }))} /></LF>
                <LF label="Description (Français)"><textarea style={{ ...field, resize: "vertical" }} rows={2} placeholder="Description en français" value={addForm.desc_fr || ""} onChange={e => setAddForm(f => ({ ...f, desc_fr: e.target.value }))} /></LF>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "10px 0 6px" }}>🇰🇪 Kiswahili</p>
                <LF label="Kichwa (Kiswahili)"><input style={field} placeholder="Kichwa kwa Kiswahili" value={addForm.title_sw || ""} onChange={e => setAddForm(f => ({ ...f, title_sw: e.target.value }))} /></LF>
                <LF label="Maelezo (Kiswahili)"><textarea style={{ ...field, resize: "vertical" }} rows={2} placeholder="Maelezo kwa Kiswahili" value={addForm.desc_sw || ""} onChange={e => setAddForm(f => ({ ...f, desc_sw: e.target.value }))} /></LF>
              </div>
              {addErr && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>⚠ {addErr}</p>}
              <button style={{ ...btnStyle("#0d9488"), width: "100%", padding: "10px" }} onClick={addService}>
                ✓ Save Service
              </button>
            </div>
          )}

          {services.length === 0 && (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: 24 }}>No services yet. Click "+ Add New Service" above.</p>
          )}

          {depts.map(dept => (
            <div key={dept} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#0d9488", marginBottom: 10 }}>{dept}</p>
              {services.filter(s => s.dept === dept).map(s => (
                <div key={s.id} style={{ ...cardBox, borderLeft: editId === s.id ? "3px solid #0d9488" : "3px solid transparent" }}>
                  {editId === s.id ? (
                    <div>
                      <LF label="Title"><input style={field} value={s.title} onChange={e => upd(s.id, "title", e.target.value)} /></LF>
                      <LF label="Department"><input style={field} value={s.dept} onChange={e => upd(s.id, "dept", e.target.value)} /></LF>
                      <LF label="Sub-department"><input style={field} value={s.subDept} onChange={e => upd(s.id, "subDept", e.target.value)} /></LF>
                      <LF label="Description"><textarea style={{ ...field, resize: "vertical" }} rows={3} value={s.description} onChange={e => upd(s.id, "description", e.target.value)} /></LF>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#0d9488", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>🌍 Translations</p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "0 0 6px" }}>🇷🇼 Kinyarwanda</p>
                        <LF label="Title (Kinyarwanda)"><input style={field} value={s.translations?.rw?.title || ""} onChange={e => updTrans(s.id, "rw", "title", e.target.value)} /></LF>
                        <LF label="Description (Kinyarwanda)"><textarea style={{ ...field, resize: "vertical" }} rows={2} value={s.translations?.rw?.description || ""} onChange={e => updTrans(s.id, "rw", "description", e.target.value)} /></LF>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "10px 0 6px" }}>🇫🇷 Français</p>
                        <LF label="Titre (Français)"><input style={field} value={s.translations?.fr?.title || ""} onChange={e => updTrans(s.id, "fr", "title", e.target.value)} /></LF>
                        <LF label="Description (Français)"><textarea style={{ ...field, resize: "vertical" }} rows={2} value={s.translations?.fr?.description || ""} onChange={e => updTrans(s.id, "fr", "description", e.target.value)} /></LF>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", margin: "10px 0 6px" }}>🇰🇪 Kiswahili</p>
                        <LF label="Kichwa (Kiswahili)"><input style={field} value={s.translations?.sw?.title || ""} onChange={e => updTrans(s.id, "sw", "title", e.target.value)} /></LF>
                        <LF label="Maelezo (Kiswahili)"><textarea style={{ ...field, resize: "vertical" }} rows={2} value={s.translations?.sw?.description || ""} onChange={e => updTrans(s.id, "sw", "description", e.target.value)} /></LF>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ ...btnStyle("#0d9488"), flex: 1 }} onClick={save}>✓ Save Changes</button>
                        <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.title}</p>
                        {s.subDept && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#0d9488" }}>{s.subDept}</p>}
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.description}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => openEdit(s)}>Edit</button>
                        <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => del(s.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  RESEARCH SECTION
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_TEAM: TeamMember[] = [
  { id: "director", name: "", role: "Senior Research Associate", bio: "" },
  { id: "senior", name: "", role: "Research Assistant", bio: "" },
];
const DEFAULT_AREAS: ResArea[] = [
  { id: "respiratory", category: "Respiratory Medicine", items: ["Chronic Obstructive Pulmonary Disease (COPD)", "Asthma", "Tuberculosis & Post-TB Lung Disease", "Obstructive Sleep Apnoea", "Interstitial Lung Diseases", "Pulmonary Hypertension"] },
  { id: "internal", category: "Internal Medicine & Critical Care", items: ["Sepsis & Multi-Organ Dysfunction", "Acute Respiratory Distress Syndrome (ARDS)", "Hospital-Acquired Infections", "Non-Communicable Diseases in Sub-Saharan Africa"] },
  { id: "cardiology", category: "Cardiovascular Medicine", items: ["Hypertensive Heart Disease", "Rheumatic Heart Disease", "Cardio-Pulmonary Exercise Physiology"] },
  { id: "pediatrics", category: "Pediatric Health", items: ["Childhood Respiratory Illness", "Childhood Malnutrition & Growth Disorders", "Neonatal Medicine"] },
];
const DEFAULT_EDU: EduItem[] = [
  { id: "cpd", title: "Continuing Professional Development (CPD)", description: "Structured accredited training for practising clinicians." },
  { id: "cme", title: "Continuing Medical Education (CME)", description: "Evidence-based updates across specialties." },
  { id: "internship", title: "Clinical Internship Programme", description: "Supervised placements for medical graduates." },
  { id: "research-training", title: "Research Methodology Training", description: "Workshops in study design, biostatistics and scientific writing." },
];

export const loadTeam = (): TeamMember[] => {
  const stored = ls.get<TeamMember[]>("upmc-research-team-v2", []);
  if (stored.length) return stored;
  // Merge stored overrides into defaults
  return DEFAULT_TEAM.map(m => ({
    ...m,
    name: localStorage.getItem(`upmc-researcher-name-${m.id}`) || m.name,
    bio: localStorage.getItem(`upmc-researcher-bio-${m.id}`) || m.bio,
  }));
};
export const loadResearchAreas = (): ResArea[] => ls.get<ResArea[]>("upmc-research-areas-v2", DEFAULT_AREAS);
export const loadEducation = (): EduItem[] => ls.get<EduItem[]>("upmc-education-v2", DEFAULT_EDU);

const saveTeam = (d: TeamMember[]) => { ls.set("upmc-research-team-v2", d); syncAllToCloud(); window.dispatchEvent(new Event("researchers-updated")); };
const saveAreas = (d: ResArea[]) => { ls.set("upmc-research-areas-v2", d); syncAllToCloud(); window.dispatchEvent(new Event("research-areas-updated")); };
const saveEdu = (d: EduItem[]) => { ls.set("upmc-education-v2", d); syncAllToCloud(); window.dispatchEvent(new Event("education-updated")); };

const ResearchSectionAdmin: React.FC = () => {
  const [sub, setSub] = useState("team");
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);
  const [areas, setAreas] = useState<ResArea[]>(loadResearchAreas);
  const [edu, setEdu] = useState<EduItem[]>(loadEducation);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [editAreaId, setEditAreaId] = useState<string | null>(null);
  const [editEduId, setEditEduId] = useState<string | null>(null);
  const [addTeamOpen, setAddTeamOpen] = useState(false);
  const [addAreaOpen, setAddAreaOpen] = useState(false);
  const [addEduOpen, setAddEduOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<TeamMember>>({});
  const [newArea, setNewArea] = useState<{ category: string; items: string }>({ category: "", items: "" });
  const [newEdu, setNewEdu] = useState<Partial<EduItem>>({});

  // Team helpers
  const updTeam = (id: string, k: keyof TeamMember, v: string) => setTeam(prev => prev.map(m => m.id === id ? { ...m, [k]: v } : m));
  const delTeam = (id: string) => { const u = team.filter(m => m.id !== id); setTeam(u); saveTeam(u); };
  const saveTeamItem = () => { saveTeam(team); setEditTeamId(null); };
  const addTeamMember = () => {
    if (!newTeam.role?.trim()) return;
    const m: TeamMember = { id: `tm-${Date.now()}`, name: newTeam.name || "", role: newTeam.role || "", bio: newTeam.bio || "" };
    const u = [...team, m]; setTeam(u); saveTeam(u); setAddTeamOpen(false); setNewTeam({});
  };

  // Areas helpers
  const updArea = (id: string, k: keyof ResArea, v: string | string[]) => setAreas(prev => prev.map(a => a.id === id ? { ...a, [k]: v } : a));
  const delArea = (id: string) => { const u = areas.filter(a => a.id !== id); setAreas(u); saveAreas(u); };
  const saveAreaItem = () => { saveAreas(areas); setEditAreaId(null); };
  const addArea = () => {
    if (!newArea.category.trim()) return;
    const a: ResArea = { id: `area-${Date.now()}`, category: newArea.category, items: newArea.items.split("\n").map(s => s.trim()).filter(Boolean) };
    const u = [...areas, a]; setAreas(u); saveAreas(u); setAddAreaOpen(false); setNewArea({ category: "", items: "" });
  };
  const addItem = (areaId: string, item: string) => {
    if (!item.trim()) return;
    const u = areas.map(a => a.id === areaId ? { ...a, items: [...a.items, item.trim()] } : a); setAreas(u); saveAreas(u);
  };
  const delItem = (areaId: string, idx: number) => {
    const u = areas.map(a => a.id === areaId ? { ...a, items: a.items.filter((_, i) => i !== idx) } : a); setAreas(u); saveAreas(u);
  };

  // Edu helpers
  const updEdu = (id: string, k: keyof EduItem, v: string) => setEdu(prev => prev.map(e => e.id === id ? { ...e, [k]: v } : e));
  const delEdu = (id: string) => { const u = edu.filter(e => e.id !== id); setEdu(u); saveEdu(u); };
  const saveEduItem = () => { saveEdu(edu); setEditEduId(null); };
  const addEduItem = () => {
    if (!newEdu.title?.trim()) return;
    const e: EduItem = { id: `edu-${Date.now()}`, title: newEdu.title || "", description: newEdu.description || "" };
    const u = [...edu, e]; setEdu(u); saveEdu(u); setAddEduOpen(false); setNewEdu({});
  };

  const PARTNER_LOGO_KEYS_ADMIN = Array.from({ length: 20 }, (_, i) => `rp-logo-${i + 1}`);

  return (
    <div>
      {sectionTitle("Research & Education")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Manage the research team, areas, education offerings, publications and partner logos.</p>
      <SubTabs tabs={[
        { id: "team", label: "👥 Team" },
        { id: "areas", label: "🔬 Research Areas" },
        { id: "edu", label: "🎓 Education" },
        { id: "pubs", label: "📚 Publications" },
        { id: "rp", label: "🤝 Research Partners" },
      ]} active={sub} onChange={setSub} />

      {/* TEAM */}
      {sub === "team" && (
        <div>
          <button style={{ ...btnStyle("#0d9488"), marginBottom: 16 }} onClick={() => setAddTeamOpen(o => !o)}>{addTeamOpen ? "✕ Cancel" : "+ Add Team Member"}</button>
          {addTeamOpen && (
            <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
              <LF label="Full Name *"><input style={field} placeholder="Dr. John Doe" value={newTeam.name || ""} onChange={e => setNewTeam(f => ({ ...f, name: e.target.value }))} /></LF>
              <LF label="Role / Title *"><input style={field} placeholder="e.g. Senior Research Associate" value={newTeam.role || ""} onChange={e => setNewTeam(f => ({ ...f, role: e.target.value }))} /></LF>
              <LF label="Bio"><textarea style={{ ...field, resize: "vertical" }} rows={3} value={newTeam.bio || ""} onChange={e => setNewTeam(f => ({ ...f, bio: e.target.value }))} /></LF>
              <button style={btnStyle("#0d9488")} onClick={addTeamMember}>Save Member</button>
            </div>
          )}
          {team.map(m => (
            <div key={m.id} style={cardBox}>
              {editTeamId === m.id ? (
                <div>
                  {/* Photo upload via ServicePhotoSlot */}
                  <LF label="Photo">
                    <div style={{ maxWidth: 200 }}><ServicePhotoSlot svcKey={`researcher-${m.id}`} label="Photo" dept="Research" /></div>
                  </LF>
                  <LF label="Full Name"><input style={field} value={m.name} onChange={e => updTeam(m.id, "name", e.target.value)} /></LF>
                  <LF label="Role"><input style={field} value={m.role} onChange={e => updTeam(m.id, "role", e.target.value)} /></LF>
                  <LF label="Bio"><textarea style={{ ...field, resize: "vertical" }} rows={4} value={m.bio} onChange={e => updTeam(m.id, "bio", e.target.value)} /></LF>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveTeamItem}>Save</button>
                    <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditTeamId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{m.name || <span style={{ color: "#94a3b8" }}>No name set</span>}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#0d9488" }}>{m.role}</p>
                  </div>
                  <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => setEditTeamId(m.id)}>Edit</button>
                  <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => delTeam(m.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RESEARCH AREAS */}
      {sub === "areas" && (
        <div>
          <button style={{ ...btnStyle("#0d9488"), marginBottom: 16 }} onClick={() => setAddAreaOpen(o => !o)}>{addAreaOpen ? "✕ Cancel" : "+ Add Research Area"}</button>
          {addAreaOpen && (
            <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
              <LF label="Category Name *"><input style={field} value={newArea.category} onChange={e => setNewArea(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Infectious Diseases" /></LF>
              <LF label="Research Topics (one per line)"><textarea style={{ ...field, resize: "vertical" }} rows={4} value={newArea.items} onChange={e => setNewArea(f => ({ ...f, items: e.target.value }))} placeholder="Topic 1&#10;Topic 2&#10;Topic 3" /></LF>
              <button style={btnStyle("#0d9488")} onClick={addArea}>Save Area</button>
            </div>
          )}
          {areas.map(a => (
            <div key={a.id} style={cardBox}>
              {editAreaId === a.id ? (
                <div>
                  <LF label="Category Name"><input style={field} value={a.category} onChange={e => updArea(a.id, "category", e.target.value)} /></LF>
                  <LF label="Topics">
                    {a.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <input style={{ ...field, marginBottom: 0 }} value={item} onChange={e => { const items = [...a.items]; items[idx] = e.target.value; updArea(a.id, "items", items); }} />
                        <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => delItem(a.id, idx)}>✕</button>
                      </div>
                    ))}
                    <AddItemInline onAdd={item => addItem(a.id, item)} />
                  </LF>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveAreaItem}>Save</button>
                    <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditAreaId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{a.category}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b" }}>{a.items.length} topics</p>
                  </div>
                  <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => setEditAreaId(a.id)}>Edit</button>
                  <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => delArea(a.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {sub === "edu" && (
        <div>
          <button style={{ ...btnStyle("#0d9488"), marginBottom: 16 }} onClick={() => setAddEduOpen(o => !o)}>{addEduOpen ? "✕ Cancel" : "+ Add Education Item"}</button>
          {addEduOpen && (
            <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
              <LF label="Title *"><input style={field} value={newEdu.title || ""} onChange={e => setNewEdu(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Fellowship Programme" /></LF>
              <LF label="Description"><textarea style={{ ...field, resize: "vertical" }} rows={3} value={newEdu.description || ""} onChange={e => setNewEdu(f => ({ ...f, description: e.target.value }))} /></LF>
              <button style={btnStyle("#0d9488")} onClick={addEduItem}>Save</button>
            </div>
          )}
          {edu.map(e => (
            <div key={e.id} style={cardBox}>
              {editEduId === e.id ? (
                <div>
                  <LF label="Title"><input style={field} value={e.title} onChange={ev => updEdu(e.id, "title", ev.target.value)} /></LF>
                  <LF label="Description"><textarea style={{ ...field, resize: "vertical" }} rows={3} value={e.description} onChange={ev => updEdu(e.id, "description", ev.target.value)} /></LF>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveEduItem}>Save</button>
                    <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditEduId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{e.title}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>{e.description}</p>
                  </div>
                  <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => setEditEduId(e.id)}>Edit</button>
                  <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => delEdu(e.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PUBLICATIONS */}
      {sub === "pubs" && (
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Add papers with their DOI and the site will automatically fetch citation counts from OpenAlex.</p>
          <PublicationsAdmin />
        </div>
      )}

      {/* RESEARCH PARTNERS */}
      {sub === "rp" && (
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Upload up to 20 partner logos. They appear in the scrolling slider on the Research page.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
            {PARTNER_LOGO_KEYS_ADMIN.map((k, i) => <ServicePhotoSlot key={k} svcKey={`research-partner-${k}`} label={`Partner ${i + 1}`} dept="Research" />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Inline add-item helper ────────────────────────────────────────────────────
const AddItemInline: React.FC<{ onAdd: (s: string) => void }> = ({ onAdd }) => {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
      <input style={{ ...field, marginBottom: 0 }} value={val} onChange={e => setVal(e.target.value)} placeholder="New topic..." onKeyDown={e => { if (e.key === "Enter") { onAdd(val); setVal(""); } }} />
      <button style={btnStyle("#0d9488")} onClick={() => { onAdd(val); setVal(""); }}>Add</button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  DEPARTMENT SERVICES ADMIN
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_CONFIGS = [
  { id: "medical",  label: "Medical Department" },
  { id: "research", label: "Research & Education Department" },
];

const DeptServicesAdmin: React.FC = () => {
  const [deptId, setDeptId] = useState("medical");
  const [items, setItems] = useState<DeptItem[]>(() => loadDeptItems(deptId));
  const [newText, setNewText] = useState("");
  const [newIndent, setNewIndent] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editIndent, setEditIndent] = useState(false);

  useEffect(() => {
    setItems(loadDeptItems(deptId));
    setEditId(null);
  }, [deptId]);

  const save = (updated: DeptItem[]) => { setItems(updated); saveDeptItems(deptId, updated); };

  const addItem = () => {
    if (!newText.trim()) return;
    save([...items, { id: `${deptId}-${Date.now()}`, text: newText.trim(), indent: newIndent }]);
    setNewText(""); setNewIndent(false);
  };

  const del = (id: string) => { if (!window.confirm("Remove this service?")) return; save(items.filter(i => i.id !== id)); };

  const startEdit = (item: DeptItem) => { setEditId(item.id); setEditText(item.text); setEditIndent(!!item.indent); };

  const saveEdit = () => {
    save(items.map(i => i.id === editId ? { ...i, text: editText, indent: editIndent } : i));
    setEditId(null);
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Add, edit or remove services shown on each department card. Ticked items appear as main services; indented items appear as sub-services.</p>

      {/* Department selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {DEPT_CONFIGS.map(d => (
          <button key={d.id} onClick={() => setDeptId(d.id)} style={{
            padding: "8px 16px", borderRadius: 8, border: "2px solid",
            borderColor: deptId === d.id ? "#0d9488" : "#e2e8f0",
            background: deptId === d.id ? "#f0fdfa" : "#fff",
            color: deptId === d.id ? "#0d9488" : "#64748b",
            fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>{d.label}</button>
        ))}
      </div>

      {/* Add new item */}
      <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 10px", color: "#0f172a" }}>Add New Service</p>
        <LF label="Service Name">
          <input style={field} placeholder="e.g. Echography" value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addItem(); }} />
        </LF>
        <LF label="">
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
            <input type="checkbox" checked={newIndent} onChange={e => setNewIndent(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#0d9488", cursor: "pointer" }} />
            <span style={{ fontSize: 13, color: "#374151" }}>Sub-service (indented under a main service)</span>
          </label>
        </LF>
        <button style={btnStyle("#0d9488")} onClick={addItem}>+ Add Service</button>
      </div>

      {/* Current items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(item => (
          <div key={item.id} style={{ ...cardBox, padding: "12px 14px" }}>
            {editId === item.id ? (
              <div>
                <LF label="Service Name">
                  <input style={field} value={editText} onChange={e => setEditText(e.target.value)} />
                </LF>
                <LF label="">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <input type="checkbox" checked={editIndent} onChange={e => setEditIndent(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#0d9488", cursor: "pointer" }} />
                    <span style={{ fontSize: 13, color: "#374151" }}>Sub-service</span>
                  </label>
                </LF>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveEdit}>Save</button>
                  <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Checkmark or dot indicator */}
                {item.indent ? (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94a3b8", flexShrink: 0, marginLeft: 12 }} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="#d1fae5" />
                    <path d="M6 10l3 3 5-5" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span style={{ flex: 1, fontSize: 13, color: "#1e293b", fontWeight: item.indent ? 400 : 600 }}>{item.text}</span>
                {item.indent && <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginRight: 4 }}>sub</span>}
                <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => startEdit(item)}>Edit</button>
                <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => del(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {items.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No services yet. Add one above.</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  STAFF SECTION
// ─────────────────────────────────────────────────────────────────────────────
const StaffSectionAdmin: React.FC = () => {
  const [sub, setSub] = useState("members");
  const [staff, setStaff] = useState<StaffEntry[]>(loadStaff);
  const [editId, setEditId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffEntry>>({});

  const upd = (id: string, k: keyof StaffEntry, v: string) => setStaff(prev => prev.map(s => s.id === id ? { ...s, [k]: v } : s));
  const saveItem = () => { saveStaff(staff); setEditId(null); };
  const del = (id: string) => { if (!window.confirm("Remove this staff member?")) return; const u = staff.filter(s => s.id !== id); setStaff(u); saveStaff(u); };
  const addStaff = () => {
    if (!newStaff.name?.trim()) return;
    if (staff.length >= 30) { alert("Maximum of 30 staff members reached."); return; }
    const s: StaffEntry = { id: `staff-${Date.now()}`, name: newStaff.name || "", position: newStaff.position || "", bio: newStaff.bio || "" };
    const u = [...staff, s]; setStaff(u); saveStaff(u); setAddOpen(false); setNewStaff({});
  };

  return (
    <div>
      {sectionTitle("Staff & Departments")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Manage staff members and department photos shown on the About Us pages.</p>
      <SubTabs tabs={[{ id: "members", label: "👥 Staff Members" }, { id: "dept-photos", label: "🖼 Dept Photos" }, { id: "dept-services", label: "✅ Dept Services" }]} active={sub} onChange={setSub} />

      {sub === "dept-photos" && <DeptPhotosAdmin />}
      {sub === "dept-services" && <DeptServicesAdmin />}

      {sub === "members" && (
        <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button style={{ ...btnStyle("#0d9488") }} onClick={() => setAddOpen(o => !o)}>{addOpen ? "✕ Cancel" : "+ Add New Staff"}</button>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{staff.length} / 30 members</span>
      </div>

      {addOpen && (
        <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
          <LF label="Full Name *"><input style={field} placeholder="Staff member name" value={newStaff.name || ""} onChange={e => setNewStaff(f => ({ ...f, name: e.target.value }))} /></LF>
          <LF label="Position"><input style={field} placeholder="e.g. Nurse, Receptionist, Lab Technician" value={newStaff.position || ""} onChange={e => setNewStaff(f => ({ ...f, position: e.target.value }))} /></LF>
          <LF label="Short Bio"><textarea style={{ ...field, resize: "vertical" }} rows={3} placeholder="Brief description of role and background" value={newStaff.bio || ""} onChange={e => setNewStaff(f => ({ ...f, bio: e.target.value }))} /></LF>
          <button style={btnStyle("#0d9488")} onClick={addStaff}>Save Staff Member</button>
        </div>
      )}

      {staff.map(member => (
        <div key={member.id} style={cardBox}>
          {editId === member.id ? (
            <div>
              <LF label="Photo">
                <div style={{ maxWidth: 220 }}><ServicePhotoSlot svcKey={`staff-${member.id}`} label="Staff Photo" dept="Staff" /></div>
              </LF>
              <LF label="Full Name"><input style={field} value={member.name} onChange={e => upd(member.id, "name", e.target.value)} /></LF>
              <LF label="Position"><input style={field} value={member.position} onChange={e => upd(member.id, "position", e.target.value)} /></LF>
              <LF label="Short Bio"><textarea style={{ ...field, resize: "vertical" }} rows={3} value={member.bio} onChange={e => upd(member.id, "bio", e.target.value)} /></LF>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveItem}>Save Changes</button>
                <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0, background: "#f1f5f9" }}>
                {(() => { const photo = localStorage.getItem(`upmc-service-img-staff-${member.id}`); return photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>; })()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{member.name}</p>
                {member.position && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#0d9488" }}>{member.position}</p>}
              </div>
              <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => setEditId(member.id)}>Edit</button>
              <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => del(member.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  DEPARTMENT PHOTOS ADMIN
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_PHOTO_SLOTS = [
  { deptId: "medical", label: "Medical Department" },
  { deptId: "research", label: "Research & Education Department" },
];

const DeptPhotosAdmin: React.FC = () => {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Upload up to 3 photos for each department. They will appear as a sliding carousel on the Our Departments page.</p>
      {DEPT_PHOTO_SLOTS.map(dept => (
        <div key={dept.deptId} style={{ ...cardBox, marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 14px", color: "#0f172a" }}>{dept.label}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {[1, 2, 3].map(i => (
              <ServicePhotoSlot key={i} svcKey={`dept-${dept.deptId}-photo-${i}`} label={`Photo ${i}`} dept="Departments" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  DOCTORS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_DOCTORS: DocEntry[] = [
  { id: "sibomana",   name: "Dr. SIBOMANA JEAN PIERRE", specialty: "Pulmonologist & Critical Care", clinicalSpec: "Dr. Jean Pierre Sibomana is a Senior Consultant Internist, Pulmonologist, and Critical Care Specialist.", research: "Dr. Sibomana is actively involved in clinical research focusing on respiratory medicine and critical care." },
  { id: "niyonshuti", name: "Dr. NIYONSHUTI THEOPIST",  specialty: "General Practitioner",          clinicalSpec: "Dr. Theopist Niyonshuti is a General Practitioner committed to delivering comprehensive primary healthcare.", research: "" },
  { id: "uwamaliya",  name: "Dr. UWAMALIYA MODETSE",   specialty: "Pediatrician",                  clinicalSpec: "Dr. Modeste Uwamaliya is a certified Pediatrician dedicated to providing comprehensive healthcare for children.", research: "" },
];

export const loadDoctors = (): DocEntry[] => ls.get<DocEntry[]>("upmc-doctors-v2", DEFAULT_DOCTORS);
const saveDoctors = (d: DocEntry[]) => { ls.set("upmc-doctors-v2", d); syncAllToCloud(); window.dispatchEvent(new Event("doctors-updated")); };

const DoctorsSectionAdmin: React.FC = () => {
  const [doctors, setDoctors] = useState<DocEntry[]>(loadDoctors);
  const [editId, setEditId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newDoc, setNewDoc] = useState<Partial<DocEntry>>({});

  const upd = (id: string, k: keyof DocEntry, v: string) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, [k]: v } : d));
  const saveDoc = () => { saveDoctors(doctors); setEditId(null); };
  const del = (id: string) => { if (!window.confirm("Remove this doctor?")) return; const u = doctors.filter(d => d.id !== id); setDoctors(u); saveDoctors(u); };
  const addDoctor = () => {
    if (!newDoc.name?.trim()) return;
    const d: DocEntry = { id: `doc-${Date.now()}`, name: newDoc.name || "", specialty: newDoc.specialty || "", clinicalSpec: newDoc.clinicalSpec || "", research: newDoc.research || "" };
    const u = [...doctors, d]; setDoctors(u); saveDoctors(u); setAddOpen(false); setNewDoc({});
  };

  return (
    <div>
      {sectionTitle("Doctors")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Add, edit or remove doctors. Upload their photos and update their bio.</p>
      <button style={{ ...btnStyle("#0d9488"), marginBottom: 16 }} onClick={() => setAddOpen(o => !o)}>{addOpen ? "✕ Cancel" : "+ Add New Doctor"}</button>

      {addOpen && (
        <div style={{ ...cardBox, background: "#f0fdfa", marginBottom: 16 }}>
          <LF label="Full Name *"><input style={field} placeholder="Dr. Full Name" value={newDoc.name || ""} onChange={e => setNewDoc(f => ({ ...f, name: e.target.value }))} /></LF>
          <LF label="Specialty"><input style={field} placeholder="e.g. Cardiologist" value={newDoc.specialty || ""} onChange={e => setNewDoc(f => ({ ...f, specialty: e.target.value }))} /></LF>
          <LF label="Biography"><textarea style={{ ...field, resize: "vertical" }} rows={5} placeholder="Write the doctor's bio — including clinical specialization and research interests..." value={newDoc.clinicalSpec || ""} onChange={e => setNewDoc(f => ({ ...f, clinicalSpec: e.target.value }))} /></LF>
          <button style={btnStyle("#0d9488")} onClick={addDoctor}>Save Doctor</button>
        </div>
      )}

      {doctors.map(doc => (
        <div key={doc.id} style={cardBox}>
          {editId === doc.id ? (
            <div>
              <LF label="Photo">
                <div style={{ maxWidth: 220 }}><ServicePhotoSlot svcKey={`doctor-${doc.id}`} label="Doctor Photo" dept="Doctors" /></div>
              </LF>
              <LF label="Full Name"><input style={field} value={doc.name} onChange={e => upd(doc.id, "name", e.target.value)} /></LF>
              <LF label="Specialty"><input style={field} value={doc.specialty} onChange={e => upd(doc.id, "specialty", e.target.value)} /></LF>
              <LF label="Biography"><textarea style={{ ...field, resize: "vertical" }} rows={6} value={doc.clinicalSpec} onChange={e => upd(doc.id, "clinicalSpec", e.target.value)} /></LF>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...btnStyle("#0f172a"), flex: 1 }} onClick={saveDoc}>Save Changes</button>
                <button style={{ ...btnStyle("#f1f5f9", "#374151"), flex: 1 }} onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0, background: "#f1f5f9" }}>
                {(() => { const photo = localStorage.getItem(`upmc-service-img-doctor-${doc.id}`); return photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👨‍⚕️</div>; })()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{doc.name}</p>
                {doc.specialty && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#0d9488" }}>{doc.specialty}</p>}
              </div>
              <button style={btnStyle("#f0fdfa", "#0d9488")} onClick={() => setEditId(doc.id)}>Edit</button>
              <button style={btnStyle("#fef2f2", "#ef4444")} onClick={() => del(doc.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  CONTACTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CONTACT: ContactInfo = {
  address: "Rwanda, Northern Province, Muhanga District, Shyogwe Sector",
  phone: "+250 795 161 628 | +250 783 644 479",
  email: "umurinzipetros@gmail.com",
  hours: "General Services: Monday to Sunday",
  emergency: "Emergency: 24/7 — call +250 795 161 628 or +250 783 644 479",
};
export const loadContact = (): ContactInfo => ls.get<ContactInfo>("upmc-contacts-v2", DEFAULT_CONTACT);
const saveContact = (d: ContactInfo) => { ls.set("upmc-contacts-v2", d); syncAllToCloud(); window.dispatchEvent(new Event("contacts-updated")); };

const ContactsSectionAdmin: React.FC = () => {
  const [data, setData] = useState<ContactInfo>(loadContact);
  const [saved, setSaved] = useState(false);
  const upd = (k: keyof ContactInfo, v: string) => setData(d => ({ ...d, [k]: v }));
  const save = () => { saveContact(data); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div style={{ maxWidth: 600 }}>
      {sectionTitle("Contacts")}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Edit the contact information shown on the Contact page.</p>
      <div style={cardBox}>
        <LF label="Address"><textarea style={{ ...field, resize: "vertical" }} rows={2} value={data.address} onChange={e => upd("address", e.target.value)} /></LF>
        <LF label="Phone Number(s)"><input style={field} value={data.phone} onChange={e => upd("phone", e.target.value)} /></LF>
        <LF label="Email Address"><input style={field} value={data.email} onChange={e => upd("email", e.target.value)} /></LF>
        <LF label="Hours"><input style={field} value={data.hours} onChange={e => upd("hours", e.target.value)} /></LF>
        <LF label="Emergency Line"><input style={field} value={data.emergency} onChange={e => upd("emergency", e.target.value)} /></LF>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <button style={btnStyle("#0f172a")} onClick={save}>Save Contact Info</button>
          {saved && <span style={{ fontSize: 13, color: "#0d9488", fontWeight: 700 }}>✓ Saved!</span>}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  APPOINTMENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending:    "#f59e0b",
  confirmed:  "#0d9488",
  rescheduled:"#6366f1",
  cancelled:  "#ef4444",
  completed:  "#22c55e",
};

const STATUS_BG: Record<AppointmentStatus, string> = {
  pending:    "rgba(245,158,11,0.12)",
  confirmed:  "rgba(13,148,136,0.12)",
  rescheduled:"rgba(99,102,241,0.12)",
  cancelled:  "rgba(239,68,68,0.12)",
  completed:  "rgba(34,197,94,0.12)",
};

const AppointmentsSectionAdmin: React.FC = () => {
  const [apts, setApts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setApts(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
    setApts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this appointment? This cannot be undone.")) return;
    await deleteAppointment(id);
    setApts(prev => prev.filter(a => a.id !== id));
  };

  const todayStr = new Date().toISOString().split("T")[0];

  let filtered = apts;
  if (filterStatus !== "all") filtered = filtered.filter(a => a.status === filterStatus);
  if (filterDept !== "all") filtered = filtered.filter(a => a.department === filterDept);
  if (showTodayOnly) filtered = filtered.filter(a => a.preferred_date === todayStr);

  if (sortBy === "date") filtered = [...filtered].sort((a, b) => (a.preferred_date || "").localeCompare(b.preferred_date || ""));
  else if (sortBy === "created") filtered = [...filtered].sort((a, b) => {
    const aTime = typeof a.created_at === "string" ? a.created_at : (a.created_at as any)?.seconds ? String((a.created_at as any).seconds * 1000) : "";
    const bTime = typeof b.created_at === "string" ? b.created_at : (b.created_at as any)?.seconds ? String((b.created_at as any).seconds * 1000) : "";
    return bTime.localeCompare(aTime);
  });
  else if (sortBy === "name") filtered = [...filtered].sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

  const depts = Array.from(new Set(apts.map(a => a.department).filter(Boolean)));

  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
    padding: "20px 24px", marginBottom: 12,
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer",
  };

  return (
    <div>
      {sectionTitle("Appointments")}
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>
        View, filter, and manage patient appointment requests.
      </p>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <select style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select style={selectStyle} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select style={selectStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="created">Sort: Newest</option>
          <option value="name">Sort: Name</option>
        </select>
        <button
          onClick={() => setShowTodayOnly(!showTodayOnly)}
          style={{
            ...selectStyle,
            background: showTodayOnly ? "rgba(13,148,136,0.12)" : "#fff",
            color: showTodayOnly ? "#0d9488" : "#374151",
            border: showTodayOnly ? "1px solid #0d9488" : "1px solid #e2e8f0",
          }}
        >
          Today Only
        </button>
        <button onClick={load} style={{ ...selectStyle, background: "#f8fafc" }}>Refresh</button>
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginLeft: "auto" }}>
          {filtered.length} appointment{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>
          No appointments found. New bookings will appear here automatically.
        </div>
      ) : (
        filtered.map(apt => {
          const isExpanded = expandedId === apt.id;
          const status = apt.status || "pending";
          const createdStr = typeof apt.created_at === "string"
            ? new Date(apt.created_at).toLocaleString("en-GB", { timeZone: "Africa/Kigali" })
            : (apt.created_at as any)?.seconds
              ? new Date((apt.created_at as any).seconds * 1000).toLocaleString("en-GB", { timeZone: "Africa/Kigali" })
              : "-";
          return (
            <div key={apt.id} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{apt.full_name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    {apt.preferred_date} at {apt.preferred_time} - {apt.department}
                  </div>
                </div>

                <div style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  color: STATUS_COLORS[status as AppointmentStatus] || "#64748b",
                  background: STATUS_BG[status as AppointmentStatus] || "rgba(100,116,139,0.12)",
                }}>
                  {status}
                </div>

                <select
                  value={status}
                  onChange={e => handleStatusChange(apt.id!, e.target.value as AppointmentStatus)}
                  style={{ ...selectStyle, fontSize: 12, padding: "6px 10px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirm</option>
                  <option value="rescheduled">Reschedule</option>
                  <option value="cancelled">Cancel</option>
                  <option value="completed">Complete</option>
                </select>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : apt.id!)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8", padding: "4px 8px" }}
                >
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</div>
                      <a href={`tel:${apt.phone}`} style={{ fontSize: 14, color: "#0d9488", fontWeight: 700, textDecoration: "none" }}>{apt.phone}</a>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</div>
                      <div style={{ fontSize: 14, color: "#374151" }}>{apt.email || "Not provided"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Doctor</div>
                      <div style={{ fontSize: 14, color: "#374151" }}>{apt.preferred_doctor || "Any available doctor"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Submitted</div>
                      <div style={{ fontSize: 14, color: "#374151" }}>{createdStr}</div>
                    </div>
                  </div>
                  {apt.reason && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Reason for Visit</div>
                      <div style={{ fontSize: 14, color: "#374151", marginTop: 4, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, lineHeight: 1.6 }}>{apt.reason}</div>
                    </div>
                  )}
                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <a href={`tel:${apt.phone}`} style={{ padding: "8px 16px", borderRadius: 8, background: "#0d9488", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Call Patient</a>
                    <button onClick={() => handleDelete(apt.id!)} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN DASHBOARD — full-page layout
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",     icon: "🏠", label: "Home",                sub: "Logo, gallery & partners"          },
  { id: "services", icon: "🏥", label: "Services",            sub: "Cards & text"                       },
  { id: "research", icon: "🔬", label: "Research & Education",sub: "Team, areas, publications"          },
  { id: "doctors",  icon: "👨‍⚕️", label: "Doctors",            sub: "Add, edit & remove doctors"         },
  { id: "staff",    icon: "👥", label: "Staff & Depts",       sub: "Staff members & department photos"  },
  { id: "contacts", icon: "📞", label: "Contacts",            sub: "Address, phone & email"             },
  { id: "appointments", icon: "📅", label: "Appointments",     sub: "View & manage bookings"             },
];

const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [partners, setPartners] = useState<Partner[]>(loadPartners());
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const activeItem = NAV_ITEMS.find(n => n.id === activeNav)!;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", background: "#f1f5f9" }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: 264, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.12)", zIndex: 2 }}>
        {/* Branding */}
        <div style={{ padding: "26px 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #0d9488, #14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, boxShadow: "0 4px 12px rgba(13,148,136,0.3)" }}>🏥</div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.01em" }}>UPMC Admin</p>
              <p style={{ margin: 0, fontSize: 10, color: "#64748b", fontWeight: 600 }}>Content Manager</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "6px 10px", background: "rgba(74,222,128,0.08)", borderRadius: 8, width: "fit-content" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block" }} />
            <span style={{ fontSize: 9, color: "#86efac", fontWeight: 700, letterSpacing: "0.1em" }}>SECURE SESSION</span>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left", marginBottom: 3,
                  background: active ? "linear-gradient(90deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))" : "transparent",
                  borderLeft: active ? "3px solid #14b8a6" : "3px solid transparent",
                  transition: "all 0.2s ease" }}>
                <span style={{ fontSize: 18, flexShrink: 0, filter: active ? "none" : "grayscale(0.3)", opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#f1f5f9" : "#94a3b8", transition: "color 0.2s" }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: active ? "#64748b" : "#475569" }}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Close */}
        <div style={{ padding: "16px 10px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
            style={{ width: "100%", padding: "11px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
            ✕ Close Admin Panel
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{activeItem.icon}</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{activeItem.label}</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{activeItem.sub}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdfa", borderRadius: 20, border: "1px solid #ccfbf1" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#14b8a6", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f766e" }}>LIVE</span>
          </div>
        </div>

        {/* Section content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
          {activeNav === "home"     && <HomeSectionAdmin partners={partners} setPartners={setPartners} />}
          {activeNav === "services" && <ServicesSectionAdmin />}
          {activeNav === "research" && <ResearchSectionAdmin />}
          {activeNav === "doctors"  && <DoctorsSectionAdmin />}
          {activeNav === "staff"    && <StaffSectionAdmin />}
          {activeNav === "contacts" && <ContactsSectionAdmin />}
          {activeNav === "appointments" && <AppointmentsSectionAdmin />}
        </div>
      </div>
    </div>
  );
};

// ─── Exported AdminPanel (password gate → dashboard) ─────────────────────────
export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  if (!authenticated) return <PasswordGate onSuccess={() => setAuthenticated(true)} onClose={onClose} />;
  return <AdminDashboard onClose={onClose} />;
};
