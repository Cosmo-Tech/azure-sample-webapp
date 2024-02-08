// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark } from './custom';
import overrides from './overrides';

export { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark, overrides };
export const getTheme = (isDarkTheme) =>
  createTheme(
    adaptV4Theme({
      palette: isDarkTheme ? paletteDark : paletteLight,
      picture: isDarkTheme ? pictureDark : pictureLight,
      grid: isDarkTheme ? gridDark : gridLight,
      overrides,
      components: {
        MuiPaper: {
          styleOverrides: { root: { backgroundImage: 'unset' } },
        },
      },
    })
  );
