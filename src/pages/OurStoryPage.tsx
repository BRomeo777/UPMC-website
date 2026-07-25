import { useLanguage } from "../i18n/LanguageContext";

interface OurStoryPageProps {
  onNavigate?: (page: string) => void;
}

export function OurStoryPage({ onNavigate }: OurStoryPageProps) {
  const { t } = useLanguage();

  const values = [
    {
      title: "Honesty",
      desc: "We uphold the highest standards of integrity in every patient interaction and research endeavor.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
    {
      title: "Accountability",
      desc: "We take responsibility for outcomes and continuously strive for excellence in care delivery.",
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></>,
    },
    {
      title: "Dignity",
      desc: "We treat every patient, partner, and colleague with the respect and compassion they deserve.",
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>,
    },
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @keyframes upmc-story-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes upmc-line-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="upmc-hero-section" style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            Our Story
          </h1>
        </div>
      </section>

      {/* ── Narrative ── */}
      <section className="upmc-story-narrative" style={{ padding: "48px 24px 64px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{
            fontSize: 15,
            color: "#475569",
            lineHeight: 1.75,
            margin: 0,
          }}>
            Umurinzi Petros Medical Center is a community-based healthcare and research center dedicated to transforming health through clinical excellence, innovation, and data-driven care. Guided by our core values of honesty, accountability, and dignity, our mission is to diagnose, treat, prevent disease, and educate communities and healthcare professionals. Since commencing operations in Rwanda in January 2024, UPMC has focused on advancing care for chronic diseases, particularly respiratory diseases, while strengthening medical education and research capacity. We actively collaborate with local and international institutions to implement sustainable clinical, research, and training programs that improve health outcomes. UPMC welcomes partnerships with academic institutions, healthcare organizations, researchers, and philanthropic partners who share our vision of building equitable, evidence-based healthcare systems and expanding access to high-quality respiratory care across Rwanda and the region.
          </p>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="upmc-story-values" style={{ padding: "64px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontSize: "clamp(22px,3vw,30px)",
              fontWeight: 900, color: "#0f172a",
              margin: "0", letterSpacing: "-0.02em",
            }}>Our Core Values</h2>
          </div>
          <div className="upmc-values-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}>
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid #e2e8f0",
                  padding: "36px 28px",
                  textAlign: "center",
                  transition: "all 0.25s ease",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(13,148,136,0.12)"; e.currentTarget.style.borderColor = "#0d9488"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, #0d9488, #0f766e)",
                  margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(13,148,136,0.25)",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {v.icon}
                  </svg>
                </div>
                <h3 style={{
                  fontSize: 17, fontWeight: 800, color: "#0f172a",
                  margin: "0 0 10px", letterSpacing: "-0.01em",
                }}>{v.title}</h3>
                <p style={{
                  fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0,
                }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
