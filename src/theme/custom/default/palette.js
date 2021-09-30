// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Baseline color theme
const themeColors = {
  primary: '#FFAD38',
  primaryVariant: '#A16612',
  secondary: '#466180',
  background: '#191919',
  backgroundVariant: '#1F1F1F',
  surface: '#2E2E2E',
  error: '#FF667F',
  warning: '#FB8C00',
  success: '#19E152',
  info: '#1E88E5',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#999A9D',
  backgroundSignInPage: '#2f363b',
  backgroundSignInButton: '#2F2F2F'
};

export default {
  type: 'dark',
  white: themeColors.white,
  black: themeColors.black,
  primary: {
    contrastText: themeColors.white,
    main: themeColors.primary,
    dark: themeColors.primaryVariant
  },
  secondary: {
    contrastText: themeColors.white,
    main: themeColors.secondary
  },
  success: {
    contrastText: themeColors.white,
    main: themeColors.success
  },
  info: {
    contrastText: themeColors.white,
    main: themeColors.info
  },
  warning: {
    contrastText: themeColors.white,
    main: themeColors.warning
  },
  error: {
    contrastText: themeColors.white,
    main: themeColors.error
  },
  text: {
    primary: themeColors.white,
    secondary: themeColors.white,
    link: themeColors.primary,
    disabled: themeColors.grey,
    success: themeColors.success,
    warning: themeColors.warning,
    error: themeColors.error,
    info: themeColors.info
  },
  background: {
    default: themeColors.background,
    paper: themeColors.background,
    secondary: themeColors.backgroundVariant,
    card: themeColors.surface,
    signInPage: themeColors.backgroundSignInPage,
    signInButton: themeColors.backgroundSignInButton
  }
};
