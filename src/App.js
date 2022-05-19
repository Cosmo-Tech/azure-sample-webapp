// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useIdleTimer } from 'react-idle-timer';
import { Auth } from '@cosmotech/core';
import './assets/scss/index.scss';
import './services/config/Auth';
import { TABS } from './AppLayout';
import Loading from './views/Loading';
import './services/AppInsights';
import { AUTH_STATUS } from './state/commons/AuthConstants';
import { SESSION_INACTIVITY_TIMEOUT } from './config/AppConfiguration';
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog/SessionTimeoutDialog';

const SESSION_TIMEOUT_PROMPT_DELAY_IN_SECONDS = 30;

const App = ({ authStatus, logOutAction, logInAction }) => {
  const { t } = useTranslation();
  document.title = t('commoncomponents.text.application.title', 'Cosmo Tech Web Application Sample');

  useEffect(() => {
    // Check if the user is already signed-in
    if (authStatus === AUTH_STATUS.UNKNOWN) {
      logInAction();
    }
  });

  const [isSessionTimeoutDialogOpen, setIsSessionTimeoutDialogOpen] = useState(false);
  const closeSessionTimeoutDialog = () => {
    idleTimer?.reset();
    setIsSessionTimeoutDialogOpen(false);
  };
  const sessionTimeoutLabels = {
    body: t(
      'commoncomponents.dialog.sessionTimeout.body',
      'You have been idle for a long time. You will be automatically disconnected in a few seconds...'
    ),
    cancel: t('commoncomponents.dialog.sessionTimeout.cancel', 'Cancel'),
    logOut: t('commoncomponents.dialog.sessionTimeout.logOut', 'Sign out'),
    loggingOut: t('commoncomponents.dialog.sessionTimeout.loggingOut', 'Signing out...'),
    title: t('commoncomponents.dialog.sessionTimeout.title', 'Session timeout'),
  };
  const getRemainingTimeLabel = (seconds) =>
    t('views.accessdenied.signouttimeout', 'You will be automatically signed out in {{seconds}} seconds...', {
      seconds: seconds,
    });

  let idleTimer = {};

  const onIdle = async () => {
    const authenticated = await Auth.isUserSignedIn();
    if (authenticated) {
      setIsSessionTimeoutDialogOpen(true);
    }
  };

  const timeout = 1000 * 60 * SESSION_INACTIVITY_TIMEOUT;
  idleTimer = useIdleTimer({ onIdle, timeout });

  const appContent =
    authStatus === AUTH_STATUS.CONNECTING ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">{t('views.common.text.loading', 'Loading...')}</span>
      </div>
    ) : (
      <Loading
        logout={logOutAction}
        authenticated={authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING}
        authorized={authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING}
        tabs={TABS}
      />
    );

  return (
    <>
      <SessionTimeoutDialog
        getRemainingTimeLabel={getRemainingTimeLabel}
        labels={sessionTimeoutLabels}
        open={isSessionTimeoutDialogOpen}
        onClose={closeSessionTimeoutDialog}
        onLogOut={logOutAction}
        timeout={SESSION_TIMEOUT_PROMPT_DELAY_IN_SECONDS}
      />
      {appContent}
    </>
  );
};

App.propTypes = {
  authStatus: PropTypes.string.isRequired,
  logInAction: PropTypes.func.isRequired,
  logOutAction: PropTypes.func.isRequired,
};

export default App;
