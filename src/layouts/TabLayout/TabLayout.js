// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useMatch, Outlet, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs as MuiTabs, Tab, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ErrorBanner } from '@cosmotech/ui';
import { filterTabsForCurrentWorkspace } from '../../AppLayout';
import { AppBar } from '../../components/AppBar';
import { DashboardsManager } from '../../managers';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
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
  const applicationError = useApplicationError();
  const clearApplicationErrorMessage = useClearApplicationErrorMessage();
  const routerParameters = useParams();
  sessionStorage.removeItem('providedUrlBeforeSignIn');
  const currentWorkspace = useWorkspace();
  const navigate = useNavigate();
  const selectWorkspace = useSelectWorkspace();
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

  const shouldRedirectFromInstanceView =
    currentTabPathname.startsWith(`/${routerParameters.workspaceId}/instance`) &&
    !ConfigUtils.isInstanceViewConfigValid(currentWorkspace?.data?.webApp?.options?.instanceView);
  const shouldRedirectFromDatasetManager =
    currentTabPathname.startsWith(`/${routerParameters.workspaceId}/datasetmanager`) &&
    !ConfigUtils.isDatasetManagerEnabledInWorkspace(currentWorkspace?.data);
  const shouldRedirect = shouldRedirectFromInstanceView || shouldRedirectFromDatasetManager;
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
        <ErrorBanner
          error={applicationError}
          labels={{
            dismissButtonText: t('commoncomponents.banner.button.dismiss', 'Dismiss'),
            tooLongErrorMessage: t(
              'commoncomponents.banner.tooLongErrorMessage',
              // eslint-disable-next-line max-len
              'Detailed error message is too long to be displayed. To read it, please use the COPY button and paste it in your favorite text editor.'
            ),
            secondButtonText: t('commoncomponents.banner.button.copy.label', 'Copy'),
            toggledButtonText: t('commoncomponents.banner.button.copy.copied', 'Copied'),
          }}
          clearErrors={clearApplicationErrorMessage}
        />
        <Outlet />
      </Box>
    </>
  ) : null;
};

TabLayout.propTypes = {
  tabs: PropTypes.array.isRequired,
};
