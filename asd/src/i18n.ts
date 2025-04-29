// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import the JSON files for each language
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fn/translation.json'; // Corrected "fn" to "fr"
import zhHKTranslation from './locales/zh-HK/translation.json'; // Added zh-HK

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      'zh-HK': { translation: zhHKTranslation }, // Added Traditional Chinese (Hong Kong)
    },
    lng: 'en',         // Default language
    fallbackLng: 'en', // Fallback to English if translation not found
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
  });

export default i18n;
