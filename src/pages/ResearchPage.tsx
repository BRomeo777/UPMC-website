import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

// ── Publications ─────────────────────────────────────────────────────────────
interface PubData { id: string; title: string; journal: string; doi: string; }

function normalizeDoi(raw: string): string {
  return raw.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
}

function PublicationCard({ pub }: { pub: PubData }) {
  const [hovered, setHovered] = useState(false);

  const href = pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        padding: "22px 24px", display: "flex", flexDirection: "column", gap: 10,
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
        borderLeft: "4px solid #0d9488",
      }}
    >
      <h3 style={{ fontWeight: 500, color: "#0f172a", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{pub.title}</h3>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", margin: 0 }}>{pub.journal}</p>
      {pub.doi && (
        <a href={href} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#0d9488", fontWeight: 700, textDecoration: "none" }}>
          View Publication →
        </a>
      )}
    </div>
  );
}

function usePublications(): PubData[] {
  const load = (): PubData[] => { try { return JSON.parse(localStorage.getItem('upmc-publications') || '[]'); } catch { return []; } };
  const [pubs, setPubs] = useState<PubData[]>(load);
  useEffect(() => {
    const refresh = () => setPubs(load());
    window.addEventListener('publications-updated', refresh);
    return () => window.removeEventListener('publications-updated', refresh);
  }, []);
  return pubs;
}

function PublicationsSection() {
  const pubs = usePublications();
  return pubs.length === 0 ? (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", borderRadius: 16, border: "2px dashed #e2e8f0", background: "#f8fafc" }}>
      <span style={{ fontSize: 40, marginBottom: 12 }}>📄</span>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 4px" }}>No publications yet</p>
      <p style={{ fontSize: 13, color: "#cbd5e1", margin: 0 }}>Add publications via the Admin Panel</p>
    </div>
  ) : (
    <div className="upmc-pubs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
      {pubs.map(pub => <PublicationCard key={pub.id} pub={pub} />)}
    </div>
  );
}

// ── Dynamic types & hooks (admin panel data) ─────────────────────────────────
interface DynTeamMember { id: string; name: string; role: string; bio: string; }
interface DynResArea    { id: string; category: string; items: string[]; }
interface DynEduItem    { id: string; title: string; description: string; }

const DEFAULT_TEAM_RESEARCH: DynTeamMember[] = [
  { id: "director", name: "", role: "Senior Research Associate", bio: "The Senior Research Associate leads the clinic's research programme, overseeing all clinical and translational studies, managing institutional collaborations, and ensuring adherence to the highest standards of scientific integrity and research ethics." },
  { id: "senior",   name: "", role: "Research Assistant",       bio: "The Research Assistant supports the execution of clinical and translational studies at UPMC, contributing to data collection, participant follow-up, literature reviews, and regulatory documentation." },
];

const DEFAULT_AREAS_RESEARCH: DynResArea[] = [
  { id: "respiratory", category: "Respiratory Medicine",         items: ["Pulmonary Hypertension", "Obstructive Lung Diseases: COPD & Asthma", "Interstitial Lung Diseases (ILD)", "Pleural Diseases", "Sleep Disorders (PSG)"] },
  { id: "critical",    category: "Critical Care",                items: ["Acute Respiratory Distress Syndrome (ARDS)"] },
  { id: "cardio",      category: "Cardiovascular Research",      items: ["Rheumatic Heart Disease"] },
  { id: "infectious",  category: "Infectious & Tropical Diseases", items: ["Schistosomiasis", "Rare Diseases"] },
  { id: "occupational",category: "Occupational & Environmental Health", items: ["Occupational Lung Diseases"] },
  { id: "community",   category: "Community & Public Health",    items: ["Community NCD Prevention Activities"] },
];

const DEFAULT_EDU_RESEARCH: DynEduItem[] = [
  { id: "cpd",      title: "Continuing Professional Development (CPD)", description: "Structured CPD training sessions accredited by the Rwanda Medical and Dental Council, covering advances in internal medicine, pulmonology, cardiology, and critical care." },
  { id: "research", title: "Clinical Research Training",               description: "Workshops in research methodology, biostatistics, ethical review, and scientific writing, equipping clinicians with the skills to generate and publish high-quality evidence." },
  { id: "global",   title: "International Collaborations",             description: "Active partnerships with academic medical centres, research consortia, and global health organisations to co-investigate cross-border disease patterns." },
  { id: "fellow",   title: "Fellowship & Mentorship",                  description: "Mentorship programmes for junior clinicians and medical students, fostering the next generation of clinical researchers and academic physicians." },
];

