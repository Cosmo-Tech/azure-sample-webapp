// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../src/theme";

const theme = getTheme(false);

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  )
];

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};
