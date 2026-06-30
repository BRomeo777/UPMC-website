import { Heart, Eye, Award, Shield } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="pt-16 pb-16 mt-8 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Two columns: Mission + Vision | Values */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Col 1 — Mission & Vision */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{t.about.mission}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{t.about.missionText}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{t.about.vision}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{t.about.visionText}</p>
            </div>
          </div>

          {/* Col 3 — Values */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.about.coreValues}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.about.honesty}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.about.honestyDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.about.accountability}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.about.accountabilityDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.about.dignity}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.about.dignityDesc}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
