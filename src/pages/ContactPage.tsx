import React, { useState, useEffect } from "react";

interface ContactData { address: string; phone: string; email: string; hours: string; emergency: string; }

const DEFAULT_CONTACT: ContactData = {
  address: "Rwanda, Northern Province, Muhanga District, Nyamabuye Sector",
  phone: "+250 795 161 628 | +250 783 644 479",
  email: "umurinzipetros@gmail.com",
  hours: "General Services: Monday to Sunday",
  emergency: "Emergency: 24/7 — call +250 795 161 628 or +250 783 644 479",
};

function loadContact(): ContactData {
  try {
    const stored = localStorage.getItem("upmc-contacts-v2");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_CONTACT;
}

function useContactInfo() {
  const [data, setData] = useState<ContactData>(loadContact);
  useEffect(() => {
    const refresh = () => setData(loadContact());
    window.addEventListener("contacts-updated", refresh);
    return () => window.removeEventListener("contacts-updated", refresh);
  }, []);
  return data;
}

const SERVICES = [
  "Internal Medicine",
  "Pulmonology",
  "Cardiology",
  "Pediatrics",
  "Minor Surgery",
  "Laboratory",
  "Spirometry",
  "Electrocardiogram",
  "Hospitalisation",
  "Chester Step Test",
];

const HOURS_ROWS = [
  { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
  { day: "Saturday",         time: "8:00 AM – 4:00 PM" },
  { day: "Sunday",           time: "8:00 AM – 2:00 PM" },
  { day: "Emergency",        time: "24 / 7", highlight: true },
];

function InfoCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: "22px 20px",
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
      textDecoration: "none",
      color: "inherit",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "#f0fdfa", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0, lineHeight: 1.5, wordBreak: "break-word", overflowWrap: "break-word" }}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>{inner}</a> : <div>{inner}</div>;
}

export function ContactPage() {
  const contact = useContactInfo();
  const waLink = `https://wa.me/250795161628?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="upmc-hero-section" style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            Contact Us
          </h1>
        </div>
      </section>

      {/* ── Info Cards Row ── */}
      <section style={{ padding: "40px 24px 0" }}>
        <div className="upmc-contact-info-cards" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          <InfoCard
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
            label="Our Location"
            value={contact.address}
          />
          <InfoCard
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>}
            label="Phone"
            value={contact.phone}
            href={`tel:${waNumber}`}
          />
          <InfoCard
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
            label="Email"
            value={contact.email}
            href={`mailto:${contact.email}`}
          />
          <InfoCard
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label="Working Hours"
            value={contact.hours}
          />
        </div>
      </section>

      {/* ── Main Two-Column ── */}
      <section className="upmc-contact-main" style={{ padding: "32px 24px 64px" }}>
        <div className="upmc-contact-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Left: Map */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <iframe
              title="UPMC Location"
              src="https://www.google.com/maps?q=Umurinzi+Petros+Medical+Center+Rwanda&t=k&z=16&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{ padding: "14px 20px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488", display: "inline-block" }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151" }}>Nyamabuye Sector, Muhanga District, Rwanda</p>
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

          {/* Right: Hours + WhatsApp + Services */}
          <div className="upmc-contact-info" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* WhatsApp CTA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: "#25d366", borderRadius: 14, padding: "16px 20px",
                color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none",
                boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1ebe5d")}
              onMouseLeave={e => (e.currentTarget.style.background = "#25d366")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>


          </div>
        </div>
      </section>

    </div>
  );
}