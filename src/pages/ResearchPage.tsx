import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  Microscope, Wind, Heart, Users, Activity,
  Stethoscope, Droplets, Shield, Moon, Leaf,
  AlertTriangle, Zap, FlaskConical, BookOpen,
  GraduationCap, Globe, Award, ChevronRight, UserCircle2,
  ChevronLeft, ImageIcon
} from "lucide-react";

// ── Publications ─────────────────────────────────────────────────────────────
interface PubData { id: string; title: string; journal: string; doi: string; }

function normalizeDoi(raw: string): string {
  return raw.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
}

function PublicationCard({ pub }: { pub: PubData }) {
  const [citations, setCitations] = useState<number | null>(null);
  const [year, setYear]           = useState<number | null>(null);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    const doi = normalizeDoi(pub.doi);
    if (!doi.startsWith('10.')) return;
    setLoading(true);
    fetch(`https://api.openalex.org/works/doi:${doi}?select=cited_by_count,publication_year`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setCitations(d.cited_by_count ?? null); setYear(d.publication_year ?? null); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pub.doi]);

  const href = pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-gray-900 text-sm leading-snug">{pub.title}</h3>
      <p className="text-xs font-semibold text-blue-600">{pub.journal}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {year && <span>📅 {year}</span>}
        {loading
          ? <span className="italic text-gray-400">Fetching metrics…</span>
          : citations !== null && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
              📊 {citations} citation{citations !== 1 ? 's' : ''}
            </span>
          )
        }
      </div>
      {pub.doi && (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-xs text-emerald-700 font-semibold hover:underline self-start">
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
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
      <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-400 font-semibold text-base">No publications yet</p>
      <p className="text-gray-400 text-sm mt-1">Add publications via the Admin Panel</p>
    </div>
  ) : (
    <div className="grid md:grid-cols-2 gap-6">
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
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Photo — fills the slot perfectly */}
      <div style={{ height: 280, overflow: "hidden", background: "#f1f5f9", flexShrink: 0, position: "relative" }}>
        {photo
          ? <img
              src={photo}
              alt={member.name || member.role}
              style={{ width: "100%", height: "280px", objectFit: "cover", objectPosition: "center 15%", display: "block" }}
            />
          : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#d1d5db" }}>
              <UserCircle2 style={{ width: 80, height: 80 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>Photo uploaded via Admin</span>
            </div>
        }
      </div>
      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-1">
        <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#166534" }}>{member.role}</span>
        {member.name && <p className="font-bold text-gray-900 text-base leading-tight">{member.name}</p>}
        {member.bio && <p className="text-sm text-gray-600 leading-relaxed mt-1">{member.bio}</p>}
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
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <ImageIcon className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-400 font-semibold text-sm">Upload partner logos via Admin Panel</p>
      </div>
    );
  }

  const totalCopies = Math.ceil(20 / logos.length) * 2;
  const track: string[] = [];
  for (let i = 0; i < totalCopies; i++) track.push(...logos);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Scrolling track */}
      <div className="rp-marquee-track" style={{ display: "inline-flex", alignItems: "center", width: "max-content" }}>
        {track.map((src, i) => (
          <div key={i} style={{ padding: "0 40px", flexShrink: 0 }}>
            <div style={{ width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={src} alt={`Research Partner ${(i % logos.length) + 1}`}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
            </div>
          </div>
        ))}
      </div>
      {/* Edge fades */}
      <div style={{ position: "absolute", inset: "0 auto 0 0", width: 120, background: "linear-gradient(90deg,#f9fafb,transparent)", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", inset: "0 0 0 auto", width: 120, background: "linear-gradient(270deg,#f9fafb,transparent)", pointerEvents: "none", zIndex: 10 }} />
      <style>{`
        .rp-marquee-track { animation: rpScroll 60s linear infinite; }
        .rp-marquee-track:hover { animation-play-state: paused; }
        @keyframes rpScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

// kept for reference but rendering now uses useResearchAreas() hook
const _RESEARCH_AREAS_STATIC = [
  {
    category: "Respiratory Medicine",
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    items: [
      {
        icon: Activity,
        title: "Pulmonary Hypertension",
        description:
          "Investigation of elevated pulmonary arterial pressure and its impact on right ventricular function. Our research focuses on early diagnostic markers, epidemiology in sub-Saharan Africa, and the optimisation of therapeutic protocols adapted to resource-limited settings.",
      },
      {
        icon: Wind,
        title: "Obstructive Lung Diseases: COPD & Asthma",
        description:
          "Comprehensive research into chronic obstructive pulmonary disease and asthma, encompassing spirometric screening programmes, disease phenotyping, trigger identification, and the development of locally adapted management guidelines to improve patient outcomes.",
      },
      {
        icon: Stethoscope,
        title: "Interstitial Lung Diseases (ILD)",
        description:
          "Study of progressive fibrotic and inflammatory disorders of the lung parenchyma. Research priorities include early detection using high-resolution imaging, biomarker discovery, and evaluation of antifibrotic therapies in African patient populations.",
      },
      {
        icon: Droplets,
        title: "Pleural Diseases",
        description:
          "Clinical and translational research into pleural effusions, spontaneous pneumothorax, pleuritis, and pleural malignancy. We investigate aetiology, minimally invasive diagnostic techniques, and evidence-based drainage and management strategies.",
      },
      {
        icon: Moon,
        title: "Sleep Disorders (PSG)",
        description:
          "Polysomnography-guided investigation of sleep-disordered breathing, including obstructive sleep apnoea syndrome. Our programme aims to establish locally adapted diagnostic pathways, expand PSG capacity, and evaluate CPAP adherence and outcomes.",
      },
    ],
  },
  {
    category: "Critical Care",
    color: "#dc2626",
    bg: "#fff1f2",
    border: "#fecdd3",
    items: [
      {
        icon: Activity,
        title: "Acute Respiratory Distress Syndrome (ARDS)",
        description:
          "Investigation of lung-protective ventilation strategies, prone positioning protocols, and adjunct therapies for ARDS. Research evaluates short- and long-term outcomes in critically ill patients, including post-intensive care syndrome.",
      },
    ],
  },
  {
    category: "Cardiovascular Research",
    color: "#be185d",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    items: [
      {
        icon: Heart,
        title: "Rheumatic Heart Disease",
        description:
          "Epidemiological and clinical research into rheumatic fever and its cardiac sequelae, a leading cause of acquired valvular disease in sub-Saharan Africa. Studies focus on echocardiographic screening programmes, secondary prophylaxis adherence, and surgical access advocacy.",
      },
    ],
  },
  {
    category: "Infectious & Tropical Diseases",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    items: [
      {
        icon: FlaskConical,
        title: "Schistosomiasis",
        description:
          "Investigation of Schistosoma infection prevalence, morbidity, and long-term organ damage, particularly hepatosplenic and pulmonary complications. Research supports mass drug administration programmes and the development of robust surveillance systems.",
      },
      {
        icon: Microscope,
        title: "Rare Diseases",
        description:
          "Dedicated research programme to improve awareness, diagnostic capacity, and equitable access to care for rare and orphan diseases in Rwanda. We work to establish national registries and strengthen referral pathways for complex, multi-system conditions.",
      },
    ],
  },
  {
    category: "Occupational & Environmental Health",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    items: [
      {
        icon: Wind,
        title: "Occupational Lung Diseases",
        description:
          "Surveillance and research into respiratory conditions caused by occupational exposure to dust, gases, fumes, and chemical agents, including pneumoconiosis, occupational asthma, and hypersensitivity pneumonitis. Studies inform workplace health policy and preventive interventions.",
      },
    ],
  },
  {
    category: "Community & Public Health",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    items: [
      {
        icon: Users,
        title: "Community NCD Prevention Activities",
        description:
          "Design, implementation, and evaluation of community-based programmes that promote healthy lifestyles, early disease screening, and public health literacy to reduce the growing burden of Non-Communicable Diseases. We partner with local authorities, schools, faith-based organisations, and civil society groups.",
      },
    ],
  },
];

// kept for reference but rendering now uses useEducation() hook
const _CPD_PROGRAMMES_STATIC = [
  {
    icon: GraduationCap,
    title: "Continuing Professional Development (CPD)",
    description:
      "Structured CPD training sessions accredited by the Rwanda Medical and Dental Council, covering advances in internal medicine, pulmonology, cardiology, and critical care. Open to physicians, nurses, and allied health professionals.",
  },
  {
    icon: BookOpen,
    title: "Clinical Research Training",
    description:
      "Workshops in research methodology, biostatistics, ethical review, and scientific writing, equipping clinicians with the skills to generate and publish high-quality evidence from clinical practice.",
  },
  {
    icon: Globe,
    title: "International Collaborations",
    description:
      "Active partnerships with academic medical centres, research consortia, and global health organisations to co-investigate cross-border disease patterns and implement evidence-based interventions.",
  },
  {
    icon: Award,
    title: "Fellowship & Mentorship",
    description:
      "Mentorship programmes for junior clinicians and medical students, fostering the next generation of clinical researchers and academic physicians committed to advancing healthcare in Rwanda.",
  },
];

// ── Dyn section components ───────────────────────────────────────────────────
function DynTeamSection() {
  const team = useTeam();
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {team.map(m => <TeamMemberCard key={m.id} member={m} />)}
    </div>
  );
}

function DynAreasSection() {
  const areas = useResearchAreas();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {areas.map(group => (
        <div key={group.id} className="rounded-2xl border p-6" style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ background: "#0284c7" }} />
            <h3 className="text-base font-extrabold" style={{ color: "#0284c7" }}>{group.category}</h3>
          </div>
          <ul className="space-y-2.5">
            {group.items.map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0284c7" }} />
                <span className="text-sm font-medium text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DynEduSection() {
  const edu = useEducation();
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {edu.map(item => (
        <div key={item.id} className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 text-sm">{item.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section number badge ─────────────────────────────────────────────────────
function SectionBadge({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-lg">{n}</span>
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">{label}</h2>
    </div>
  );
}

function ResearchHeroBadge() {
  const { t } = useLanguage();
  return <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">{t.research.badge}</span>;
}
function ResearchHeroHeading() {
  const { t } = useLanguage();
  return (
    <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
      {t.research.heading}
    </h1>
  );
}
function ResearchHeroSubtitle() {
  const { t } = useLanguage();
  return <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">{t.research.subtitle}</p>;
}

export function ResearchPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-16">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Microscope className="w-4 h-4 text-emerald-400" />
            <ResearchHeroBadge />
          </div>
          <ResearchHeroHeading />
          <ResearchHeroSubtitle />
        </div>
      </section>

      {/* explicit spacer */}
      <div style={{ height: 80, background: "#fff" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Research Team
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-16 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ color: "#166534" }}>{t.research.team}</h2>
          <DynTeamSection />
        </div>
      </section>

      {/* explicit spacer */}
      <div style={{ height: 80, background: "#fff" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — Research Areas
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ color: "#166534" }}>{t.research.areas}</h2>
          <DynAreasSection />
        </div>
      </section>

      {/* explicit spacer */}
      <div style={{ height: 80, background: "#fff" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          Our Publications
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ color: "#166534" }}>{t.research.publications}</h2>
          <PublicationsSection />
        </div>
      </section>

      {/* explicit spacer */}
      <div style={{ height: 80, background: "#f9fafb" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          Education
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ color: "#166534" }}>{t.research.education}</h2>
          <DynEduSection />
        </div>
      </section>

      {/* explicit spacer */}
      <div style={{ height: 80, background: "#f9fafb" }} />

      {/* ── Research Partners ── */}
      <section className="pt-16 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ color: "#166534" }}>{t.research.partners}</h2>
          <ResearchPartnersSlider />
        </div>
      </section>

    </div>
  );
}
