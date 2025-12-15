// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { HelpMenuWrapper, Logo, ThemeSwitch, UserInfoWrapper, WorkspaceInfo } from './components';

export const AppBar = ({ children }) => {
  return (
    <MuiAppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => theme.palette.appbar.main,
        color: (theme) => theme.palette.appbar.contrastText,
      }}
    >
      <Toolbar variant="dense" disableGutters>
        <WorkspaceInfo />
        <div style={{ flexGrow: 1 }}>{children}</div>
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
