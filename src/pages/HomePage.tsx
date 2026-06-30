import { HeroSection } from "../components/HeroSection";
import { DeptSliders } from "../components/DeptSliders";
import { PartnerCarousel } from "../components/PartnerCarousel";
import { useLanguage } from "../i18n/LanguageContext";

export function HomePage() {
  const { t } = useLanguage();
  return (
    <div>
      <HeroSection />

      {/* ── Satellite Map ── */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "48px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Find Us on the Map</h2>
            <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>
              {t.contact.satelliteDesc}
            </p>
          </div>
          <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", background: "#fff" }}>
            <iframe
              src="https://www.google.com/maps?q=Umurinzi+Petros+Medical+Center+Rwanda&t=k&z=16&output=embed"
              style={{ width: "100%", height: 280, border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="UPMC Satellite Location"
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Umurinzi+Petros+Medical+Center+Rwanda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#14532d", color: "#fff", fontWeight: 700, fontSize: 13,
                padding: "10px 22px", borderRadius: 10, textDecoration: "none",
                boxShadow: "0 3px 12px rgba(20,83,45,0.25)",
              }}
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

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