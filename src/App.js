// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './assets/scss/index.scss';
import './services/config/Auth';
import { TABS } from './AppLayout';
import Loading from './views/Loading';
import './services/AppInsights';

const App = (props) => {
  const { t } = useTranslation();
  document.title = t('commoncomponents.text.application.title', 'Cosmo Tech Web Application Sample');

  const { authStatus, logOutAction, logInAction } = props;

  useEffect(() => {
    // Check if the user is already signed-in
    if (authStatus === 'ANONYMOUS') {
      logInAction();
    }
  });

  return (authStatus === 'CONNECTING')
    ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">{t('views.common.text.loading', 'Loading...')}</span>
      </div>
      )
    : (
        <Loading logout={logOutAction}
          authenticated={authStatus === 'AUTHENTICATED'}
          authorized={authStatus === 'AUTHENTICATED'}
          tabs={TABS} />
      );
};

App.propTypes = {
  authStatus: PropTypes.string.isRequired,
  logInAction: PropTypes.func.isRequired,
  logOutAction: PropTypes.func.isRequired
};

export default App;
