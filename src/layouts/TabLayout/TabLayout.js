// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Tabs as MuiTabs, Tab, Box, makeStyles } from '@material-ui/core';
import { Link, useLocation, useMatch, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorBanner } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import { AppBar } from '../../components/AppBar';

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

const TabLayout = (props) => {
  const classes = useStyles();
  const { tabs, error, clearApplicationErrorMessage } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const currentTabPathname = location?.pathname;
  const scenarioViewUrl = useMatch('/scenario/:id');

  const viewTabs = (
    <MuiTabs value={currentTabPathname}>
      {tabs.map((tab) => (
        <Tab
          data-cy={tab.key}
          key={tab.key}
          value={scenarioViewUrl != null && tab.to === '/scenario' ? scenarioViewUrl.pathname : tab.to}
          label={t(tab.label, tab.key)}
          component={Link}
          to={tab.to}
        />
      ))}
    </MuiTabs>
  );
  return (
    <>
      <AppBar>{viewTabs}</AppBar>
      <Box className={classes.content}>
        {error && (
          <ErrorBanner
            error={error}
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
  userName: PropTypes.string.isRequired,
  userProfilePic: PropTypes.string.isRequired,
  error: PropTypes.object,
  clearApplicationErrorMessage: PropTypes.func.isRequired,
  setApplicationTheme: PropTypes.func.isRequired,
};

export default TabLayout;
