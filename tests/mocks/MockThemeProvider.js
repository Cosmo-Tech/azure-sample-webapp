import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const MockTheme = ({ children }) => {
  const theme = createTheme({});
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

MockTheme.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default MockTheme;
