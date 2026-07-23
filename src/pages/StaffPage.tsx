import { useState, useEffect } from "react";
import { syncAllToCloud } from "../lib/cloud";

interface StaffEntry {
  id: string;
  name: string;
  position: string;
  bio: string;
}

const DEFAULT_STAFF: StaffEntry[] = [];

function loadStaff(): StaffEntry[] {
  try {
    const stored = localStorage.getItem("upmc-staff-v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_STAFF;
}

function saveStaff(staff: StaffEntry[]) {
  localStorage.setItem("upmc-staff-v1", JSON.stringify(staff));
  syncAllToCloud();
  window.dispatchEvent(new Event("staff-updated"));
}

function getStaffPhoto(id: string): string {
  return localStorage.getItem(`upmc-service-img-staff-${id}`) || "";
}

export { loadStaff, saveStaff, getStaffPhoto, type StaffEntry };

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const AVATAR_COLORS = [
  ["#0d9488","#5eead4"], ["#0f766e","#a7f3d0"], ["#1e3a5f","#93c5fd"],
  ["#3b0764","#d8b4fe"], ["#7c2d12","#fdba74"],
];

function StaffCard({ member }: { member: StaffEntry }) {
  const photo = getStaffPhoto(member.id);
  const initials = getInitials(member.name);
  const colorPair = AVATAR_COLORS[member.id.charCodeAt(member.id.length - 1) % AVATAR_COLORS.length];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ padding: "32px 36px" }}>
        {/* Photo — floats left, text wraps around it */}
        <div style={{
          float: "left",
          width: 180,
          minWidth: 180,
          marginRight: 32,
          marginBottom: 16,
          aspectRatio: "3 / 4",
          overflow: "hidden",
          background: "#f8fafc",
          borderRadius: 12,
        }}>
          {photo ? (
            <img
              src={photo}
              alt={member.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", borderRadius: 12 }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${colorPair[0]}, #0d9488)`, borderRadius: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: colorPair[1], letterSpacing: "-0.02em", opacity: 0.9 }}>{initials}</span>
            </div>
          )}
        </div>

        {/* Name + position */}
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          {member.name}
        </h3>
        {member.position && (
          <p style={{ fontSize: 13, color: "#0d9488", fontWeight: 700, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {member.position}
          </p>
        )}

        {/* Bio — wraps around photo, continues full-width below */}
        {member.bio && (
          <div style={{ overflow: "hidden" }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Biography</h4>
            <p style={{ fontSize: 14.5, color: "#4b5563", lineHeight: 1.85, margin: 0, textAlign: "justify", whiteSpace: "pre-wrap" }}>
              {member.bio}
            </p>
          </div>
        )}

        {/* Clear float */}
        <div style={{ clear: "both" }} />
      </div>
    </div>
  );
}

export function StaffPage() {
  const [staff, setStaff] = useState<StaffEntry[]>(loadStaff);

  useEffect(() => {
    const refresh = () => setStaff(loadStaff());
    window.addEventListener("staff-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("staff-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero header */}
      <section style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            Our Staff
          </h1>
        </div>
      </section>

      {/* Staff List — vertical, one per row */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1020, marginLeft: 40, display: "flex", flexDirection: "column", gap: 32 }}>
          {staff.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>👥</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>No staff members yet</p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Staff will appear here once added via the Admin Panel.</p>
            </div>
          ) : (
            staff.map(member => <StaffCard key={member.id} member={member} />)
          )}
        </div>
      </section>
    </div>
  );
}
