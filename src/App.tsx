import { useState, useEffect } from "react";
import { fetchAndSyncFromCloud } from "./lib/cloud";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import AboutPage from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ResearchPage } from "./pages/ResearchPage";

export default function App() {
  return <LanguageProvider><AppInner /></LanguageProvider>;
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    fetchAndSyncFromCloud().then(() => {
      ["service-photos-updated","site-images-updated","doctors-updated",
       "researchers-updated","services-updated","contacts-updated",
       "publications-updated","partners-updated"].forEach(
        ev => window.dispatchEvent(new Event(ev))
      );
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowAdmin(true);
      }
    };
    // Use document + capture phase so we intercept before the browser's view-source shortcut
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "services":
        return <ServicesPage />;
      case "about":
        return <AboutPage />;
      case "doctors":
        return <DoctorsPage />;
      case "contact":
        return <ContactPage />;
      case "research":
        return <ResearchPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigation} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigation} onAdminOpen={() => setShowAdmin(true)} />
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
