import { HeroSection } from "../components/HeroSection";
import { DeptSliders } from "../components/DeptSliders";
import { PartnerCarousel } from "../components/PartnerCarousel";

export function HomePage() {
  return (
    <div style={{ background: "#f8fafc" }}>
      <HeroSection />

      {/* Satellite Map */}
      <section style={{ background: "#fff", padding: "48px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>Find Us on the Map</h2>
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
                background: "#0d9488", color: "#fff", fontWeight: 700, fontSize: 13,
                padding: "10px 22px", borderRadius: 10, textDecoration: "none",
                boxShadow: "0 3px 12px rgba(13,148,136,0.30)",
              }}
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      <DeptSliders />
      <PartnerCarousel />
    </div>
  );
}