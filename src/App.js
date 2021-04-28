// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import Routes from './Routes';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import './assets/scss/index.scss';
import './configs/Auth.config.js';
import { Auth } from '@cosmotech/core';
import { tabs, applicationInsightConfig } from './configs/App.config';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  // TODO: handle authorization and remove the eslint warning
  // eslint-disable-next-line no-unused-vars
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  document.title = t('commoncomponents.text.application.title', 'Cosmo Tech Web Application Sample');
  useEffect(() => {
    const authenticationDone = (authenticated) => {
      debugToken();
      if (authenticated) {
        setAuthenticated(authenticated);
        setAuthorized(authenticated); // TODO: handle authorization
      }
      // Bind callback to update state on authentication data change
      Auth.onAuthStateChanged(authData => {
        if (authData) {
          setAuthenticated(authData.authenticated);
          setAuthorized(authData.authenticated); // TODO: handle authorization
        }
      });
      setLoading(false);
    };
    const debugLocalKey = (key) => {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(key + ': ' + value);
      } else {
        console.log(key + ': ' + 'NO VALUE');
      }
    };

    const debugToken = () => {
      debugLocalKey('authIdTokenPopup');
      debugLocalKey('authIdToken');
      debugLocalKey('authAccessToken');
    };

    const appInsights = new ApplicationInsights(applicationInsightConfig);
    appInsights.loadAppInsights();
    appInsights.trackPageView();

    // Check if the user is already signed-in
    async function signIn () {
      if (Auth.isAsync()) {
        return Auth.isUserSignedIn(authenticationDone);
      } else {
        return Auth.isUserSignedIn();
      }
    }
    signIn()
      .then((isSignInSuccessfully) => authenticationDone(isSignInSuccessfully));
  }, []);

  return loading === true
    ? (
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">{t('views.common.text.loading', 'Loading...')}</span>
              </div>
            </ThemeProvider>
          </I18nextProvider>
      )
    : (
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <Router>
                <Routes authenticated={authenticated}
                  authorized={authenticated} tabs={tabs}/>
                {/* <Routes authenticated={this.state.authenticated}
                  authorized={this.state.authorized} /> */}
              </Router>
            </ThemeProvider>
          </I18nextProvider>
      );
};

export default App;
