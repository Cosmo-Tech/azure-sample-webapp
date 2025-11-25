// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createTheme } from '@mui/material/styles';
import { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark } from './custom';
import components from './overrides';
import typography from './typography';

export { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark, components, typography };
export const getTheme = (isDarkTheme) =>
  createTheme({
    colorSchemes: {
      light: { palette: paletteLight, picture: pictureLight, grid: gridLight },
      dark: { palette: paletteDark, picture: pictureDark, grid: gridDark },
    },
    typography,
    components,
  });
