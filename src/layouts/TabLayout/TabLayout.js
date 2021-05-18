// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { PrivateRoute } from '../../components';
import { Auth } from '@cosmotech/core';
import { UserInfo } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import { applicationLanguages } from '../../configs/App.config';

const useStyles = makeStyles((theme) => ({
  content: {
    height: 'calc(100% - 36px)', // footer height = 36px
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    boxSizing: 'border-box'
  },
  logo: {
    display: 'block'
  },
  bar: {
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 2px 2px 0px rgba(0,0,0,0.6)'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`
  },
  rightBarElement: {
    display: 'block',
    margin: `0 ${theme.spacing(1)}px`
  },
  tabs: {
    width: '100%',
    maxWidth: '900px'
  },
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '15px',
    textAlign: 'center',
    flexGrow: 1,
    opacity: 1,
    color: theme.palette.text.grey,
    '&.Mui-selected': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText
    }
  },
  barDiv: {
    minHeight: '48px',
    display: 'flex',
    justifyContent: 'space-between'
  }
}
));

const TabLayout = props => {
  const {
    tabs, authenticated, authorized, signInPath,
    unauthorizedPath
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const location = useLocation();

  return (<>
          <AppBar className={classes.bar}>
            <Box className={classes.barDiv}>
              <Tabs value={location.pathname} className={classes.tabs}>
                {tabs.map(tab => (
                    <Tab key={tab.key} value={tab.to} label= {t(tab.label, tab.key)} component={Link} to={tab.to} className={classes.tab}/>
                ))}
              </Tabs>
              <div className={classes.rightBar}>
                <div className={classes.rightBarElement}>
                  <UserInfo documentationUrl="doc.pdf" languages={applicationLanguages}
                    userName={props.userName}
                    profilePictureUrl={props.userProfilePic}
                    onLogout={Auth.signOut}
                  />
                </div>
                <div className={classes.rightBarElement}>
                  <img alt="Cosmo Tech" height="28px" src="cosmotech.png" className={classes.logo} />
                </div>
              </div>
            </Box>
          </AppBar>
          <Box className={classes.content}>
            <Switch>
              {tabs.map(tab => (
                  <PrivateRoute key={tab.key} path={tab.to} render={tab.render}
                                authenticated={authenticated}
                                authorized={authorized}
                                noAuthRedirect={signInPath}
                                noPermRedirect={unauthorizedPath} />
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
  userProfilePic: PropTypes.string.isRequired
};

export default TabLayout;
