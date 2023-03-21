// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { colorSwap } from '../../colorSwap.js';

export default {
  mode: 'light',
  primary: {
    main: colorSwap.primary[40], // '#0061a3', // '#466282',
    contrastText: colorSwap.primary[100],
  },
  primaryContainer: {
    main: colorSwap.primary[90],
    contrastText: colorSwap.primary[10],
  },
  secondary: {
    main: colorSwap.secondary[40], // '#845400',  //'#ffb039',
    contrastText: colorSwap.secondary[100],
  },
  secondaryContainer: {
    main: colorSwap.secondary[90],
    contrastText: colorSwap.secondary[10],
  },
  info: {
    main: colorSwap.tertiary[40], // '#0288d1',
    contrastText: colorSwap.tertiary[100],
  },
  infoContainer: {
    main: colorSwap.tertiary[90],
    contrastText: colorSwap.tertiary[10],
  },
  error: {
    main: colorSwap.error[40], // '#d32f2f',
    contrastText: colorSwap.error[100],
  },
  errorContainer: {
    main: colorSwap.error[90],
    contrastText: colorSwap.error[10],
  },
  surface: {
    main: colorSwap.neutral[70],
    contrastText: colorSwap.neutral[10],
  },

  background: {
    default: '#fdfcff', // '#fafafa',
    paper: '#fdfcff',
  },
  surfaceVariant: {
    main: '#dfe2eb',
    contrastText: '#42474e',
  },
  text: {
    main: '#1a1c1e',
    secondary: '#42474e', // 'rgba(0,0,0,0.6)',
  },

  warning: {
    main: '#ed6c02',
    contrastText: '#000000',
  },
  success: {
    main: '#2e7d32',
    contrastText: '#ffffff',
  },
  microsoft: {
    main: '#ffffff',
    contrastText: '#5e5e5e',
  },
  appbar: {
    main: '#121212',
    contrastText: '#ffffff',
  },
  login: {
    main: '#ebe7e2',
  },
};
