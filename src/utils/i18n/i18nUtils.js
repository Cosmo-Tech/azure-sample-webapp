// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const changeLanguage = (language, i18n) => {
  switch (language) {
    case 'en':
      i18n.changeLanguage('en');
      break;
    case 'fr':
      i18n.changeLanguage('fr');
      break;
    default:
      i18n.changeLanguage('en');
      break;
  }
};
const i18nUtils = {
  changeLanguage
};

export default i18nUtils;
