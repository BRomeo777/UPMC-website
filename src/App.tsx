import { useState, useEffect } from "react";
import { fetchAndSyncFromCloud, runDiagnostics } from "./lib/cloud";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { StaffPage } from "./pages/StaffPage";
import { DepartmentsPage } from "./pages/DepartmentsPage";
import { ContactPage } from "./pages/ContactPage";
import { ResearchPage } from "./pages/ResearchPage";
import AppointmentPage from "./pages/AppointmentPage";
import { OurStoryPage } from "./pages/OurStoryPage";

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
    const handleNav = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) handleNavigation(detail);
    };
    window.addEventListener("navigate", handleNav);
    return () => window.removeEventListener("navigate", handleNav);
  }, []);

  useEffect(() => {
    const SYNC_EVENTS = ["service-photos-updated","site-images-updated","doctors-updated",
       "researchers-updated","services-updated","contacts-updated",
       "publications-updated","partners-updated","staff-updated",
       "news-ticker-updated","dept-items-updated"];

    const doSync = (initial = false) => {
      fetchAndSyncFromCloud(initial).then(() => {
        SYNC_EVENTS.forEach(ev => window.dispatchEvent(new Event(ev)));
      });
    };

    doSync(true);
    runDiagnostics();

    const interval = setInterval(() => doSync(false), 30000);

    const onFocus = () => doSync(false);
    const onOnline = () => doSync(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
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
        return <OurStoryPage />;
      case "doctors":
        return <DoctorsPage />;
      case "staff":
        return <StaffPage onNavigate={handleNavigation} />;
      case "departments":
        return <DepartmentsPage onNavigate={handleNavigation} />;
      case "contact":
        return <ContactPage />;
      case "research":
        return <ResearchPage />;
      case "our-story":
        return <OurStoryPage />;
      case "appointment":
        return <AppointmentPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Single fixed top block — no gap possible between ticker, info bar and header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200 }}>
        <AnnouncementBar />
        <Header currentPage={currentPage} onNavigate={handleNavigation} />
      </div>
      {/* Spacer: 64px announcement + 88px header */}
      <div className="upmc-spacer" style={{ height: 152 }} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigation} onAdminOpen={() => setShowAdmin(true)} />
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
