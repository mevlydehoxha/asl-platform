import { CHOOSE_LANGUAGE } from '../actionTypes';

export const chooseLanguage = (locale) => {
  return {
    type: CHOOSE_LANGUAGE,
    payload: locale,
  };
};