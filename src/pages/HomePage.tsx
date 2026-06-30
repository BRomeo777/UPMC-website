import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { DeptSliders } from "../components/DeptSliders";
import { PartnerCarousel } from "../components/PartnerCarousel";
import { useLanguage } from "../i18n/LanguageContext";

export function HomePage() {
  const { t } = useLanguage();
  return (
    <div>
      <HeroSection />
      <AboutSection />

      {/* Departments mention */}
      <section className="bg-blue-50 border-t border-b border-blue-100 py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-bold uppercase tracking-widest mb-5" style={{ color: "#14532d", fontSize: 22 }}>{t.departments.heading}</p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 auto", display: "inline-flex", flexDirection: "column", gap: 20, textAlign: "left", maxWidth: 560 }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#14532d", display: "inline-block", flexShrink: 0, marginTop: 6 }} />
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#14532d", margin: "0 0 4px" }}>{t.departments.medicalTitle}</p>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{t.departments.medicalDesc}</p>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#14532d", display: "inline-block", flexShrink: 0, marginTop: 6 }} />
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#14532d", margin: "0 0 4px" }}>{t.departments.researchTitle}</p>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{t.departments.researchDesc}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <DeptSliders />
      <PartnerCarousel />
    </div>
  );
}