import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
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
                : <div style={{ width: 52, height: 52, background: "#059669", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 26, height: 26, background: "#fff", borderRadius: 6 }}></div></div>
              }
              <span className="text-lg font-bold text-white leading-tight">
                Umurinzi Petros<br />Medical Center
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/profile.php?id=61576362847751" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/UmurinziPetros" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/umurinzipetrosmedicalcenter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/umurinzi-petros-medical-center" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick("about")} className="text-gray-300 hover:text-emerald-400 transition-colors">{t.footer.aboutUs}</button></li>
              <li><button onClick={() => handleNavClick("doctors")} className="text-gray-300 hover:text-emerald-400 transition-colors">{t.footer.ourDoctors}</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-emerald-400 transition-colors">{t.footer.services}</button></li>
              <li><button onClick={() => handleNavClick("research")} className="text-gray-300 hover:text-emerald-400 transition-colors">{t.footer.researchEd}</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.ourServices}</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-emerald-400 transition-colors">Internal Medicine</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-emerald-400 transition-colors">Pulmonology</button></li>
              <li><button onClick={() => handleNavClick("services")} className="text-gray-300 hover:text-emerald-400 transition-colors">Pediatrics</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6">{t.footer.contactUs}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                
                
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-gray-300">+250 795 161 628</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-gray-300">umurinzipetros@gmail.com</div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
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
            <div className="flex items-center space-x-6 text-sm">
              {/* Hidden admin trigger — tiny invisible dot */}
              <button
                onClick={onAdminOpen}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "transparent",
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