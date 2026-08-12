// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createTheme } from '@mui/material/styles';
import {
  paletteLight,
  pictureLight,
  gridLight,
  paletteDark,
  pictureDark,
  gridDark,
  muiDataGridLight,
  muiDataGridDark,
} from './custom';
import overrides from './overrides';

export { paletteLight, pictureLight, gridLight, paletteDark, pictureDark, gridDark, overrides };
export const getTheme = (isDarkTheme) =>
  createTheme({
    colorSchemes: {
      light: {
        palette: paletteLight,
        picture: pictureLight,
        grid: gridLight,
        mixins: { MuiDataGrid: muiDataGridLight },
      },
      dark: { palette: paletteDark, picture: pictureDark, grid: gridDark, mixins: { MuiDataGrid: muiDataGridDark } },
    },
    overrides,
  });
