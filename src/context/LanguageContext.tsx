'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['ru'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem('repurposeflow_lang') as Language | null;
      if (savedLang === 'ru' || savedLang === 'en') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
        return;
      }

      // Auto-detect browser language
      const browserLang = navigator.language || (navigator as any).userLanguage || '';
      const lower = browserLang.toLowerCase();
      const detected: Language =
        lower.startsWith('ru') || lower.startsWith('uk') || lower.startsWith('be') || lower.startsWith('kk')
          ? 'ru'
          : 'en';

      setLanguageState(detected);
      document.documentElement.lang = detected;
      localStorage.setItem('repurposeflow_lang', detected);
    } catch {
      // fallback to ru
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('repurposeflow_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'ru' ? 'en' : 'ru';
    setLanguage(nextLang);
  };

  const t = translations[language] || translations.ru;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
