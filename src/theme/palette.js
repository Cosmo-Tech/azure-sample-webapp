// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { colors } from '@material-ui/core';

const themeColors = {
  primary200: '#FFE8AF',
  primary500: '#FFAD38',
  primaryDark: '#a16612',
  secondary: '#466180',
  background: '#191919',
  backgroundSecondary: '#1f1f1f',
  backgroundSignInPage: '#2E363B',
  textGrey: '#999a9d',
  surface: '#100f0f',
  red: '#df410c',
  green: '#19e152',
  error: '#FF667F',
  black: '#000000',
  white: '#FFFFFF'
};

export default {
  type: 'dark',
  white: themeColors.white,
  black: themeColors.black,
  primary: {
    contrastText: themeColors.white,
    main: themeColors.primary500,
    dark: themeColors.primaryDark
  },
  secondary: {
    contrastText: themeColors.white,
    main: themeColors.primary500
  },
  success: {
    contrastText: themeColors.white,
    main: colors.green[600]
  },
  info: {
    contrastText: themeColors.white,
    main: colors.blue[600]
  },
  warning: {
    contrastText: themeColors.white,
    main: colors.orange[600]
  },
  error: {
    contrastText: themeColors.white,
    main: themeColors.error

  },
  text: {
    primary: themeColors.white,
    secondary: themeColors.white,
    link: themeColors.primary500,
    grey: themeColors.textGrey,
    warning: themeColors.red,
    ok: themeColors.green
  },
  background: {
    default: themeColors.background,
    paper: themeColors.background,
    secondary: themeColors.backgroundSecondary
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200],
  signInPage: {
    background: themeColors.backgroundSignInPage
  }
};
