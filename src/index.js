// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react';
import { Provider, connect } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { i18next } from './services/config/i18next';
import applicationStore from './state/Store.config';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { paletteLight, pictureLight, gridLight } from './theme';
import { dispatchLogIn, dispatchLogOut } from './state/dispatchers/auth/AuthDispatcher';
import {
  CssBaseline,
  ThemeProvider,
  createMuiTheme,
  // REMOVE THIS WHEN USING MATERIAL UI v5.0
  // see https://github.com/mui-org/material-ui/issues/13394 for more info on
  // Warning: findDOMNode is deprecated in StrictMode.
  // eslint-disable-next-line camelcase
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core';

// REMOVE THIS WHEN USING MATERIAL UI v5.0
// see https://github.com/mui-org/material-ui/issues/13394 for more info on
// Warning: findDOMNode is deprecated in StrictMode.
// eslint-disable-next-line camelcase
const createTheme = process.env.NODE_ENV === 'production' ? createMuiTheme : unstable_createMuiStrictModeTheme;

const mapStateToProps = (state) => ({
  authStatus: state.auth.status,
});
const mapDispatchToProps = {
  logInAction: dispatchLogIn,
  logOutAction: dispatchLogOut,
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

// TO BE REVOED WHEN THEME SWITCH IS AVAILABLE
const lightTheme = createTheme({
  palette: paletteLight,
  picture: pictureLight,
  grid: gridLight,
});

ReactDOM.render(
  <Suspense fallback="">
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={applicationStore}>
          <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <ConnectedApp />
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);
