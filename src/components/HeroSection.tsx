import { useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Users, Stethoscope, Shield, HeartPulse, MonitorSmartphone, Heart } from "lucide-react";

const ADOBE_BG = "/assets1/AdobeStock_393940632-2048x1152.jpeg";

/* ── Animated Counter ── */
function AnimatedCounter({ from, to }: { from: number; to: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const [display, setDisplay] = useState(() => Math.round(from).toLocaleString());
  useMotionValueEvent(rounded, "change", (v) => setDisplay(v));
  useEffect(() => {
    const c = animate(count, to, { duration: 3, ease: "easeOut", delay: 1.2 });
    return c.stop;
  }, [count, to]);
  return <span>{display}</span>;
}

const FEATURES = [
  { icon: Shield,           label: "Quality Care",       desc: "Safe, reliable and compassionate care" },
  { icon: Users,            label: "Expert Team",        desc: "Experienced professionals dedicated to your health" },
  { icon: MonitorSmartphone,label: "Modern Facilities",  desc: "State-of-the-art equipment for better diagnosis" },
  { icon: Heart,            label: "Community Focus",    desc: "Committed to improving the health of our community" },
];

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero-section" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Background Image ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${ADOBE_BG})`,
          backgroundSize: "cover", backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* ── Dark-to-transparent overlay (left heavy) ── */}
      <div className="hero-overlay" style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to right, rgba(10,30,40,0.92) 0%, rgba(10,30,40,0.70) 45%, rgba(10,30,40,0.15) 100%)",
      }} />

      {/* ── Main flex: hero content grows, feature bar at bottom ── */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", flex: 1 }}>

        {/* ── Content Row ── */}
        <div className="hero-content-row" style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 60px 60px",
          gap: 40,
        }}>

          {/* LEFT: Text */}
          <div className="hero-text-block" style={{ maxWidth: 520, flex: "0 0 auto" }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                display: "inline-block",
                color: "#0d9488", fontWeight: 700, fontSize: 13,
                letterSpacing: "0.15em", textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Excellence in Healthcare
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ margin: "0 0 12px", lineHeight: 1.15, fontWeight: 900, fontSize: "clamp(32px, 4.5vw, 58px)" }}
            >
              <span style={{ color: "#fff", display: "block" }}>WELCOME TO</span>
              <span style={{ color: "#0d9488", display: "block" }}>UMURINZI PETROS</span>
              <span style={{ color: "#fff", display: "block" }}>MEDICAL CENTER</span>
            </motion.h1>

            {/* Teal underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ width: 60, height: 3, background: "#0d9488", borderRadius: 99, marginBottom: 24, transformOrigin: "left" }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}
            >
              {t.hero.tagline && <><strong style={{ color: "#fff" }}>{t.hero.tagline}</strong><br /></>}
              {t.hero.subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("navigate", { detail: "services" }));
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#0d9488", color: "#fff",
                  fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 8,
                  textDecoration: "none", transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
              >
                Explore Our Services <ArrowRight size={18} />
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("navigate", { detail: "about" }));
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "#fff",
                  fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 8,
                  textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.6)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0f172a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
              >
                About Us
              </a>
            </motion.div>
          </div>

        </div>



      </div>
    </section>
  );
}

{/* ── Responsive overrides for mobile ── */}
const heroResponsiveStyle = document.createElement("style");
heroResponsiveStyle.textContent = `
  @media (max-width: 768px) {
    .hero-overlay {
      background: linear-gradient(to bottom, rgba(10,30,40,0.88) 0%, rgba(10,30,40,0.82) 50%, rgba(10,30,40,0.75) 100%) !important;
    }
    .hero-content-row {
      padding: 100px 20px 40px !important;
      flex-direction: column !important;
      justify-content: center !important;
      gap: 24px !important;
    }
    .hero-text-block {
      maxWidth: 100% !important;
      width: 100% !important;
    }
  }
  @media (max-width: 480px) {
    .hero-content-row {
      padding: 90px 16px 30px !important;
    }
  }
`;
if (!document.getElementById("hero-responsive-style")) {
  heroResponsiveStyle.id = "hero-responsive-style";
  document.head.appendChild(heroResponsiveStyle);
}