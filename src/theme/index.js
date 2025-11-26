// theme/index.js or theme/getTheme.js
import { createTheme } from '@mui/material/styles';
import { paletteLight, paletteDark, pictureLight, pictureDark, gridLight, gridDark } from './custom';
import createComponents from './overrides';
import typography from './typography';

export const getTheme = (isDarkTheme) => {
  let theme = createTheme({
    colorSchemes: {
      light: { palette: paletteLight, picture: pictureLight, grid: gridLight },
      dark: { palette: paletteDark, picture: pictureDark, grid: gridDark },
    },
    typography,
  });

  const components = createComponents(theme);
  theme = createTheme(theme, { components });

  return theme;
};
