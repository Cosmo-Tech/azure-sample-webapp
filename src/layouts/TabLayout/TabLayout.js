// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Box, Toolbar, IconButton, makeStyles } from '@material-ui/core';
import { Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Auth } from '@cosmotech/core';
import { PrivateRoute, UserInfo, HelpMenu, ErrorBanner } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../config/Languages';
import { SUPPORT_URL, DOCUMENTATION_URL } from '../../config/HelpMenuConfiguration';
import { About } from '../../services/config/Menu';
import { Brightness2 as Brightness2Icon, WbSunny as WbSunnyIcon } from '@material-ui/icons';
import { pictureDark, pictureLight } from '../../theme/';

const useStyles = makeStyles((theme) => ({
  content: {
    height: 'calc(100% - 48px)',
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    boxSizing: 'border-box',
  },
  tabs: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.appbar.main,
    color: theme.palette.appbar.contrastText,
  },
  switchToDarkTheme: {
    color: theme.palette.appbar.contrastText,
  },
  logo: {
    marginLeft: '8px',
    marginRight: '8px',
  },
}));

const TabLayout = (props) => {
  const classes = useStyles();
  const {
    tabs,
    authenticated,
    authorized,
    signInPath,
    unauthorizedPath,
    error,
    clearApplicationErrorMessage,
    setApplicationTheme,
  } = props;
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const userInfoLabels = {
    language: t('genericcomponent.userinfo.button.change.language'),
    logOut: t('genericcomponent.userinfo.button.logout'),
  };
  const helpLabels = {
    documentation: t('genericcomponent.helpmenu.documentation'),
    support: t('genericcomponent.helpmenu.support'),
    aboutTitle: t('genericcomponent.helpmenu.about'),
    close: t('genericcomponent.dialog.about.button.close'),
  };

  // Add theme light/dark status in state
  const [darkThemeUsed, setDarkThemeUsed] = useState(localStorage.getItem('darkThemeUsed') === 'true');

  useEffect(() => {
    localStorage.setItem('darkThemeUsed', darkThemeUsed);
  }, [darkThemeUsed]);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense" disableGutters={true}>
          <Tabs value={location.pathname} className={classes.tabs}>
            {tabs.map((tab) => (
              <Tab
                data-cy={tab.key}
                key={tab.key}
                value={tab.to}
                label={t(tab.label, tab.key)}
                component={Link}
                to={tab.to}
                className={classes.tab}
              />
            ))}
          </Tabs>
          {
            <IconButton
              className={classes.switchToDarkTheme}
              onClick={() => {
                setDarkThemeUsed(!darkThemeUsed);
                setApplicationTheme(!darkThemeUsed);
              }}
            >
              {darkThemeUsed ? <WbSunnyIcon /> : <Brightness2Icon />}
            </IconButton>
          }
          <HelpMenu
            documentationUrl={DOCUMENTATION_URL}
            supportUrl={SUPPORT_URL}
            about={About ? <About /> : null}
            labels={helpLabels}
          />
          <UserInfo
            languages={LANGUAGES}
            changeLanguage={(lang) => i18n.changeLanguage(lang)}
            language={i18n.language}
            labels={userInfoLabels}
            userName={props.userName}
            profilePlaceholder={props.userProfilePic ? props.userProfilePic : undefined}
            onLogout={Auth.signOut}
          />
          <img
            alt="Cosmo Tech"
            height="28px"
            // AppBar always has a dark background, use the theme dark logo
            src={darkThemeUsed ? pictureDark.darkLogo : pictureLight.darkLogo}
            className={classes.logo}
          />
        </Toolbar>
      </AppBar>
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
        <Switch>
          {tabs.map((tab) => (
            <PrivateRoute
              key={tab.key}
              path={tab.to}
              render={tab.render}
              authenticated={authenticated}
              authorized={authorized}
              noAuthRedirect={signInPath}
              noPermRedirect={unauthorizedPath}
            />
          ))}
          <Route render={() => <Redirect to="/scenario" />} />
        </Switch>
      </Box>
    </>
  );
};

TabLayout.propTypes = {
  tabs: PropTypes.array.isRequired,
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool.isRequired,
  signInPath: PropTypes.string.isRequired,
  unauthorizedPath: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userProfilePic: PropTypes.string.isRequired,
  error: PropTypes.object,
  clearApplicationErrorMessage: PropTypes.func.isRequired,
  setApplicationTheme: PropTypes.func.isRequired,
};

export default TabLayout;
