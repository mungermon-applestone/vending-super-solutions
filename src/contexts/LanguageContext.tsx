import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export type LanguageContextType = {
  currentLanguage: string;
  availableLanguages: Language[];
  changeLanguage: (languageCode: string) => void;
  isTranslating: boolean;
  setIsTranslating: (translating: boolean) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLanguage);
      
      if (supportedLanguage) {
        setCurrentLanguage(supportedLanguage.code);
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('preferred-language', languageCode);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    isTranslating,
    setIsTranslating,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};