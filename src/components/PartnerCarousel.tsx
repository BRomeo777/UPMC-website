import React, { useEffect, useState } from "react";
import { loadPartners } from "./AdminPanel";


interface Partner { name: string; logoUrl: string; url: string; }

const PartnerLogo: React.FC<{ p: Partner; size?: number }> = ({ p, size = 128 }) => {
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* Logo — full image, no crop, no circle */}
      <div className="partner-logo-circle" style={{
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.3s",
      }}>
        <img
          src={p.logoUrl}
          alt={p.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
          className="partner-img"
        />
      </div>
    </div>
  );

  const sharedStyle: React.CSSProperties = { display: "inline-flex", flexDirection: "column",
    alignItems: "center", cursor: p.url ? "pointer" : "default",
    textDecoration: "none" };

  return p.url ? (
    <a href={p.url} target="_blank" rel="noopener noreferrer" style={sharedStyle} className="partner-item">
      {inner}
    </a>
  ) : (
    <div style={sharedStyle} className="partner-item">{inner}</div>
  );
};

export const PartnerCarousel: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>(loadPartners());

  useEffect(() => {
    const handler = () => setPartners(loadPartners());
    window.addEventListener("storage", handler);
    window.addEventListener("partners-updated", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("partners-updated", handler);
    };
  }, []);

  if (!partners.length) return null;

  // Always use marquee — duplicate enough copies so the track is always huge
  // (minimum 20 logos total for a seamless, never-empty scroll)
  const totalCopies = Math.ceil(20 / partners.length) * 2; // *2 for the -50% loop
  const fullTrack: Partner[] = [];
  for (let i = 0; i < totalCopies; i++) fullTrack.push(...partners);

  // Section header (shared)
  const header = (
    <div style={{ textAlign: "center", marginBottom: 56, padding: "0 24px" }}>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 14px",
        letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        Our Trusted Partners
      </h2>
      <div style={{ width: 56, height: 4, borderRadius: 99,
        background: "linear-gradient(90deg,#3b82f6,#06b6d4)", margin: "0 auto" }} />
    </div>
  );

  return (
    <section style={{ position: "relative", padding: "80px 0", overflow: "hidden",
      background: "linear-gradient(180deg,#f9fafb 0%,#fff 100%)" }}>

      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,transparent,#bfdbfe,transparent)" }} />

      {header}

      {/* ── UNIFIED MARQUEE (all cases) ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="marquee-track" style={{ display: "inline-flex", alignItems: "center", width: "max-content" }}>
          {fullTrack.map((p, i) => (
            <div key={i} style={{ padding: "0 40px", flexShrink: 0 }}>
              <PartnerLogo p={p} size={130} />
            </div>
          ))}
        </div>
        {/* Edge fades */}
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: 120,
          background: "linear-gradient(90deg,#f9fafb,transparent)", pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: "0 0 0 auto", width: 120,
          background: "linear-gradient(270deg,#fff,transparent)", pointerEvents: "none", zIndex: 10 }} />
      </div>

      {/* Bottom accent */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,transparent,#e5e7eb,transparent)" }} />

      <style>{`
        /* Hover effects */
        .partner-item:hover .partner-logo-circle {
          border-color: #3b82f6 !important;
          box-shadow: 0 8px 30px rgba(59,130,246,0.25) !important;
          transform: translateY(-6px) scale(1.07) !important;
        }
        .partner-item:hover .partner-glow-ring {
          opacity: 1 !important;
        }
        .partner-item:hover .partner-name {
          color: #2563eb !important;
        }

        /* Marquee animation */
        .marquee-track {
          animation: marqueeScroll 120s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Pulse for badge dot */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
};
