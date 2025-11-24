// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import { useLocation, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link as MuiLink, Stack } from '@mui/material';
import { ApplicationErrorBanner } from '../../components';
import { AppBar } from '../../components/AppBar';
import { MainNavigation } from '../../components/MainNavigation';
import { useGetRunner } from '../../state/runner/hooks';
import { useSelectWorkspace, useWorkspace } from '../../state/workspaces/hooks';

export const TabLayout = () => {
  const location = useLocation();
  const currentTabPathname = location?.pathname;

  const routerParameters = useParams();
  sessionStorage.removeItem('providedUrlBeforeSignIn');
  const currentWorkspace = useWorkspace();
  const navigate = useNavigate();
  const selectWorkspace = useSelectWorkspace();
  const getScenario = useGetRunner();

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
    <Breadcrumbs aria-label="breadcrumb" sx={{ padding: 2 }}>
      <MuiLink underline="hover" color="inherit" href="/">
        Workspaces
      </MuiLink>
      <MuiLink underline="hover" color="inherit" href="/">
        Overall
      </MuiLink>
      <MuiLink underline="hover" color="inherit" href="/">
        Main
      </MuiLink>
    </Breadcrumbs>
  );
  const StatusBar = () => (
    <AppBar position="static" color="default" sx={{ boxShadow: 'none' }}>
      <Box sx={{ pl: 2 }}>StatusBar</Box>
    </AppBar>
  );

  return (
    <Stack direction="row" sx={{ flexGrow: 1 }} spacing={2}>
      <MainNavigation activeSection="scenarios" />
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <ApplicationErrorBanner />
        <BreadcrumbBar />
        <StatusBar />
        <Stack direction="row" spacing={2}>
          <MainPage />
        </Stack>
      </Stack>
    </Stack>
  );
};