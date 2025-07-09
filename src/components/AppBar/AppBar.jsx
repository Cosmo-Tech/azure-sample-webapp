// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { HelpMenuWrapper, Logo, ThemeSwitch, UserInfoWrapper, WorkspaceInfo } from './components';

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
    <MuiAppBar position="sticky" className={classes.appBar}>
      <Toolbar variant="dense" disableGutters={true}>
        <WorkspaceInfo />
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
