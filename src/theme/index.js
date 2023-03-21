// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark } from './custom';
import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import overrides from './overrides';
import { colorSwap } from './colorSwap.js';

export { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark, overrides };

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)';

export const getTheme = (isDarkTheme) =>
  createTheme({
    palette: isDarkTheme ? paletteDark : paletteLight,
    picture: isDarkTheme ? pictureDark : pictureLight,
    grid: isDarkTheme ? gridDark : gridLight,
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
        variants: [
          {
            props: { variant: 'soft', color: 'primary' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.main}`,
              boxShadow: 'none',
              '&:disabled': {
                backgroundColor: alpha(`${isDarkTheme ? colorSwap.neutral[30] : colorSwap.neutral[70]}`, 0.12),
                color: alpha(`${isDarkTheme ? colorSwap.neutral[90] : colorSwap.neutral[10]}`, 0.38),
                boxShadow: 'none',
              },
            },
          },
          {
            props: { variant: 'soft', color: 'error' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).errorContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).errorContainer.main}`,
              boxShadow: 'none',
              '&:disabled': {
                backgroundColor: alpha(`${isDarkTheme ? colorSwap.neutral[30] : colorSwap.neutral[70]}`, 0.12),
                color: alpha(`${isDarkTheme ? colorSwap.neutral[90] : colorSwap.neutral[10]}`, 0.38),
                boxShadow: 'none',
              },
            },
          },
          {
            props: { variant: 'soft', color: 'info' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).infoContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).infoContainer.main}`,
              boxShadow: 'none',
              '&:disabled': {
                backgroundColor: alpha(`${isDarkTheme ? colorSwap.neutral[30] : colorSwap.neutral[70]}`, 0.12),
                color: alpha(`${isDarkTheme ? colorSwap.neutral[90] : colorSwap.neutral[10]}`, 0.38),
              },
            },
          },
        ],
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
          },
        },
        variants: [
          {
            props: { variant: 'soft', color: 'primary' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.main}`,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: alpha(`${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.main}`, 0.88),
                boxShadow: `${isDarkTheme ? 'none' : boxShadow}`,
              },
              '&:active': {
                boxShadow: 'none',
                backgroundColor: alpha(`${(isDarkTheme ? paletteDark : paletteLight).primaryContainer.main}`, 0.84),
              },
              '&:focus': {
                boxShadow: 'none',
              },
              '&:disabled': {
                backgroundColor: alpha(`${isDarkTheme ? colorSwap.neutral[30] : colorSwap.neutral[70]}`, 0.12),
                color: alpha(`${isDarkTheme ? colorSwap.neutral[90] : colorSwap.neutral[10]}`, 0.38),
                boxShadow: 'none',
              },
            },
          },
          {
            props: { variant: 'soft', color: 'secondary' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).secondaryContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).secondaryContainer.main}`,
            },
          },
          {
            props: { variant: 'soft', color: 'info' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).infoContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).infoContainer.main}`,
            },
          },
          {
            props: { variant: 'soft', color: 'error' },
            style: {
              color: `${(isDarkTheme ? paletteDark : paletteLight).errorContainer.contrastText}`,
              backgroundColor: `${(isDarkTheme ? paletteDark : paletteLight).errorContainer.main}`,
              '&:hover': {
                backgroundColor: alpha(`${(isDarkTheme ? paletteDark : paletteLight).errorContainer.main}`, 0.88),
                boxShadow: `${isDarkTheme ? 'none' : boxShadow}`,
              },
              '&:active': {
                boxShadow: 'none',
                backgroundColor: alpha(`${(isDarkTheme ? paletteDark : paletteLight).errorContainer.main}`, 0.84),
              },
              '&:focus': {
                boxShadow: 'none',
              },
              '&:disabled': {
                backgroundColor: alpha(`${(isDarkTheme ? paletteDark : paletteLight).surface.main}`, 0.12),
                color: alpha(`${(isDarkTheme ? paletteDark : paletteLight).surface.contrastText}`, 0.38),
                boxShadow: 'none',
              },
            },
          },
        ],
      },
    },
  });
