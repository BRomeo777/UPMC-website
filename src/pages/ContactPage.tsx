import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Card, CardContent } from "../components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Ambulance,
  Car,
  Bus,
  Navigation
} from "lucide-react";

interface ContactData { address: string; phone: string; email: string; hours: string; emergency: string; }

const DEFAULT_CONTACT: ContactData = {
  address: "Rwanda, Northern Province, Muhanga District, Nyamabuye Sector",
  phone: "+250 795 161 628",
  email: "umurinzipetros@gmail.com",
  hours: "General Services: Monday to Sunday",
  emergency: "Emergency: 24/7 — call +250 795 161 628",
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

const departments = [
  "internal Medicine",
  "Internal Medecine",
  "Pulmonology",
   "Pediatrics",
  " Minor surgery",
  "Laboratory",
  "Spirometry",
  "Electrocardiogram",
  "Hospitalisation",
  "Chester step test with certificate",
];

const transportationOptions = [
  {
    icon: Car,
    title: "Driving",
    description: "Free parking available in our main parking garage. Valet parking available for patients."
  },
  {
    icon: Bus,
    title: "Public Transit",
    description: "Metro bus lines 12, 34, and 56 stop directly in front of the hospital."
  },
  
];

export function ContactPage() {
  const { t } = useLanguage();
  const contact = useContactInfo();

  const contactCards = [
    { icon: MapPin,  title: t.contact.address, details: contact.address.split(",").map(s => s.trim()).filter(Boolean) },
    { icon: Phone,   title: t.contact.phone,   details: contact.phone.split(",").map(s => s.trim()).filter(Boolean) },
    { icon: Mail,    title: t.contact.email,   details: [contact.email] },
    { icon: Clock,   title: t.contact.hours,   details: [contact.hours] },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.contact.heading}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactCards.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-6">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-16">
            <div className="flex items-center justify-center space-x-4 text-center">
              <Ambulance className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  {t.contact.emergencyTitle}
                </h3>
                <p className="text-red-700">{contact.emergency}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t.contact.findUs}</h2>
            <p className="text-gray-500 text-sm">{t.contact.findUsSubtitle}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              title="UPMC Muhanga Location"
              src="https://maps.google.com/maps?q=-2.0810278,29.7680833&z=16&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">UPMC — Nyamabuye Sector, Muhanga District</p>
              <a
                href="https://www.google.com/maps/place/2%C2%B004'51.7%22S+29%C2%B046'05.1%22E/@-2.0810278,29.7680833,870m"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Navigation className="w-4 h-4" />
                {t.contact.getDirections}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}