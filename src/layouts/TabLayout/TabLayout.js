// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CircleArrowRight } from 'lucide-react';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Link as MuiLink, Box, Stack, Typography } from '@mui/material';
import { ApplicationErrorBanner, StatusBar } from '../../components';
import { AppBar } from '../../components/AppBar';
import { MainNavigation } from '../../components/MainNavigation';
import { useCurrentSimulationRunner, useGetRunner } from '../../state/runner/hooks';
import { useSelectWorkspace, useWorkspace } from '../../state/workspaces/hooks';

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

  useEffect(() => {
    if (currentWorkspace?.status === 'ERROR') {
      navigate('/workspaces');
    } else if (currentWorkspace?.status === 'IDLE' && routerParameters?.workspaceId) {
      selectWorkspace(routerParameters.workspaceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentWorkspace?.status,
    currentWorkspace?.data?.webApp?.options?.instanceView,
    currentWorkspace?.data?.webApp?.options?.datasetManager,
    currentTabPathname,
  ]);
  // call back-end API to get details of a runner if scenario is shared with a link
  useEffect(() => {
    if (currentWorkspace?.status === 'SUCCESS' && routerParameters?.scenarioId) {
      getScenario(routerParameters.scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.status, getScenario]);

  const MainPage = () => (
    <Stack direction="column" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Stack>
  );

  const BreadcrumbBar = () => (
    <AppBar>
      {currentWorkspace.data ? (
        <Fragment>
          <MuiLink underline="hover" color="inherit" href={`/${currentWorkspace?.data?.id}`}>
            <Typography fontSize={14}>{currentWorkspace?.data?.name}</Typography>
          </MuiLink>
          <CircleArrowRight size={14} />
          <MuiLink underline="hover" color="inherit" href="/scenarios">
            <Typography fontSize={14}>Scenarios</Typography>
          </MuiLink>
          <CircleArrowRight size={14} />
          <MuiLink
            underline="hover"
            color="inherit"
            href={`/${currentWorkspace?.data?.id}/scenario/${currentScenario?.data?.id}`}
          >
            <Typography fontSize={14}>{currentScenario?.data?.name}</Typography>
          </MuiLink>
        </Fragment>
      ) : (
        <Box>{t('genericcomponent.workspaceselector.homebutton')}</Box>
      )}
    </AppBar>
  );

  return (
    <Stack direction="row" sx={{ flexGrow: 1 }}>
      <MainNavigation activeSection="scenarios" />
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <ApplicationErrorBanner />
        <BreadcrumbBar />
        {currentScenario?.data && (
          <StatusBar
            status="prerun"
            size="full"
            message={t('commoncomponents.tabLayout.statusBar.prerun.message')}
            tooltip={t('commoncomponents.tabLayout.statusBar.prerun.tooltip')}
          />
        )}
        <Stack direction="row" spacing={2}>
          <MainPage />
        </Stack>
      </Stack>
    </Stack>
  );
};
