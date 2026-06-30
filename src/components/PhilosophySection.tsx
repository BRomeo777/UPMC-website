import { useState } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n/LanguageContext";

export function PhilosophySection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Main Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column - Image */}
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwbW9kZXJuJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU5MTY3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern medical equipment and technology"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-600 rounded-full opacity-10 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-xl"></div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {t.philosophy.heading}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {t.philosophy.text}
                </p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {t.philosophy.learnMore}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
          <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">{t.philosophy.modalHeading}</h2>
            <p className="text-gray-700 mb-4">{t.philosophy.modalText}</p>
            <p className="text-gray-700 mb-4">{t.philosophy.modalText2}</p>
            <h3 className="text-xl font-semibold mb-2">{t.philosophy.researchAreas}</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 mb-4">
              <li>Pulmonary Hypertension</li>
              <li>Neglected Tropical Diseases</li>
              <li>Schistosomiasis</li>
              <li>Rare Diseases</li>
              <li>Occupational Lung Diseases</li>
              <li>Interstitial Lung Diseases</li>
              <li>Pleural Diseases</li>
              <li>Obstructive Lung Diseases (COPD, Asthma)</li>
              <li>Rheumatic Heart Diseases</li>
              <li>Oxygenotherapy</li>
              <li>Sepsis</li>
              <li>ARDS</li>
              <li>Sleep Disorders (PSG)</li>
              <li>Community activities promoting unity and fighting Non-Communicable Diseases</li>
              <li>Air Quality</li>
            </ul>
            <p className="text-gray-700 mb-6">{t.philosophy.joinSlogan}</p>
            <Button onClick={() => setOpen(false)} className="bg-red-600 hover:bg-red-700 text-white">
              {t.philosophy.close}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}