// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import './assets/scss/index.scss';
import './configs/Auth.config.js';
import { Auth } from '@cosmotech/core';
import { applicationInsightConfig, tabs } from './configs/App.config';
import Loading from './views/Loading'
import { signIn } from './utils/SignUtils'

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [authenticated, setAuthenticated] = useState(false);
  // TODO: handle authorization and remove the eslint warning
  // eslint-disable-next-line no-unused-vars
  const [authorized, setAuthorized] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  document.title = t('commoncomponents.text.application.title', 'Cosmo Tech Web Application Sample');

  const authenticationDone = (authenticated) => {
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

  useEffect(() => {
    const appInsights = new ApplicationInsights(applicationInsightConfig);
    appInsights.loadAppInsights();
    appInsights.trackPageView();

    // Check if the user is already signed-in
    signIn(authenticationDone)
      .then((isSignInSuccessfully) => authenticationDone(isSignInSuccessfully));
  }, []);

  return loading === true
    ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">{t('views.common.text.loading', 'Loading...')}</span>
      </div>
      )
    : (
        <Loading authenticated={authenticated} authorized={authenticated} tabs={tabs}/>
      );
};

export default App;
