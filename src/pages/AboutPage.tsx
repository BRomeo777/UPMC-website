import { Heart, Eye, Award, Shield, Users, Microscope, Stethoscope, MapPin, Clock, Phone, Star, CheckCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#14532d 0%,#166534 60%,#15803d 100%)", padding: "80px 24px 64px", textAlign: "center" }}>
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

      {/* ── Who We Are ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.15em" }}>Who We Are</span>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: "10px 0 18px", lineHeight: 1.2 }}>
              A Centre of Medical Excellence in Rwanda
            </h2>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
              Umurinzi Petros Medical Center is a specialised medical institution located in Rwanda, dedicated to providing high-quality, evidence-based healthcare to patients of all ages. We combine clinical expertise with compassionate care to deliver outcomes that matter.
            </p>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 15 }}>
              Our centre brings together specialist physicians in internal medicine, pulmonology, cardiology, and paediatrics — supported by a dedicated research and CPD training programme that keeps our clinical teams at the forefront of medical knowledge.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: <Stethoscope style={{ width: 22, height: 22, color: "#059669" }} />, label: "General Consultation", bg: "#f0fdf4", border: "#bbf7d0" },
              { icon: <Heart style={{ width: 22, height: 22, color: "#e11d48" }} />, label: "Cardiology", bg: "#fff1f2", border: "#fecdd3" },
              { icon: <Microscope style={{ width: 22, height: 22, color: "#2563eb" }} />, label: "Research & CPD", bg: "#eff6ff", border: "#bfdbfe" },
              { icon: <Users style={{ width: 22, height: 22, color: "#7c3aed" }} />, label: "Paediatrics", bg: "#f5f3ff", border: "#ddd6fe" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 14, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.15em" }}>Our Purpose</span>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: "10px 0 0" }}>Mission & Vision</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart style={{ width: 22, height: 22, color: "#e11d48" }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>{t.about.mission}</h3>
              </div>
              <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{t.about.missionText}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Eye style={{ width: 22, height: 22, color: "#059669" }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>{t.about.vision}</h3>
              </div>
              <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{t.about.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.15em" }}>{t.about.coreValues}</span>
          <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: "10px 0 0" }}>What We Stand For</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {[
            { icon: <Shield style={{ width: 24, height: 24, color: "#2563eb" }} />, bg: "#eff6ff", border: "#bfdbfe", title: t.about.honesty, desc: t.about.honestyDesc },
            { icon: <Award style={{ width: 24, height: 24, color: "#059669" }} />, bg: "#f0fdf4", border: "#bbf7d0", title: t.about.accountability, desc: t.about.accountabilityDesc },
            { icon: <Heart style={{ width: 24, height: 24, color: "#e11d48" }} />, bg: "#fff1f2", border: "#fecdd3", title: t.about.dignity, desc: t.about.dignityDesc },
            { icon: <Star style={{ width: 24, height: 24, color: "#d97706" }} />, bg: "#fffbeb", border: "#fde68a", title: "Excellence", desc: "Delivering the highest standard of clinical care in every interaction, every day." },
          ].map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "28px 22px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: v.bg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {v.icon}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>{v.title}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ background: "#f0fdf4", borderTop: "1px solid #bbf7d0", borderBottom: "1px solid #bbf7d0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.15em" }}>Why Us</span>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: "10px 0 0" }}>Why Choose Umurinzi Petros</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {[
              "Specialist physicians in Internal Medicine, Cardiology and Paediatrics",
              "Advanced diagnostic tools including ECG, Echocardiography and Spirometry",
              "Minimally invasive endoscopic procedures for both adults and children",
              "Accredited CPD training programmes for healthcare professionals",
              "Evidence-based clinical protocols aligned with international standards",
              "Compassionate, patient-centred care at every stage of treatment",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#fff", borderRadius: 14, border: "1px solid #bbf7d0", padding: "18px 20px" }}>
                <CheckCircle style={{ width: 18, height: 18, color: "#059669", flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location & Hours ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.15em" }}>Find Us</span>
          <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: "#0f172a", margin: "10px 0 0" }}>Location & Hours</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {[
            { icon: <MapPin style={{ width: 22, height: 22, color: "#059669" }} />, title: "Address", lines: ["Umurinzi Petros Medical Center", "Rwanda"] },
            { icon: <Clock style={{ width: 22, height: 22, color: "#2563eb" }} />, title: "Hours", lines: ["General: Monday – Sunday", "Emergency: 24 / 7"] },
            { icon: <Phone style={{ width: 22, height: 22, color: "#e11d48" }} />, title: "Contact", lines: ["Call us for appointments", "Emergency line available"] },
          ].map((card, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "28px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {card.icon}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>{card.title}</h4>
              {card.lines.map((l, j) => (
                <p key={j} style={{ fontSize: 14, color: "#6b7280", margin: "0 0 4px", lineHeight: 1.6 }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutPage;