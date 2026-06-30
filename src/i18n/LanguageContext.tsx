import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, Translations, TRANSLATIONS } from "./translations";

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: Translations; }

const LanguageContext = createContext<LangCtx>({
  lang: "en", setLang: () => {}, t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("upmc-lang") as Lang | null;
    return stored && TRANSLATIONS[stored] ? stored : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("upmc-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