function useTeam(): DynTeamMember[] {
  const load = (): DynTeamMember[] => {
    try {
      const stored = localStorage.getItem("upmc-research-team-v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length) return parsed.map((m: DynTeamMember) => ({
          ...m,
          name: m.name || localStorage.getItem(`upmc-researcher-name-${m.id}`) || "",
          bio:  m.bio  || localStorage.getItem(`upmc-researcher-bio-${m.id}`)  || m.bio,
        }));
      }
    } catch { /* ignore */ }
    return DEFAULT_TEAM_RESEARCH.map(m => ({
      ...m,
      name: localStorage.getItem(`upmc-researcher-name-${m.id}`) || "",
      bio:  localStorage.getItem(`upmc-researcher-bio-${m.id}`)  || m.bio,
    }));
  };
  const [team, setTeam] = useState<DynTeamMember[]>(load);
  useEffect(() => {
    const refresh = () => setTeam(load());
    window.addEventListener("researchers-updated", refresh);
    return () => window.removeEventListener("researchers-updated", refresh);
  }, []);
  return team;
}

function useResearchAreas(): DynResArea[] {
  const load = (): DynResArea[] => {
    try {
      const stored = localStorage.getItem("upmc-research-areas-v2");
      if (stored) { const p = JSON.parse(stored); if (p.length) return p; }
    } catch { /* ignore */ }
    return DEFAULT_AREAS_RESEARCH;
  };
  const [areas, setAreas] = useState<DynResArea[]>(load);
  useEffect(() => {
    const refresh = () => setAreas(load());
    window.addEventListener("research-areas-updated", refresh);
    return () => window.removeEventListener("research-areas-updated", refresh);
  }, []);
  return areas;
}

function useEducation(): DynEduItem[] {
  const load = (): DynEduItem[] => {
    try {
      const stored = localStorage.getItem("upmc-education-v2");
      if (stored) { const p = JSON.parse(stored); if (p.length) return p; }
    } catch { /* ignore */ }
    return DEFAULT_EDU_RESEARCH;
  };
  const [edu, setEdu] = useState<DynEduItem[]>(load);
  useEffect(() => {
    const refresh = () => setEdu(load());
    window.addEventListener("education-updated", refresh);
    return () => window.removeEventListener("education-updated", refresh);
  }, []);
  return edu;
}

