# Supported languages configuration

The  [src/config/Languages.js](../src/config/Languages.js) file contains constants
that define supported languages in your application.

- **LANGUAGES** is a dict describing the languages available in your webapp (e.g. {en: 'English', fr: 'Français'})
- **FALLBACK_LANGUAGE** is the default language to use when the user language can't be detected

English and French are already supported in the webapp. If you need to add another
supported language, you must define it in **LANGUAGES** constant and then create a
corresponding folder in [public/locales](../public/locales) directory. This folder will
contain a translation.json file with all necessary translations (see 
[public/locales/en/translation.json](../public/locales/en/translation.json) for some examples).