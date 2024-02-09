const LOCALE = 'locale';
const LANGUAGE = 'language';

export const dataLocalStorage = {
  setLocale(locale) {
    localStorage.setItem(LOCALE, locale);
  },
  getLocale() {
    return localStorage.getItem(LOCALE);
  },
  setLanguage(lang) {
    localStorage.setItem(LANGUAGE, lang);
  },
  getLanguage() {
    return localStorage.getItem(LANGUAGE);
  },
};