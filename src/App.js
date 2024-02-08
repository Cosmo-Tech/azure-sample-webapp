// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdleTimer } from 'react-idle-timer';
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import { Auth } from '@cosmotech/core';
import { useApp } from './AppHook';
import AppRoutes from './AppRoutes';
import './assets/scss/index.scss';
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog/SessionTimeoutDialog';
import './services/AppInsights';
import './services/config/Auth';
import { SESSION_INACTIVITY_TIMEOUT } from './services/config/FunctionalConstants';
import { TwoActionsDialogGlobal } from './services/twoActionsDialog/twoActionsDialogService';
import { AUTH_STATUS } from './state/commons/AuthConstants';
import { STATUSES } from './state/commons/Constants';
import { getTheme } from './theme';
import Loading from './views/Loading';

const SESSION_TIMEOUT_PROMPT_DELAY_IN_SECONDS = 30;

const App = () => {
  const { t } = useTranslation();
  document.title = t('commoncomponents.text.application.title', 'Cosmo Tech Web Application Sample');

  const [applicationStatus, authStatus, isDarkTheme, getAllInitialData, setApplicationStatus, logIn, logOut] = useApp();

  const theme = React.useMemo(() => getTheme(isDarkTheme), [isDarkTheme]);

  const isAuthenticated = authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING;
  const isConnecting = authStatus === AUTH_STATUS.CONNECTING;

  useEffect(() => {
    if (isAuthenticated) {
      getAllInitialData();
    } else {
      setApplicationStatus(STATUSES.IDLE);
    }
  }, [getAllInitialData, isAuthenticated, setApplicationStatus]);

  useEffect(() => {
    // Check if the user is already signed-in
    if (authStatus === AUTH_STATUS.UNKNOWN) {
      logIn();
    }
  }, [authStatus, logIn]);

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
      seconds,
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

  const isLoading = useMemo(() => [STATUSES.LOADING, STATUSES.IDLE].includes(applicationStatus), [applicationStatus]);

  const getAppContent = useCallback(() => {
    if (isConnecting) {
      return <div className="spinner-border text-success" role="status" />;
    }

    if (isAuthenticated && isLoading) {
      return <Loading />;
    }

    return <AppRoutes authenticated={isAuthenticated} authorized={applicationStatus === STATUSES.SUCCESS} />;
  }, [isConnecting, isAuthenticated, isLoading, applicationStatus]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <TwoActionsDialogGlobal />
        <CssBaseline />
        <SessionTimeoutDialog
          getRemainingTimeLabel={getRemainingTimeLabel}
          labels={sessionTimeoutLabels}
          open={isSessionTimeoutDialogOpen}
          onClose={closeSessionTimeoutDialog}
          onLogOut={logOut}
          timeout={SESSION_TIMEOUT_PROMPT_DELAY_IN_SECONDS}
        />
        {getAppContent()}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
