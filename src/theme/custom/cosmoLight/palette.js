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
  error: '#FF667F',
  warning: '#FB8C00',
  success: '#19E152',
  info: '#1E88E5',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#999A9D',
  backgroundSignInPage: '#EBE7E2',
  backgroundSignInButton: '#D7CCC8'
};

export default {
  type: 'light',
  white: themeColors.white,
  black: themeColors.black,
  primary: {
    contrastText: themeColors.black,
    main: themeColors.primary,
    dark: themeColors.primaryVariant
  },
  secondary: {
    contrastText: themeColors.black,
    main: themeColors.secondary
  },
  success: {
    contrastText: themeColors.black,
    main: themeColors.success
  },
  info: {
    contrastText: themeColors.black,
    main: themeColors.black
  },
  warning: {
    contrastText: themeColors.black,
    main: themeColors.warning
  },
  error: {
    contrastText: themeColors.black,
    main: themeColors.error
  },
  text: {
    primary: themeColors.black,
    secondary: themeColors.black,
    link: themeColors.primaryVariant,
    shaded: themeColors.grey,
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