function getInitialsR(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function TeamMemberCard({ member }: { member: DynTeamMember }) {
  const getPhoto = () =>
    localStorage.getItem(`upmc-service-img-researcher-${member.id}`) ||
    localStorage.getItem(`upmc-researcher-photo-${member.id}`) || "";
  const [photo, setPhoto] = useState(getPhoto);
  useEffect(() => {
    const refresh = () => setPhoto(getPhoto());
    window.addEventListener("researchers-updated", refresh);
    window.addEventListener("service-photos-updated", refresh);
    return () => {
      window.removeEventListener("researchers-updated", refresh);
      window.removeEventListener("service-photos-updated", refresh);
    };
  }, [member.id]);
  const initials = getInitialsR(member.name || member.role);
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
      <div className="upmc-card-body" style={{ padding: "32px 36px" }}>
        {/* Photo — floats left, text wraps around it */}
        <div className="upmc-card-photo" style={{
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
              alt={member.name || member.role}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", borderRadius: 12 }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d9488,#0f766e)", borderRadius: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: "#5eead4", opacity: 0.9, letterSpacing: "-0.02em" }}>{initials || "?"}</span>
            </div>
          )}
        </div>

        {/* Name + role — beside photo */}
        {member.name && (
          <h3 className="upmc-card-name" style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            {member.name}
          </h3>
        )}
        {member.role && (
          <p style={{ fontSize: 13, color: "#0d9488", fontWeight: 700, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {member.role}
          </p>
        )}

        {/* Bio — wraps around photo, continues full-width below */}
        {member.bio && (
          <div style={{ overflow: "hidden" }}>
            <p className="upmc-card-bio" style={{ fontSize: 14.5, color: "#4b5563", lineHeight: 1.85, margin: 0, textAlign: "justify", whiteSpace: "pre-wrap" }}>
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

// ── Research Partners Slider ─────────────────────────────────────────────────
const PARTNER_LOGO_KEYS = Array.from({ length: 20 }, (_, i) => `rp-logo-${i + 1}`);

function usePartnerLogos() {
  const load = () => PARTNER_LOGO_KEYS.map(k => localStorage.getItem(`upmc-service-img-research-partner-${k}`) || "").filter(Boolean);
  const [logos, setLogos] = useState<string[]>(load);
  useEffect(() => {
    const refresh = () => setLogos(load());
    window.addEventListener("service-photos-updated", refresh);
    return () => window.removeEventListener("service-photos-updated", refresh);
  });
  return logos;
}

function ResearchPartnersSlider() {
  const logos = usePartnerLogos();

  if (!logos.length) {
    return null;
  }

  const totalCopies = Math.ceil(20 / logos.length) * 2;
  const track: string[] = [];
  for (let i = 0; i < totalCopies; i++) track.push(...logos);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div className="rp-marquee-track" style={{ display: "inline-flex", alignItems: "center", width: "max-content" }}>
        {track.map((src, i) => (
          <div key={i} className="upmc-partner-item" style={{ padding: "0 40px", flexShrink: 0 }}>
            <div style={{ width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={src} alt={`Research Partner ${(i % logos.length) + 1}`}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: "0 auto 0 0", width: 120, background: "linear-gradient(90deg,#f8fafc,transparent)", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", inset: "0 0 0 auto", width: 120, background: "linear-gradient(270deg,#f8fafc,transparent)", pointerEvents: "none", zIndex: 10 }} />
      <style>{`
        .rp-marquee-track { animation: rpScroll 60s linear infinite; }
        .rp-marquee-track:hover { animation-play-state: paused; }
        @keyframes rpScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

function ResearchPartnersSection() {
  const { t } = useLanguage();
  const logos = usePartnerLogos();
  if (!logos.length) return null;
  return (
    <div className="upmc-research-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 64px" }}>
      <SectionHeading label={t.research.partners} />
      <ResearchPartnersSlider />
    </div>
  );
}

// ── Dyn section components ───────────────────────────────────────────────────
function DynTeamSection() {
  const team = useTeam();
  return (
    <div className="upmc-card-list" style={{ maxWidth: 1020, marginLeft: 40, display: "flex", flexDirection: "column", gap: 32 }}>
      {team.map(m => <TeamMemberCard key={m.id} member={m} />)}
    </div>
  );
}

function DynAreasSection() {
  const areas = useResearchAreas();
  return (
    <div className="upmc-areas-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
      {areas.map(group => (
        <div key={group.id} style={{
          borderRadius: 16, border: "1px solid #ccfbf1", padding: "24px 22px",
          background: "linear-gradient(135deg,#f0fdfa 0%,#fff 100%)",
          transition: "box-shadow 0.25s,transform 0.25s",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,148,136,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0d9488", margin: 0, letterSpacing: "-0.01em" }}>{group.category}</h3>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {group.items.map(item => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EduCard({ item }: { item: DynEduItem }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: 18, padding: "22px 24px", borderRadius: 16,
        border: "1px solid #e2e8f0", background: "#fff",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: "linear-gradient(135deg,#0d9488,#0f766e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>🎓</div>
      <div>
        <h4 style={{ fontWeight: 800, color: "#0f172a", margin: "0 0 8px", fontSize: 14, letterSpacing: "-0.01em" }}>{item.title}</h4>
        <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
      </div>
    </div>
  );
}

function DynEduSection() {
  const edu = useEducation();
  return (
    <div className="upmc-edu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
      {edu.map(item => <EduCard key={item.id} item={item} />)}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ label, accent }: { label: string; accent?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>{label}</h2>
    </div>
  );
}

export function ResearchPage() {
  const { t } = useLanguage();
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="upmc-hero-section" style={{ background: "#fff", padding: "20px 24px 8px" }}>
      </section>

      {/* ── Research Team ── */}
      <div className="upmc-research-section" style={{ padding: "48px 24px" }}>
        <div className="upmc-team-heading" style={{ textAlign: "left", marginLeft: "33%", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>{t.research.team}</h2>
        </div>
        <DynTeamSection />
      </div>

      {/* ── Research Areas ── */}
      <div className="upmc-research-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 48px" }}>
        <SectionHeading label={t.research.areas} />
        <DynAreasSection />
      </div>

      {/* ── Publications ── */}
      <div className="upmc-research-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 48px" }}>
        <SectionHeading label={t.research.publications} />
        <PublicationsSection />
      </div>

      {/* ── Education ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="upmc-research-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          <SectionHeading label={t.research.education} />
          <DynEduSection />
        </div>
      </div>

      {/* ── Research Partners ── */}
      <ResearchPartnersSection />

    </div>
  );
}
