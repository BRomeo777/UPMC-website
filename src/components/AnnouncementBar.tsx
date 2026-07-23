import { useState, useEffect } from "react";
import { Phone, Mail } from "lucide-react";

const DEFAULT_NEWS = [
  "Welcome to Umurinzi Petros Medical Center: Compassionate Care, Excellence in Medicine",
  "Consultations available Monday to Sunday: Emergency services 24/7",
  "Our Research & Education Department offers CPD Training for healthcare professionals",
  "Cardiology, Pulmonology, Pediatrics & Internal Medicine services now available",
  "New research collaborations underway: advancing evidence-based medicine in Rwanda",
];

function loadNews(): string[] {
  try {
    const stored = localStorage.getItem("upmc-news-ticker");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_NEWS;
}

function loadContact() {
  try {
    const stored = localStorage.getItem("upmc-contacts-v2");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { phone: "+250 795 161 628 | +250 783 644 479", email: "umurinzipetros@gmail.com", hours: "Mon–Sun: 8AM – 6PM | Emergency: 24/7" };
}

export function AnnouncementBar() {
  const [news, setNews] = useState<string[]>(loadNews);
  const [contact, setContact] = useState(loadContact);

  useEffect(() => {
    const refreshNews = () => setNews(loadNews());
    const refreshContact = () => setContact(loadContact());
    window.addEventListener("news-ticker-updated", refreshNews);
    window.addEventListener("contacts-updated", refreshContact);
    return () => {
      window.removeEventListener("news-ticker-updated", refreshNews);
      window.removeEventListener("contacts-updated", refreshContact);
    };
  }, []);

  const track = [...news, ...news];

  return (
    <div>
      <style>{`
        @keyframes upmc-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .upmc-ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: upmc-ticker 50s linear infinite;
        }
        .upmc-ticker-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Row 1: Scrolling news ── */}
      <div style={{
        background: "#0f172a",
        height: 36,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="upmc-ticker-track">
            {track.map((item, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", letterSpacing: "0.01em" }}>
                <span style={{ color: "#0d9488", margin: "0 12px 0 32px", fontSize: 11 }}>✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Contact info bar ── */}
      <div style={{
        background: "#0d9488",
        padding: "5px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 28,
        flexWrap: "wrap",
      }}>
        <a
          href="https://wa.me/250795161628"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.01em", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Phone size={13} />
          {contact.phone}
        </a>
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=Inquiry%20to%20Umurinzi%20Petros%20Medical%20Center`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.01em", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Mail size={13} />
          {contact.email}
        </a>
      </div>
    </div>
  );
}
