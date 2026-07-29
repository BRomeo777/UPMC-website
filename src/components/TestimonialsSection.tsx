import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const patients = [
  {
    name: "Amina Uwase",
    role: "Patient",
    avatar: "AU",
    avatarColor: "#0f766e",
    stars: 5,
    text: "The doctors and nurses at UPMC were incredibly kind and professional. My treatment was swift and I felt cared for every step of the way. I am truly grateful for such an amazing medical team.",
  },
  {
    name: "Jean-Pierre Nkurunziza",
    role: "Patient",
    avatar: "JN",
    avatarColor: "#0d9488",
    stars: 5,
    text: "I came in with a serious condition and left feeling completely recovered. The facilities are modern and clean, and the staff explained everything clearly. UPMC truly changed my life.",
  },
  {
    name: "Marie Claire Ingabire",
    role: "Patient",
    avatar: "MI",
    avatarColor: "#0f766e",
    stars: 5,
    text: "From the reception to the specialist, every single person I met was welcoming and attentive. The care I received here was exceptional. I highly recommend UPMC to everyone.",
  },
];

const doctor = {
  name: "Dr. Emmanuel Habimana",
  role: "Senior Physician, Internal Medicine",
  avatar: "EH",
  stars: 5,
  text: "Working at UPMC is a privilege. Our team is committed to delivering the highest standard of care with compassion and expertise. Every patient who walks through our doors deserves the very best — and that is exactly what we provide.",
};

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} style={{ width: 16, height: 16, fill: "#f59e0b", color: "#f59e0b" }} />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{
            display: "inline-block", background: "rgba(13,148,136,0.1)",
            color: "#0f766e", fontWeight: 700, fontSize: 13,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "6px 18px", borderRadius: 999, marginBottom: 16,
          }}>
            What People Say
          </span>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900,
            color: "#0f172a", margin: "0 0 14px", lineHeight: 1.2,
          }}>
            Stories from Our Community
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
            Real experiences from the patients and professionals who trust UPMC every day.
          </p>
        </motion.div>

        {/* 3 Patient Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          marginBottom: 32,
        }}>
          {patients.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ translateY: -6 }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "32px 28px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: "linear-gradient(90deg, #0f766e, #0d9488)",
                borderRadius: "20px 20px 0 0",
              }} />

              <Quote style={{ width: 28, height: 28, color: "#0d9488", marginBottom: 12, opacity: 0.4 }} />

              <StarRating count={t.stars} />

              <p style={{
                color: "#374151", fontSize: 15, lineHeight: 1.8,
                marginBottom: 24, fontStyle: "italic",
              }}>
                "{t.text}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: t.avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>{t.name}</div>
                  <div style={{ color: "#0d9488", fontSize: 13, fontWeight: 600 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>



      </div>
    </section>
  );
}