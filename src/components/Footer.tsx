import { useState, useEffect } from "react";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface FooterProps {
  onNavigate?: (page: string) => void;
  onAdminOpen?: () => void;
}

export function Footer({ onNavigate, onAdminOpen }: FooterProps) {
  const { t } = useLanguage();
  const [logo, setLogo] = useState(() => localStorage.getItem("upmc-logo") || "");
  useEffect(() => {
    const refresh = () => setLogo(localStorage.getItem("upmc-logo") || "");
    window.addEventListener("site-images-updated", refresh);
    return () => window.removeEventListener("site-images-updated", refresh);
  }, []);

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {logo
                ? <img src={logo} alt="UPMC Logo" style={{ height: 68, width: "auto", objectFit: "contain", flexShrink: 0 }} />
                : <div style={{ width: 52, height: 52, background: "#0d9488", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 26, height: 26, background: "#fff", borderRadius: 6 }}></div></div>
              }
              <span className="text-lg font-bold text-white leading-tight">
                Umurinzi Petros<br />Medical Center
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/profile.php?id=61576362847751" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/umurinzi_Petros" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/umurinzi_petros_medical_center/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/umurinzi-petros-medical-center/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick("our-story")} className="text-gray-300 hover:text-teal-400 transition-colors">{t.footer.aboutUs}</button></li>
              <li><button onClick={() => handleNavClick("doctors")} className="text-gray-300 hover:text-teal-400 transition-colors">{t.footer.ourDoctors}</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-teal-400 transition-colors">{t.footer.services}</button></li>
              <li><button onClick={() => handleNavClick("research")} className="text-gray-300 hover:text-teal-400 transition-colors">{t.footer.researchEd}</button></li>
              <li><button onClick={() => handleNavClick("appointment")} className="text-gray-300 hover:text-teal-400 transition-colors">{t.nav.appointment}</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.ourServices}</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-teal-400 transition-colors">Internal Medicine</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-teal-400 transition-colors">Pulmonology</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-teal-400 transition-colors">Pediatrics</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-teal-400 transition-colors">Laboratory</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.contactUs}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Umurinzi+Petros+Medical+Center+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 hover:opacity-80 transition-opacity"
                  title="View on Google Maps"
                >
                  <MapPin className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0 cursor-pointer" />
                  <div className="text-gray-300 hover:text-teal-400 transition-colors">
                    Shyogwe Sector, Muhanga District<br />Southern Province, Rwanda
                  </div>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="https://wa.me/250795161628" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-teal-400 transition-colors">+250 795 161 628</a>
                  <span className="text-gray-300">+250 783 644 479</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a href="mailto:umurinzipetros@gmail.com" className="text-gray-300 hover:text-teal-400 transition-colors">umurinzipetros@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  {t.footer.emergencyHours}<br />
                  {t.footer.generalHours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              {t.footer.rights}
            </div>
            <div className="text-gray-500 text-sm text-center md:text-right relative">
              <button
                onClick={onAdminOpen}
                style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "transparent",
                  border: "none", cursor: "default", padding: 0, flexShrink: 0 }}
                title=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}