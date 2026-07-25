import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SvcCard { id: string; dept: string; subDept: string; title: string; description: string; imageKey: string; translations?: { rw?: { title?: string; description?: string }; fr?: { title?: string; description?: string }; sw?: { title?: string; description?: string }; }; }

const DEFAULT_SERVICES: SvcCard[] = [
  { id: "general-consultation", dept: "General Consultation", subDept: "", title: "General Consultation", description: "Comprehensive first-contact medical consultations for patients of all ages.", imageKey: "general-consultation" },
  { id: "spirometry", dept: "Internal Medicine", subDept: "Pulmonology", title: "Spirometry", description: "Lung function testing that measures airflow and breathing capacity to detect and monitor respiratory diseases.", imageKey: "spirometry" },
  { id: "epet", dept: "Internal Medicine", subDept: "Pulmonology", title: "Electro-Pulmonary Exercise Test", description: "An advanced cardio-pulmonary exercise assessment evaluating how the heart and lungs respond under physical stress.", imageKey: "epet" },
  { id: "chester", dept: "Internal Medicine", subDept: "Pulmonology", title: "Chester Step Test", description: "A standardised fitness assessment evaluating cardiovascular endurance and issuing fitness-to-work or fitness-to-sport certification.", imageKey: "chester" },
  { id: "endoscopy-pulmo", dept: "Internal Medicine", subDept: "Pulmonology", title: "Endoscopy", description: "Minimally invasive visual examination of the respiratory tract and upper digestive system for diagnosis and therapeutic procedures.", imageKey: "endoscopy-pulmo" },
  { id: "cardiology", dept: "Internal Medicine", subDept: "Cardiology", title: "Cardiology", description: "Comprehensive evaluation and management of cardiovascular and cardio-pulmonary diseases, with focus on early detection, prevention, and long-term care.", imageKey: "cardiology" },
  { id: "ecg", dept: "Internal Medicine", subDept: "Cardiology", title: "Electrocardiography (ECG)", description: "A non-invasive test recording the electrical activity of the heart to identify arrhythmias, ischaemia, and other cardiac abnormalities.", imageKey: "ecg" },
  { id: "echocardiography", dept: "Internal Medicine", subDept: "Cardiology", title: "Echocardiography", description: "Ultrasound imaging of the heart to assess its structure and function, enabling accurate diagnosis of cardiac conditions.", imageKey: "echocardiography" },
  { id: "hospitalisation-internal", dept: "Internal Medicine", subDept: "Hospitalisation", title: "Hospitalisation", description: "Inpatient care and monitoring for adult patients requiring close medical supervision, treatment, and recovery under the Internal Medicine team.", imageKey: "hospitalisation-internal" },
  { id: "pediatric-consult", dept: "Pediatrics", subDept: "", title: "General Pediatric Consultations", description: "Thorough medical assessments for infants, children, and adolescents, from well-child checks to acute illness management.", imageKey: "pediatric-consult" },
  { id: "endoscopy-peds", dept: "Pediatrics", subDept: "", title: "Endoscopy", description: "Safe, minimally invasive endoscopic procedures adapted for children, used for diagnosis and treatment of gastrointestinal and respiratory conditions.", imageKey: "endoscopy-peds" },
  { id: "hospitalisation-peds", dept: "Pediatrics", subDept: "", title: "Hospitalisation", description: "Dedicated inpatient care for children requiring observation, treatment, and recovery in a safe, child-friendly environment with specialist support.", imageKey: "hospitalisation-peds" },
  { id: "cpd-training", dept: "CPD Training", subDept: "", title: "CPD Training", description: "Accredited Continuing Professional Development programmes for healthcare workers, keeping clinical teams updated with the latest evidence-based practices and skills.", imageKey: "cpd-training" },
];

