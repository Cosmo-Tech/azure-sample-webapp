// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useMatch, Outlet, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs as MuiTabs, Tab, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { filterTabsForCurrentWorkspace } from '../../AppLayout';
import { ApplicationErrorBanner } from '../../components';
import { AppBar } from '../../components/AppBar';
import { DashboardsManager } from '../../managers';
import { useGetRunner } from '../../state/hooks/RunnerHooks';
import { useSelectWorkspace, useWorkspace } from '../../state/hooks/WorkspaceHooks';
import { ConfigUtils } from '../../utils';

const useStyles = makeStyles((theme) => ({
  content: {
    height: 'calc(100% - 48px)',
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    boxSizing: 'border-box',
  },
}));

export const TabLayout = (props) => {
  const classes = useStyles();
  const { tabs } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const currentTabPathname = location?.pathname;
  const scenarioViewUrl = useMatch(':workspaceId/scenario/:scenarioId');
  const instanceViewUrl = useMatch(':workspaceId/instance/:scenarioId');
  const datasetManagerViewUrl = useMatch(':workspaceId/datasetmanager');
  const routerParameters = useParams();
  sessionStorage.removeItem('providedUrlBeforeSignIn');
  const currentWorkspace = useWorkspace();
  const navigate = useNavigate();
  const selectWorkspace = useSelectWorkspace();
  const getScenario = useGetRunner();
  const filteredTabs = useMemo(
    () => filterTabsForCurrentWorkspace(tabs, currentWorkspace?.data),
    [tabs, currentWorkspace?.data]
  );

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

  const shouldRedirectFromInstanceView =
    currentTabPathname.startsWith(`/${routerParameters.workspaceId}/instance`) &&
    !ConfigUtils.isInstanceViewConfigValid(currentWorkspace?.data?.webApp?.options?.instanceView);
  const shouldRedirectFromDatasetManager =
    currentTabPathname.startsWith(`/${routerParameters.workspaceId}/datasetmanager`) &&
    !ConfigUtils.isDatasetManagerEnabledInWorkspace(currentWorkspace?.data);
  const shouldRedirectFromDashboardsView =
    currentTabPathname.startsWith(`/${routerParameters.workspaceId}/dashboards`) &&
    !ConfigUtils.isResultsDisplayEnabledInWorkspace(currentWorkspace?.data);
  const shouldRedirect =
    shouldRedirectFromInstanceView || shouldRedirectFromDatasetManager || shouldRedirectFromDashboardsView;
  const tabValue = shouldRedirect ? `/${routerParameters.workspaceId}/scenario` : currentTabPathname;

  const viewTabs = (
    <MuiTabs value={tabValue} indicatorColor="secondary" textColor="inherit">
      {filteredTabs.map((tab) => (
        <Tab
          data-cy={tab.key}
          key={tab.key}
          value={
            (tab.to === 'scenario' && scenarioViewUrl?.pathname) ||
            (tab.to === 'instance' && instanceViewUrl?.pathname) ||
            (tab.to === 'datasetmanager' && datasetManagerViewUrl?.pathname) ||
            `/${routerParameters.workspaceId}/${tab.to}`
          }
          label={t(tab.label, tab.key)}
          component={Link}
          to={`${currentWorkspace?.data?.id}/${tab.to}`}
        />
      ))}
    </MuiTabs>
  );

  return currentWorkspace?.data ? (
    <>
      <DashboardsManager />
      <AppBar>{viewTabs}</AppBar>
      <Box className={classes.content}>
        <ApplicationErrorBanner />
        <Outlet />
      </Box>
    </>
  ) : null;
};

TabLayout.propTypes = {
  tabs: PropTypes.array.isRequired,
};
