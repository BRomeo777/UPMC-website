import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { Lang, LANG_FLAGS, LANG_LABELS } from "../i18n/translations";

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const aboutSubItems = [
  { name: "Our Departments", key: "departments" },
  { name: "Staff", key: "staff" },
  { name: "Doctors", key: "doctors" },
  { name: "Our Story", key: "our-story" },
];

export function Header({ currentPage = "home", onNavigate }: HeaderProps) {
  const { t, lang, setLang } = useLanguage();
  const [logo, setLogo] = useState(() => localStorage.getItem("upmc-logo") || "/upmc-logo.png");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutTriggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const CLOSE_DELAY = 120;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setAboutOpen(false), CLOSE_DELAY);
  }, [clearCloseTimer]);

  useEffect(() => {
    const refresh = () => setLogo(localStorage.getItem("upmc-logo") || "/upmc-logo.png");
    window.addEventListener("site-images-updated", refresh);
    return () => window.removeEventListener("site-images-updated", refresh);
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) return;
    if (logo) {
      link.href = logo;
    } else {
      link.href = "/upmc-logo.png";
    }
  }, [logo]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aboutOpen) {
        setAboutOpen(false);
        aboutTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [aboutOpen]);

  useEffect(() => { return () => clearCloseTimer(); }, [clearCloseTimer]);

  const handleNavClick = (page: string) => {
    if (onNavigate) { onNavigate(page); setMobileOpen(false); setAboutOpen(false); setMobileAboutOpen(false); }
  };

  const toggleAbout = () => { clearCloseTimer(); setAboutOpen(o => !o); };
  const handleAboutMouseEnter = () => { if (isTouchDevice) return; clearCloseTimer(); setAboutOpen(true); };
  const handleAboutMouseLeave = () => { if (isTouchDevice) return; scheduleClose(); };
  const handleAboutKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleAbout(); }
  };

  const navItems = [
    { name: t.nav.home, key: "home" },
    { name: t.nav.services, key: "services" },
    { name: t.nav.research, key: "research" },
    { name: t.nav.contact, key: "contact" },
    { name: t.nav.appointment, key: "appointment" },
  ];

  const LANGS: Lang[] = ["en", "rw", "fr", "sw"];

  return (
    <header className="bg-white border-b border-gray-100 w-full" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: 88 }}>

          {/* Logo */}
          <button onClick={() => handleNavClick("home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            {logo
              ? <img src={logo} alt="UPMC Logo" style={{ height: 68, width: "auto", objectFit: "contain" }} />
              : <div style={{ width: 52, height: 52, background: "#0d9488", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 26, height: 26, background: "#fff", borderRadius: 6 }} /></div>
            }
            <span className="text-sm font-bold leading-tight hidden sm:block" style={{ color: "#0d9488" }}>
              Umurinzi Petros<br />Medical Center
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Home */}
            <button onClick={() => handleNavClick("home")}
              className={`text-sm transition-colors ${currentPage === "home" ? "text-teal-600 font-semibold" : "text-gray-700 hover:text-teal-600"}`}>
              {t.nav.home}
            </button>

            {/* About Us — dropdown (not a link, no navigation) */}
            <div
              ref={aboutRef}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                ref={aboutTriggerRef}
                onClick={toggleAbout}
                onKeyDown={handleAboutKeyDown}
                aria-haspopup="true"
                aria-expanded={aboutOpen}
                aria-controls="about-submenu"
                className={`text-sm transition-colors flex items-center gap-1 ${currentPage === "departments" || currentPage === "staff" || currentPage === "doctors" || currentPage === "our-story" ? "text-teal-600 font-semibold" : "text-gray-700 hover:text-teal-600"}`}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {t.nav.about}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: aboutOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.18s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Submenu — conditionally rendered (not opacity:0) */}
              {aboutOpen && (
                <ul
                  id="about-submenu"
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
                    minWidth: 190,
                    padding: "6px",
                    zIndex: 200,
                    listStyle: "none",
                    margin: 0,
                  }}
                >
                  {aboutSubItems.map((sub) => (
                    <li key={sub.key} role="none">
                      <a
                        href="#"
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavClick(sub.key); }}
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          borderRadius: 8,
                          textDecoration: "none",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#f0fdfa"; e.currentTarget.style.color = "#0d9488"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
                      >
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rest of nav items */}
            {navItems.filter(i => i.key !== "home").map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)}
                className={`text-sm transition-colors ${currentPage === item.key ? "text-teal-600 font-semibold" : "text-gray-700 hover:text-teal-600"}`}>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side: phone + lang switcher + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-teal-600">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">+250 795 161 628 | +250 783 644 479</span>
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
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: lang === l ? "#f0fdfa" : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: lang === l ? 700 : 500, color: lang === l ? "#0d9488" : "#374151", textAlign: "left" }}>
                      <span style={{ fontSize: 18 }}>{LANG_FLAGS[l]}</span>
                      {LANG_LABELS[l]}
                      {lang === l && <span style={{ marginLeft: "auto", color: "#0d9488", fontSize: 14 }}>✓</span>}
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
            <button onClick={() => handleNavClick("home")}
              className={`block w-full text-left px-2 py-2.5 text-sm rounded-lg transition-colors ${currentPage === "home" ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"}`}>
              {t.nav.home}
            </button>

            {/* About Us — accordion in mobile */}
            <div>
              <button
                onClick={() => setMobileAboutOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={mobileAboutOpen}
                aria-controls="mobile-about-submenu"
                className={`block w-full text-left px-2 py-2.5 text-sm rounded-lg transition-colors ${currentPage === "departments" || currentPage === "staff" || currentPage === "doctors" || currentPage === "our-story" ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"}`}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span>{t.nav.about}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginLeft: 4,
                    transform: mobileAboutOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {mobileAboutOpen && (
                <ul id="mobile-about-submenu" role="menu" style={{ listStyle: "none", padding: 0, margin: "4px 0 0", paddingLeft: 16 }}>
                  {aboutSubItems.map(sub => (
                    <li key={sub.key} role="none">
                      <a
                        href="#"
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavClick(sub.key); }}
                        className="block px-3 py-2 text-xs rounded-lg text-gray-600 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                        style={{ textDecoration: "none" }}
                      >
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {navItems.filter(i => i.key !== "home").map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)}
                className={`block w-full text-left px-2 py-2.5 text-sm rounded-lg transition-colors ${currentPage === item.key ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"}`}>
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}