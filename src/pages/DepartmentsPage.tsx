import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { syncAllToCloud } from "../lib/cloud";

export interface DeptItem {
  id: string;
  text: string;
  indent?: boolean;
}

const DEFAULT_MEDICAL_ITEMS: DeptItem[] = [
  { id: "m1", text: "General Consultation" },
  { id: "m2", text: "Internal Medicine" },
  { id: "m3", text: "Pulmonology: Spirometry, Chester Step Test, Endoscopy & Respiratory Care", indent: true },
  { id: "m4", text: "Cardiology: Cardiac Diagnostics", indent: true },
  { id: "m5", text: "Pediatrics: Consultations" },
  { id: "m6", text: "Hospitalisation" },
];

const DEFAULT_RESEARCH_ITEMS: DeptItem[] = [
  { id: "r1", text: "Clinical Research: Respiratory medicine, critical care & infectious diseases" },
  { id: "r2", text: "CPD Training: Certified training programs for medical professionals" },
  { id: "r3", text: "Health Systems Strengthening: Collaborative projects with partners" },
  { id: "r4", text: "Education & Mentorship: Supporting the next generation of clinicians" },
  { id: "r5", text: "Publications" },
];

export const loadDeptItems = (deptId: string): DeptItem[] => {
  try {
    const v = localStorage.getItem(`upmc-dept-${deptId}-items`);
    return v ? JSON.parse(v) : (deptId === "medical" ? DEFAULT_MEDICAL_ITEMS : DEFAULT_RESEARCH_ITEMS);
  } catch { return deptId === "medical" ? DEFAULT_MEDICAL_ITEMS : DEFAULT_RESEARCH_ITEMS; }
};

export const saveDeptItems = (deptId: string, items: DeptItem[]) => {
  localStorage.setItem(`upmc-dept-${deptId}-items`, JSON.stringify(items));
  syncAllToCloud();
  window.dispatchEvent(new Event("dept-items-updated"));
};

function getDeptPhotos(deptId: string): string[] {
  const photos: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const p = localStorage.getItem(`upmc-service-img-dept-${deptId}-photo-${i}`);
    if (p) photos.push(p);
  }
  return photos;
}

const FALLBACK_MEDICAL = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const FALLBACK_RESEARCH = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

function DeptPhoto({ deptId, fallback, title }: { deptId: string; fallback: string; title: string }) {
  const getPhoto = () => {
    const uploaded = getDeptPhotos(deptId);
    return uploaded.length > 0 ? uploaded[0] : fallback;
  };
  const [photo, setPhoto] = useState<string>(getPhoto);

  useEffect(() => {
    const refresh = () => setPhoto(getPhoto());
    window.addEventListener("service-photos-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("service-photos-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [deptId]);

  return (
    <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src={photo}
        alt={title}
        style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", objectPosition: "center" }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.2) 55%, rgba(15,23,42,0.02) 100%)",
        pointerEvents: "none",
      }} />
      {/* Title overlay */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "16px 20px",
        pointerEvents: "none",
      }}>
        <h2 style={{
          fontSize: 18, fontWeight: 900, color: "#fff",
          margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          letterSpacing: "-0.01em",
        }}>
          {title}
        </h2>
      </div>
      {/* Teal accent bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 4, background: "#0d9488" }} />
    </div>
  );
}

interface DeptProps {
  title: string;
  description: string;
  items: DeptItem[];
  linkLabel: string;
  linkKey: string;
  onNavigate: (page: string) => void;
  deptId: string;
  fallbackImage: string;
}

function DepartmentCard({ title, description, items, linkLabel, linkKey, onNavigate, deptId, fallbackImage }: DeptProps) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      transition: "box-shadow 0.3s",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      <DeptPhoto deptId={deptId} fallback={fallbackImage} title={title} />

      {/* Body */}
      <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        {description && (
          <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 20px" }}>
            {description}
          </p>
        )}

        {/* Services label */}
        <p style={{
          fontSize: 10, fontWeight: 800, color: "#0d9488",
          textTransform: "uppercase", letterSpacing: "0.12em",
          margin: "0 0 12px",
        }}>Services &amp; Specialties</p>

        {/* Items list */}
        <div style={{ marginBottom: 20, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                padding: item.indent ? "4px 0 4px 16px" : "6px 10px",
                background: item.indent ? "transparent" : "#f8fafc",
                borderRadius: item.indent ? 0 : 8,
                borderLeft: item.indent ? "2px solid #d1fae5" : "none",
              }}>
                {!item.indent ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="10" cy="10" r="10" fill="#d1fae5" />
                    <path d="M6 10l3 3 5-5" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#94a3b8", flexShrink: 0, marginTop: 7 }} />
                )}
                <span style={{
                  fontSize: item.indent ? 13 : 13,
                  color: item.indent ? "#374151" : "#1e293b",
                  fontWeight: item.indent ? 500 : 600,
                  lineHeight: 1.6,
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />

        {/* CTA */}
        <button
          onClick={() => onNavigate(linkKey)}
          style={{
            width: "100%",
            padding: "11px 18px",
            background: "transparent",
            border: "2px solid #0d9488",
            borderRadius: 12,
            color: "#0d9488",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#0d9488"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0d9488"; }}
        >
          {linkLabel} &nbsp;→
        </button>
      </div>
    </div>
  );
}

interface DepartmentsPageProps {
  onNavigate?: (page: string) => void;
}

function useDeptItems(deptId: string): DeptItem[] {
  const [items, setItems] = useState<DeptItem[]>(() => loadDeptItems(deptId));
  useEffect(() => {
    const refresh = () => setItems(loadDeptItems(deptId));
    window.addEventListener("dept-items-updated", refresh);
    return () => window.removeEventListener("dept-items-updated", refresh);
  }, [deptId]);
  return items;
}

export function DepartmentsPage({ onNavigate }: DepartmentsPageProps) {
  const nav = (page: string) => {
    if (onNavigate) onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const medicalItems = useDeptItems("medical");
  const researchItems = useDeptItems("research");

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: 0 }}>

      {/* Hero header */}
      <section className="upmc-hero-section" style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(24px,4vw,32px)", fontWeight: 900,
            color: "#0f172a", margin: 0,
          }}>
            Our Departments
          </h1>
        </div>
      </section>

      {/* Departments Grid */}
      <section style={{ padding: "32px 24px 56px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div className="upmc-dept-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 22,
          }}>
            <DepartmentCard
              title="Medical Department"
              description=""
              deptId="medical"
              fallbackImage={FALLBACK_MEDICAL}
              items={medicalItems}
              linkLabel="View All Medical Services"
              linkKey="services"
              onNavigate={nav}
            />
            <DepartmentCard
              title="Research & Education Department"
              description=""
              deptId="research"
              fallbackImage={FALLBACK_RESEARCH}
              items={researchItems}
              linkLabel="Explore Research & Education"
              linkKey="research"
              onNavigate={nav}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
