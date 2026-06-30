import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
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
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.doctors.heading}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.doctors.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => {
              const photo = getDoctorPhoto(doctor.id);
              return (
                <Card key={doctor.id || index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <ImageWithFallback src={photo} alt={doctor.name} className="w-full h-64 object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                      {doctor.specialty && <p className="text-sm text-emerald-600 font-medium">{doctor.specialty}</p>}
                    </div>
                    {doctor.clinicalSpec && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wide">{t.doctors.clinicalSpec}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{doctor.clinicalSpec}</p>
                        </div>
                        {doctor.research && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wide">{t.doctors.research}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{doctor.research}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}