// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { colorSwap } from '../../colorSwap.js';

export default {
  mode: 'dark',
  primary: {
    main: colorSwap.primary[80], // 'a4bfe4',
    contrastText: colorSwap.primary[20],
  },
  primaryContainer: {
    main: colorSwap.primary[30],
    contrastText: colorSwap.primary[90],
  },
  secondary: {
    main: colorSwap.secondary[80], // '#ffe26b',
    contrastText: colorSwap.secondary[20],
  },
  secondaryContainer: {
    main: colorSwap.secondary[30],
    contrastText: colorSwap.secondary[90],
  },
  info: {
    main: colorSwap.tertiary[80], // '#67B8E3',
    contrastText: colorSwap.tertiary[20],
  },
  infoContainer: {
    main: colorSwap.tertiary[30],
    contrastText: colorSwap.tertiary[90],
  },
  error: {
    main: colorSwap.error[80], // '#e57373',
    contrastText: colorSwap.error[20],
  },
  errorContainer: {
    main: colorSwap.error[30],
    contrastText: colorSwap.error[90],
  },
  surface: {
    main: colorSwap.neutral[30],
    contrastText: colorSwap.neutral[90],
  },

  text: {
    main: '#e2e2e6',
    secondary: '#c3c7cf', // 'rgba(0,0,0,0.6)',
  },
  surfaceVariant: {
    main: '#42474e',
    contrastText: '#c3c7cf',
  },
  warning: {
    main: '#ffa726',
    contrastText: '#000000',
  },
  success: {
    main: '#66bb6a',
    contrastText: '#000000',
  },
  microsoft: {
    main: '#2F2F2F',
    contrastText: '#FFFFFF',
  },
  appbar: {
    main: '#121212',
    contrastText: '#FFFFFF',
  },
  login: {
    main: '#2F363B',
  },
};
