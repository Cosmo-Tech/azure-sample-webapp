// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CircleArrowRight } from 'lucide-react';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { ApplicationErrorBanner } from '../../components';
import { AppBar } from '../../components/AppBar';
import { BreadcrumbItem } from '../../components/AppBar/components/BreadcrumbItem';
import { MainNavigation } from '../../components/MainNavigation';
import { useMainNavigation } from '../../components/MainNavigation/MainNavigationHook';
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
            {activeSection}
          </BreadcrumbItem>
        </Fragment>
      ) : (
        <Box>{t('genericcomponent.workspaceselector.homebutton')}</Box>
      )}
    </AppBar>
  );

  return (
    <Stack direction="row" sx={{ flexGrow: 1 }}>
      <MainNavigation
        onSectionChange={(sectionId) => {
          if (!currentWorkspace?.data?.id) return;
          const workspaceId = currentWorkspace.data.id;

          if (sectionId === 'data') navigate(`/${workspaceId}/datasets`);
          if (sectionId === 'scenarios') navigate(`/${workspaceId}/scenarios`);
          if (sectionId === 'scorecard') navigate(`/${workspaceId}/scorecard`);
        }}
      />
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <ApplicationErrorBanner />
        <BreadcrumbBar />
        <Stack direction="row" spacing={2}>
          <MainPage />
        </Stack>
      </Stack>
    </Stack>
  );
};
