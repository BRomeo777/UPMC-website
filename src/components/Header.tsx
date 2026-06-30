import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { Lang, LANG_FLAGS, LANG_LABELS } from "../i18n/translations";

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Header({ currentPage = "home", onNavigate }: HeaderProps) {
  const { t, lang, setLang } = useLanguage();
  const [logo, setLogo] = useState(() => localStorage.getItem("upmc-logo") || "");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setLogo(localStorage.getItem("upmc-logo") || "");
    window.addEventListener("site-images-updated", refresh);
    return () => window.removeEventListener("site-images-updated", refresh);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavClick = (page: string) => {
    if (onNavigate) { onNavigate(page); setMobileOpen(false); }
  };

  const navItems = [
    { name: t.nav.home, key: "home" },
    { name: t.nav.services, key: "services" },
    { name: t.nav.research, key: "research" },
    { name: t.nav.doctors, key: "doctors" },
    { name: t.nav.contact, key: "contact" },
  ];

  const LANGS: Lang[] = ["en", "rw", "fr", "sw"];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: 88 }}>

          {/* Logo */}
          <button onClick={() => handleNavClick("home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            {logo
              ? <img src={logo} alt="UPMC Logo" style={{ height: 68, width: "auto", objectFit: "contain" }} />
              : <div style={{ width: 52, height: 52, background: "#059669", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 26, height: 26, background: "#fff", borderRadius: 6 }} /></div>
            }
            <span className="text-sm font-bold leading-tight hidden sm:block" style={{ color: "#059669" }}>
              Umurinzi Petros<br />Medical Center
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)}
                className={`text-sm transition-colors ${currentPage === item.key ? "text-emerald-600 font-semibold" : "text-gray-700 hover:text-emerald-600"}`}>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side: phone + lang switcher + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-600">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">+250 795 161 628</span>
            </div>

            {/* Language Switcher */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button onClick={() => setLangOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                <span style={{ fontSize: 16 }}>{LANG_FLAGS[lang]}</span>
                <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
                <ChevronDown style={{ width: 12, height: 12, color: "#64748b" }} />
              </button>
              {langOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 160, zIndex: 100, overflow: "hidden" }}>
                  {LANGS.map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: lang === l ? "#f0fdf4" : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: lang === l ? 700 : 500, color: lang === l ? "#166534" : "#374151", textAlign: "left" }}>
                      <span style={{ fontSize: 18 }}>{LANG_FLAGS[l]}</span>
                      {LANG_LABELS[l]}
                      {lang === l && <span style={{ marginLeft: "auto", color: "#166534", fontSize: 14 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileOpen(o => !o)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)}
                className={`block w-full text-left px-2 py-2.5 text-sm rounded-lg transition-colors ${currentPage === item.key ? "text-emerald-600 font-semibold bg-emerald-50" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"}`}>
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}