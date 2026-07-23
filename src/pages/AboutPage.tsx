import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

const AboutPage = ({ onNavigate }: AboutPageProps) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const subItems = [
    { label: "Our Departments", key: "departments" },
    { label: "Staff", key: "staff" },
    { label: "Doctors", key: "doctors" },
    { label: "Our Story", key: "our-story" },
  ];

  const handleNavigate = (key: string) => {
    if (onNavigate) onNavigate(key);
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{`
        .upmc-chevron {
          width: 30px;
          height: 30px;
          border-right: 6px solid #0d9488;
          border-bottom: 6px solid #0d9488;
          transform: rotate(45deg);
          transition: transform 0.35s ease;
          display: inline-block;
        }
        .upmc-chevron.upmc-open {
          transform: rotate(225deg);
        }
        .upmc-chevron-wrap:hover .upmc-chevron {
          border-color: #2dd4bf;
        }
        @keyframes upmc-fade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── About Us heading + chevron arrow ── */}
      <div style={{ textAlign: "center", padding: "60px 24px 40px" }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0f172a", margin: "0 0 40px" }}>
          {t.nav.about}
        </h1>

        {/* The arrow — click to reveal subheadings */}
        <button
          className="upmc-chevron-wrap"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 20,
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span className={`upmc-chevron ${expanded ? "upmc-open" : ""}`} />
        </button>
      </div>

      {/* ── Subheadings revealed on click ── */}
      {expanded && (
        <div style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "0 24px 80px",
          animation: "upmc-fade 0.3s ease",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            {subItems.map((item) => (
              <div
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  padding: "24px 28px",
                  textAlign: "center",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.background = "#f0fdfa"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(13,148,136,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;