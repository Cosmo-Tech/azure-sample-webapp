// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { AppBar as MuiAppBar, makeStyles, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { HelpMenuWrapper, HomeButton, Logo, ThemeSwitch, UserInfoWrapper } from './components';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.appbar.main,
    color: theme.palette.appbar.contrastText,
  },
  children: {
    flexGrow: 1,
  },
}));
export const AppBar = ({ children }) => {
  const classes = useStyles();
  return (
    <MuiAppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense" disableGutters={true}>
        <HomeButton />
        <div className={classes.children}>{children}</div>
        <ThemeSwitch />
        <HelpMenuWrapper />
        <UserInfoWrapper />
        <Logo />
      </Toolbar>
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  /**
   * React component to be implemented in dynamic part of the app bar
   */
  children: PropTypes.node,
};
