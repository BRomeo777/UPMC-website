import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface DocEntry { id: string; name: string; specialty: string; clinicalSpec: string; research: string; }

const DEFAULT_DOCTORS: DocEntry[] = [
  { id: "sibomana",   name: "Dr. SIBOMANA JEAN PIERRE", specialty: "Pulmonologist & Critical Care", clinicalSpec: "Dr. Jean Pierre Sibomana is a Senior Consultant Internist, Pulmonologist, and Critical Care Specialist with expertise in diagnosing and managing complex medical, respiratory, and critically ill patients. He is dedicated to delivering evidence-based, patient-centered care across a wide range of acute and chronic conditions.", research: "Dr. Sibomana is actively involved in clinical research focusing on respiratory medicine, critical care, infectious diseases, lung cancer, and health systems strengthening. His work aims to improve patient outcomes through innovation, collaboration, and evidence-based practice." },
  { id: "niyonshuti", name: "Dr. NIYONSHUTI THEOPIST",  specialty: "General Practitioner",          clinicalSpec: "Dr. Theopist Niyonshuti is a General Practitioner committed to delivering comprehensive primary healthcare to patients of all ages. He focuses on the prevention, early diagnosis, and management of a wide range of acute and chronic conditions, ensuring every patient receives attentive and personalised care.", research: "" },
  { id: "uwamaliya",  name: "Dr. UWAMALIYA MODETSE",   specialty: "Pediatrician",                  clinicalSpec: "Dr. Modeste Uwamaliya is a certified Pediatrician dedicated to providing comprehensive healthcare for infants, children, and adolescents. He specializes in the prevention, diagnosis, and management of childhood illnesses while promoting healthy growth and development through compassionate, family-centered care.", research: "" },
];

const FALLBACK_PHOTOS: Record<string, string> = {
  sibomana:   "https://images.unsplash.com/photo-1734002886107-168181bcd6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwbWVkaWNhbCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTkxMjMzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  niyonshuti: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtYWxlJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU5MTI2NTUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  uwamaliya:  "https://images.unsplash.com/photo-1758691461516-7e716e0ca135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMG1lZGljYWx8ZW58MXx8fHwxNzU5MTI2NTUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
};

function loadDoctors(): DocEntry[] {
  try {
    const stored = localStorage.getItem("upmc-doctors-v2");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_DOCTORS;
}

function useDoctors() {
  const [doctors, setDoctors] = useState<DocEntry[]>(loadDoctors);
  useEffect(() => {
    const refresh = () => setDoctors(loadDoctors());
    window.addEventListener("doctors-updated", refresh);
    return () => window.removeEventListener("doctors-updated", refresh);
  }, []);
  return doctors;
}

function getDoctorPhoto(id: string): string {
  return localStorage.getItem(`upmc-service-img-doctor-${id}`)
    || localStorage.getItem(`upmc-doctor-photo-${id}`)
    || FALLBACK_PHOTOS[id]
    || "";
}

export function DoctorsPage() {
  const { t } = useLanguage();
  const doctors = useDoctors();
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ background: "#fff", padding: "20px 24px 8px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            {t.doctors.heading}
          </h1>
        </div>
      </section>

      {/* Doctors List — vertical, one per row */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1020, marginLeft: 40, display: "flex", flexDirection: "column", gap: 32 }}>
          {doctors.map((doctor, index) => {
            const photo = getDoctorPhoto(doctor.id);
            return (
              <div
                key={doctor.id || index}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ padding: "32px 36px" }}>
                  {/* Photo — floats left, text wraps around it */}
                  <div style={{
                    float: "left",
                    width: 180,
                    minWidth: 180,
                    marginRight: 32,
                    marginBottom: 16,
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    background: "#f8fafc",
                    borderRadius: 12,
                  }}>
                    <img
                      src={photo}
                      alt={doctor.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", borderRadius: 12 }}
                    />
                  </div>

                  {/* Name + specialty — beside photo */}
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                    {doctor.name}
                  </h3>
                  {doctor.specialty && (
                    <p style={{ fontSize: 13, color: "#0d9488", fontWeight: 700, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {doctor.specialty}
                    </p>
                  )}

                  {/* Biography — combines clinical spec + research, wraps around photo */}
                  {(doctor.clinicalSpec || doctor.research) && (
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: 14.5, color: "#4b5563", lineHeight: 1.85, margin: 0, textAlign: "justify", whiteSpace: "pre-wrap" }}>
                        {[doctor.clinicalSpec, doctor.research].filter(Boolean).join(" ")}
                      </p>
                    </div>
                  )}

                  {/* Clear float */}
                  <div style={{ clear: "both" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}