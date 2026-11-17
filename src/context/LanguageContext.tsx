import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  direction: 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isFa: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Always keep site LTR as explicitly requested by user
  const direction: 'ltr' = 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', 'en');
    root.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction: 'ltr',
        setLanguage,
        toggleLanguage,
        isFa: false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
