// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Tabs as MuiTabs, Tab, Box, makeStyles } from '@material-ui/core';
import { Link, useLocation, useMatch, Outlet, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorBanner } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import { AppBar } from '../../components/AppBar';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { DashboardsManager } from '../../managers';

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
  const applicationError = useApplicationError();
  const clearApplicationErrorMessage = useClearApplicationErrorMessage();
  const routerParameters = useParams();
  sessionStorage.removeItem('providedUrlBeforeSignIn');

  const viewTabs = (
    <MuiTabs value={currentTabPathname}>
      {tabs.map((tab) => (
        <Tab
          data-cy={tab.key}
          key={tab.key}
          value={
            (tab.to === 'scenario' && scenarioViewUrl?.pathname) ||
            (tab.to === 'instance' && instanceViewUrl?.pathname) ||
            `/${routerParameters.workspaceId}/${tab.to}`
          }
          label={t(tab.label, tab.key)}
          component={Link}
          to={tab.to}
        />
      ))}
    </MuiTabs>
  );

  return (
    <>
      <DashboardsManager />
      <AppBar>{viewTabs}</AppBar>
      <Box className={classes.content}>
        {applicationError && (
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
        )}
        <Outlet />
      </Box>
    </>
  );
};

TabLayout.propTypes = {
  tabs: PropTypes.array.isRequired,
};
