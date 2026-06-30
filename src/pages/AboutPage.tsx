import { useLanguage } from "../i18n/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ── */}
      <div style={{ background: "#14532d", padding: "80px 24px 64px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#d1fae5", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 18px", borderRadius: 99, marginBottom: 20 }}>
          {t.nav.about}
        </span>
        <h1 style={{ color: "#fff", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Umurinzi Petros Medical Center
        </h1>
        <p style={{ color: "#86efac", fontSize: "clamp(14px,2vw,18px)", maxWidth: 620, margin: "0 auto", lineHeight: 1.7, fontWeight: 400 }}>
          {t.hero.subtitle}
        </p>
      </div>

      {/* ── Executive Summary ── */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 40, background: "#14532d", borderRadius: 99 }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.18em" }}>{t.about.execSummary}</span>
          </div>
          <p style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.85, margin: "0 0 18px", fontWeight: 400 }}>
            {t.about.execP1}
          </p>
          <p style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.85, margin: "0 0 18px", fontWeight: 400 }}>
            {t.about.execP2}
          </p>
          <p style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>
            {t.about.execP3}
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>{t.about.missionVision}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>{t.about.mission}</h3>
              <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{t.about.missionText}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>{t.about.vision}</h3>
              <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{t.about.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>{t.about.ourValues}</h2>
          </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {[
            { title: t.about.honesty, desc: t.about.honestyDesc },
            { title: t.about.accountability, desc: t.about.accountabilityDesc },
            { title: t.about.dignity, desc: t.about.dignityDesc },
            { title: t.about.excellence, desc: t.about.excellenceDesc },
          ].map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "28px 22px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>{v.title}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutPage;