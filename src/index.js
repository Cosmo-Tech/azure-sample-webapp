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
import { dispatchLogIn, dispatchLogOut } from './state/dispatchers/auth/AuthDispatcher';

const mapStateToProps = (state) => ({
  authStatus: state.auth.status,
  isDarkTheme: state.application.isDarkTheme,
});
const mapDispatchToProps = {
  logInAction: dispatchLogIn,
  logOutAction: dispatchLogOut,
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Suspense fallback="">
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={applicationStore}>
          <I18nextProvider i18n={i18next}>
            <ConnectedApp />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);
