import { HeroSection } from "../components/HeroSection";
import { ServicesBlock } from "../components/ServicesBlock";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { LocationSection } from "../components/LocationSection";
import { PartnerCarousel } from "../components/PartnerCarousel";

export function HomePage() {
  return (
    <div style={{ background: "#f8fafc" }}>
      <HeroSection />

      <ServicesBlock />

      {/* Satellite Map Card */}
      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "inline-block", background: "#f0fdfa", color: "#0d9488", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", padding: "6px 16px", borderRadius: 9999, marginBottom: 12 }}>
              FIND US
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>Our Location</h2>
            <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>Shyogwe Sector, Muhanga District, Rwanda</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <iframe
              title="UPMC Location Map"
              src="https://www.google.com/maps?q=Umurinzi+Petros+Medical+Center+Rwanda&t=k&z=16&output=embed"
              width="100%"
              height="280"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{ padding: "12px 18px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488", display: "inline-block" }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151" }}>Umurinzi Petros Medical Center</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Umurinzi+Petros+Medical+Center+Rwanda"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, fontWeight: 800, color: "#0d9488", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      
      <LocationSection />

      <PartnerCarousel />
    </div>
  );
}