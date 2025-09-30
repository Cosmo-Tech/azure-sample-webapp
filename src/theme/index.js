// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createTheme } from '@mui/material/styles';
import { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark } from './custom';
import overrides from './overrides';

export { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark, overrides };
export const getTheme = (isDarkTheme) =>
  createTheme({
    colorSchemes: {
      light: { palette: paletteLight },
      dark: { palette: paletteDark },
    },
    picture: isDarkTheme ? pictureDark : pictureLight,
    grid: isDarkTheme ? gridDark : gridLight,
    overrides,
  });
