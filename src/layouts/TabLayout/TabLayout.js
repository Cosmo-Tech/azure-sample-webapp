// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Outlet, useParams, useNavigate, useMatch } from 'react-router-dom';
import { Link as MuiLink, Box, Stack, Typography } from '@mui/material';
import { useApp } from '../../AppHook';
import { ApplicationErrorBanner, Icon } from '../../components';
import { AppBar } from '../../components/AppBar';
import { MainNavigation } from '../../components/MainNavigation';
import { STATUSES } from '../../services/config/StatusConstants';
import { AUTH_STATUS } from '../../state/auth/constants';
import { useMainNavigation } from '../../state/mainNavigation/hooks';
import { useCurrentSimulationRunner, useGetRunner } from '../../state/runner/hooks';
import { useSelectWorkspace, useWorkspace } from '../../state/workspaces/hooks';
import Loading from '../../views/Loading';

export const TabLayout = () => {
  const location = useLocation();
  const currentTabPathname = location?.pathname;
  const { t } = useTranslation();

  const routerParameters = useParams();
  sessionStorage.removeItem('providedUrlBeforeSignIn');
  const currentWorkspace = useWorkspace();
  const navigate = useNavigate();
  const selectWorkspace = useSelectWorkspace();
  const getScenario = useGetRunner();
  const currentScenario = useCurrentSimulationRunner();
  const isScenarioPage = useMatch('/:workspaceId/scenario/:scenarioId');
  const { activeSection } = useMainNavigation();

  useEffect(() => {
    if (currentWorkspace?.status === 'ERROR') {
      navigate('/workspaces');
    } else if (currentWorkspace?.status === 'IDLE' && routerParameters?.workspaceId) {
      selectWorkspace(routerParameters.workspaceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentWorkspace?.status,
    currentWorkspace?.data?.additionalData?.webapp?.instanceView,
    currentWorkspace?.data?.additionalData?.webapp?.datasetManager,
    currentTabPathname,
  ]);
  // call back-end API to get details of a runner if scenario is shared with a link
  useEffect(() => {
    if (currentWorkspace?.status === 'SUCCESS' && routerParameters?.scenarioId) {
      getScenario(routerParameters.scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.status, getScenario]);

  const BreadcrumbBar = () => (
    <AppBar currentScenario={currentScenario}>
      {currentWorkspace.data ? (
        <Fragment>
          <MuiLink underline="hover" color="inherit" href={`/${currentWorkspace?.data?.id}`}>
            <Typography fontSize={14}>{currentWorkspace?.data?.name}</Typography>
          </MuiLink>
          {activeSection && (
            <>
              <Icon name="CircleArrowRight" size={14} />
              <MuiLink underline="hover" color="inherit" href={`/${currentWorkspace?.data?.id}/${activeSection}`}>
                <Typography fontSize={14}>{activeSection}</Typography>
              </MuiLink>
            </>
          )}
          {isScenarioPage && (
            <>
              <Icon name="CircleArrowRight" size={14} />
              <MuiLink
                underline="hover"
                color="inherit"
                href={`/${currentWorkspace?.data?.id}/scenario/${currentScenario?.data?.id}`}
              >
                <Typography fontSize={14}>{currentScenario?.data?.name}</Typography>
              </MuiLink>
            </>
          )}
        </Fragment>
      ) : (
        <Box>{t('genericcomponent.workspaceselector.homebutton')}</Box>
      )}
    </AppBar>
  );

  const { applicationStatus, authStatus } = useApp();
  const isAuthenticated = authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING;
  const isLoading = useMemo(() => [STATUSES.LOADING, STATUSES.IDLE].includes(applicationStatus), [applicationStatus]);

  return (
    <Stack direction="row" sx={{ flexGrow: 1 }}>
      <MainNavigation />
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <BreadcrumbBar />
        <ApplicationErrorBanner />
        {isAuthenticated && isLoading ? <Loading /> : <Outlet />}
      </Stack>
    </Stack>
  );
};
