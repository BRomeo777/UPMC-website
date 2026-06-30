import { ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
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

interface CardProps {
  imageKey: string;
  tag: string;
  title: string;
  description: string;
}

function Card({ imageKey, tag, title, description }: CardProps) {
  const storageKey = `upmc-service-img-${imageKey}`;
  const [src, setSrc] = useState<string>(() => localStorage.getItem(storageKey) || "");

  useEffect(() => {
    const refresh = () => setSrc(localStorage.getItem(storageKey) || "");
    window.addEventListener("service-photos-updated", refresh);
    return () => window.removeEventListener("service-photos-updated", refresh);
  }, [storageKey]);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-emerald-400 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* ── Image ── */}
      <div className="relative w-full bg-gray-100 overflow-hidden flex-shrink-0" style={{ height: 180 }}>
        {src ? (
          <img
            src={src}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 font-semibold tracking-wide">Upload via Admin Panel</p>
          </div>
        )}
      </div>

      {/* ── Divider line ── */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300 group-hover:from-emerald-500 group-hover:to-emerald-400 transition-colors duration-300" />

      {/* ── Text ── */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-emerald-600 mb-1.5 leading-snug">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ── Section header ── */
function SectionTitle({ title, subtitle }: { dept?: string; title: string; subtitle: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-4xl lg:text-5xl font-extrabold text-blue-700 mb-4 leading-tight">{title}</h2>
      {subtitle && <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ── Sub-section label ── */
function SubLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 mt-12">
      <div className="w-1 h-8 bg-emerald-500 rounded-full" />
      <span className="text-2xl font-extrabold text-blue-700">{label}</span>
    </div>
  );
}

export function ServicesSection() {
  const { t, lang } = useLanguage();
  const services = useServices();
  const depts = Array.from(new Set(services.map(s => s.dept)));

  const tDept = (d: string) => t.serviceCards?.depts[d] ?? d;
  const tSub = (s: string) => t.serviceCards?.subDepts[s] ?? s;
  const tCard = (s: SvcCard) => {
    const lk = lang as "rw" | "fr" | "sw";
    const stored = ["rw", "fr", "sw"].includes(lang) ? s.translations?.[lk] : undefined;
    return {
      title: stored?.title ?? t.serviceCards?.cards[s.id]?.title ?? s.title,
      description: stored?.description ?? t.serviceCards?.cards[s.id]?.description ?? s.description,
    };
  };


  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Page banner ── */}
      <div className="bg-white border-b border-gray-100 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-6">
            {t.services.badge}
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            {t.services.heading}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>
      </div>

      {/* ── Dynamic dept sections ── */}
      {depts.map((dept, di) => {
        const deptServices = services.filter(s => s.dept === dept);
        const subDepts = Array.from(new Set(deptServices.map(s => s.subDept).filter(Boolean)));
        const noSub = deptServices.filter(s => !s.subDept);
        const bg = di % 2 === 0 ? "bg-gray-50 border-b border-gray-100" : "bg-white border-t border-gray-100";
        return (
          <div key={dept} className={`py-10 lg:py-14 ${bg}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle dept="" title={tDept(dept)} subtitle="" />

              {/* Services without a sub-dept */}
              {noSub.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                  {noSub.map(s => {
                    const { title, description } = tCard(s);
                    return <Card key={s.id} imageKey={s.imageKey} tag={tDept(s.dept)} title={title} description={description} />;
                  })}
                </div>
              )}

              {/* Services grouped by sub-dept */}
              {subDepts.map(sub => (
                <div key={sub}>
                  <SubLabel label={tSub(sub)} />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                    {deptServices.filter(s => s.subDept === sub).map(s => {
                      const { title, description } = tCard(s);
                      return <Card key={s.id} imageKey={s.imageKey} tag={tSub(sub)} title={title} description={description} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}
