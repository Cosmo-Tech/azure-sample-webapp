// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import { useLocation, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { ApplicationErrorBanner, StatusBar } from '../../components';
import { AppBar } from '../../components/AppBar';
import { BreadcrumbItem } from '../../components/AppBar/components/BreadcrumbItem';
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
    <AppBar currentScenario={currentScenario}>
      {currentWorkspace.data ? (
        <Fragment>
          <BreadcrumbItem href={`/${currentWorkspace?.data?.id}`} maxWidth="33%">
            {currentWorkspace?.data?.name}
          </BreadcrumbItem>
          <CircleArrowRight size={14} />
          <BreadcrumbItem href="/scenarios" maxWidth="33%">
            Scenarios
          </BreadcrumbItem>
          <CircleArrowRight size={14} />
          <BreadcrumbItem href={`/${currentWorkspace?.data?.id}/scenario/${currentScenario?.data?.id}`} maxWidth="33%">
            {currentScenario?.data?.name}
          </BreadcrumbItem>
        </Fragment>
      ) : (
        <Box>{t('genericcomponent.workspaceselector.homebutton')}</Box>
      )}
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
