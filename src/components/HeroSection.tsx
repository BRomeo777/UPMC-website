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
    <section className="min-h-[70vh] lg:min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-10 gap-8 items-center py-12 lg:py-20">
          {/* Left Column - Text Content (60-70%) */}
          <div className="lg:col-span-6 space-y-8 relative z-10">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {t.hero.welcome}{" "}
              <span className="text-emerald-600">{t.hero.tagline}</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>
            
            {/* CTA Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3"
              >
                Our Services
              </Button>
            </div> */}
          </div>

          {/* Right Column - Visual Content (30-40%) */}
          <div className="lg:col-span-4 relative">
            <div className="relative">
              <ImageWithFallback
                src={heroImg}
                alt="Doctor consulting with patient"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    {/* <div className="text-2xl font-bold text-emerald-600">25+</div>
                    <div className="text-sm text-gray-600">Years Experience</div> */}
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  {/* <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50k+</div>
                    <div className="text-sm text-gray-600">Happy Patients</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}