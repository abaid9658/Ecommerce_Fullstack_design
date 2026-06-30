import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const t = translations[language] || translations.en;

  // Apply RTL/LTR direction dynamically
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', currentLang.dir);
    localStorage.setItem('lang', language);
  }, [language, currentLang.dir]);

  const changeLanguage = useCallback((code) => {
    if (translations[code]) {
      setLanguage(code);
    }
  }, []);

  // Nested key support: t('nav.home') or t('common.search')
  const translate = useCallback((key) => {
    const keys = key.split('.');
    let result = t;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }
    return result || key;
  }, [t]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: translate,
        currentLang,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isRTL: currentLang.dir === 'rtl',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
