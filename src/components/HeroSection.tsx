import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n/LanguageContext";

const FALLBACK_HERO = "https://images.unsplash.com/photo-1758691462123-8a17ae95d203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9uJTIwbWVkaWNhbCUyMGNhcmV8ZW58MXx8fHwxNzU5MTMxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function HeroSection() {
  const { t } = useLanguage();
  const [heroImg, setHeroImg] = useState(() => localStorage.getItem("upmc-hero-img") || FALLBACK_HERO);
  useEffect(() => {
    const refresh = () => setHeroImg(localStorage.getItem("upmc-hero-img") || FALLBACK_HERO);
    window.addEventListener("site-images-updated", refresh);
    return () => window.removeEventListener("site-images-updated", refresh);
  }, []);
  return (
    <section className="min-h-[70vh] lg:min-h-screen relative" style={{ background: "#fff" }}>
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-teal-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-600 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-10 gap-8 items-center py-12 lg:py-20">
          <div className="lg:col-span-6 space-y-6 relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {t.hero.welcome}
            </h1>
            <p className="text-lg sm:text-xl font-semibold italic" style={{ color: "#0d9488" }}>
              {t.hero.tagline}
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>
          <div className="lg:col-span-4 relative">
            <div className="relative">
              <ImageWithFallback
                src={heroImg}
                alt="Doctor consulting with patient"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="text-center"></div>
                  <div className="w-px h-12 bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}