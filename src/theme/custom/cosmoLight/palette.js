// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Baseline color theme
const themeColors = {
  primary: '#FFAD38',
  primaryVariant: '#F4831E',
  secondary: '#466180',
  background: '#FFFFFF',
  backgroundVariant: '#F5F5F5',
  surface: '#E9E9E9',
  error: '#D1440C',
  warning: '#FB8C00',
  success: '#87B84E',
  info: '#ffe6c2',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#999A9D',
  backgroundSignInPage: '#EBE7E2',
  backgroundSignInButton: '#D7CCC8',
};

export default {
  type: 'light',
  white: themeColors.white,
  black: themeColors.black,
  primary: {
    contrastText: themeColors.black,
    main: themeColors.primary,
    dark: themeColors.primaryVariant,
  },
  secondary: {
    contrastText: themeColors.white,
    main: themeColors.secondary,
  },
  success: {
    contrastText: themeColors.white,
    main: themeColors.success,
  },
  info: {
    contrastText: themeColors.black,
    main: themeColors.info,
  },
  warning: {
    contrastText: themeColors.white,
    main: themeColors.warning,
  },
  error: {
    contrastText: themeColors.white,
    main: themeColors.error,
  },
  text: {
    primary: themeColors.black,
    secondary: themeColors.black,
    link: themeColors.primaryVariant,
    shaded: themeColors.grey,
    success: themeColors.success,
    warning: themeColors.warning,
    error: themeColors.error,
    info: themeColors.info,
  },
  background: {
    default: themeColors.background,
    paper: themeColors.background,
    secondary: themeColors.backgroundVariant,
    card: themeColors.backgroundVariant,
    signInPage: themeColors.backgroundSignInPage,
    signInButton: themeColors.backgroundSignInButton,
  },
};