function loadServices(): SvcCard[] {
  try {
    const stored = localStorage.getItem("upmc-services-v2");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_SERVICES;
}

function useServices() {
  const [services, setServices] = useState<SvcCard[]>(loadServices);
  useEffect(() => {
    const refresh = () => setServices(loadServices());
    window.addEventListener("services-updated", refresh);
    return () => window.removeEventListener("services-updated", refresh);
  }, []);
  return services;
}

/* ── Dept colour palette ── */
const DEPT_PALETTES: Record<string, [string, string]> = {
  "General Consultation": ["#0d9488", "#5eead4"],
  "Internal Medicine":    ["#0f766e", "#a7f3d0"],
  "Pulmonology":          ["#1e3a5f", "#93c5fd"],
  "Cardiology":           ["#7f1d1d", "#fca5a5"],
  "Hospitalisation":      ["#3b0764", "#d8b4fe"],
  "Pediatrics":           ["#14532d", "#86efac"],
  "CPD Training":         ["#78350f", "#fcd34d"],
};
const defaultPalette: [string, string] = ["#1e293b", "#cbd5e1"];
const getDeptPalette = (d: string) => DEPT_PALETTES[d] ?? defaultPalette;

/* ── Medical icons SVG per dept/sub ── */
function DeptIcon({ dept }: { dept: string }) {
  const icons: Record<string, React.ReactElement> = {
    "Pulmonology": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v9m0 0c-1.5-2-4-2-5 0s-1 5 1 6 4-1 4-6zm0 0c1.5-2 4-2 5 0s1 5-1 6-4-1-4-6z"/></svg>,
    "Cardiology": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    "Hospitalisation": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
    "Pediatrics": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>,
    "General Consultation": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    "CPD Training": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422A12 12 0 0 1 20 16.9V18a8 8 0 0 1-16 0v-1.1a12 12 0 0 1 1.84-6.322L12 14z"/></svg>,
    "Internal Medicine": <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5m4 0h4m6-8v8m0 0h-4m4 0h2"/><circle cx="12" cy="17" r="3"/></svg>,
  };
  return icons[dept] ?? icons["Internal Medicine"];
}

/* ── Service Card ── */
function ServiceCard({ svc, deptLabel }: { svc: SvcCard; deptLabel: string }) {
  const [hovered, setHovered] = useState(false);
  const storageKey = `upmc-service-img-${svc.imageKey}`;
  const [src, setSrc] = useState<string>(() => localStorage.getItem(storageKey) || "");

  useEffect(() => {
    const refresh = () => setSrc(localStorage.getItem(storageKey) || "");
    window.addEventListener("service-photos-updated", refresh);
    return () => window.removeEventListener("service-photos-updated", refresh);
  }, [storageKey]);

  const [bg, accent] = getDeptPalette(svc.subDept || svc.dept);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered ? "0 20px 48px rgba(0,0,0,0.13)" : "0 2px 14px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image / Placeholder */}
      <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0, background: "#f8fafc" }}>
        {src ? (
          <img
            src={src}
            alt={svc.title}
            className="upmc-service-img"
            style={{ width: "100%", height: "100%", maxWidth: "none", objectFit: "cover", objectPosition: "center", display: "block" }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${bg} 0%, #0d9488 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: accent, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Photo coming soon</span>
          </div>
        )}
        {/* Teal accent bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 56, height: 3, background: "#0d9488" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {svc.title}
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0, flex: 1 }}>
          {svc.description}
        </p>
      </div>
    </div>
  );
}

/* ── Sub-dept divider ── */
function SubDeptLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "36px 0 20px" }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
    </div>
  );
}

/* ── Dept section header ── */
function DeptHeader({ dept }: { dept: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>{dept}</h2>
    </div>
  );
}

export function ServicesSection() {
  const { t, lang } = useLanguage();
  const services = useServices();
  const depts = Array.from(new Set(services.map(s => s.dept)));
  const [activeTab, setActiveTab] = useState("all");

  const tDept = (d: string) => t.serviceCards?.depts[d] ?? d;
  const tSub  = (s: string) => t.serviceCards?.subDepts[s] ?? s;
  const tCard = (s: SvcCard) => {
    const lk = lang as "rw" | "fr" | "sw";
    const stored = ["rw", "fr", "sw"].includes(lang) ? s.translations?.[lk] : undefined;
    return {
      title: stored?.title ?? t.serviceCards?.cards[s.id]?.title ?? s.title,
      description: stored?.description ?? t.serviceCards?.cards[s.id]?.description ?? s.description,
    };
  };

  const visibleDepts = activeTab === "all" ? depts : depts.filter(d => d === activeTab);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="upmc-hero-section" style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            {t.services.heading}
          </h1>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none" }}>
          {["all", ...depts].map(tab => {
            const label = tab === "all" ? "All Services" : tDept(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flexShrink: 0,
                  padding: "14px 18px",
                  border: "none",
                  background: "transparent",
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? "#0d9488" : "#64748b",
                  borderBottom: isActive ? "3px solid #0d9488" : "3px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >{label}</button>
            );
          })}
        </div>
      </div>

      {/* ── Dept Sections ── */}
      <div className="upmc-services-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}>
        {visibleDepts.map((dept, di) => {
          const deptServices = services.filter(s => s.dept === dept);
          const subDepts = Array.from(new Set(deptServices.map(s => s.subDept).filter(Boolean)));
          const noSub = deptServices.filter(s => !s.subDept);

          return (
            <div key={dept} style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              padding: "32px 28px",
              marginBottom: di < visibleDepts.length - 1 ? 28 : 0,
              boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
            }}>
              <DeptHeader dept={tDept(dept)} />

              {noSub.length > 0 && (
                <div className="upmc-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                  {noSub.map(s => {
                    const { title, description } = tCard(s);
                    return <ServiceCard key={s.id} svc={{ ...s, title, description }} deptLabel={tDept(dept)} />;
                  })}
                </div>
              )}

              {subDepts.map(sub => (
                <div key={sub}>
                  <SubDeptLabel label={tSub(sub)} />
                  <div className="upmc-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                    {deptServices.filter(s => s.subDept === sub).map(s => {
                      const { title, description } = tCard(s);
                      return <ServiceCard key={s.id} svc={{ ...s, title, description }} deptLabel={tSub(sub)} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
