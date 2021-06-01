// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Provider, connect } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './configs/i18next.config';
import applicationStore from './state/Store.config';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { dispatchLogIn, dispatchLogOut } from './state/dispatchers/auth/AuthDispatcher';

const mapStateToProps = (state) => ({
  authStatus: state.auth.status
});
const mapDispatchToProps = {
  logInAction: dispatchLogIn,
  logOutAction: dispatchLogOut
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
      <React.StrictMode>
          <BrowserRouter>
              <Provider store={applicationStore}>
                  <I18nextProvider i18n={i18n}>
                      <ThemeProvider theme={theme}>
                        <ConnectedApp />
                      </ThemeProvider>
                  </I18nextProvider>
              </Provider>
          </BrowserRouter>
      </React.StrictMode>,
      document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
