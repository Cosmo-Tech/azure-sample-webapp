// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { StatusBar } from '../';
import { ThemeSwitch } from './components';

export const AppBar = ({ children, currentScenario }) => {
  return (
    <MuiAppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => theme.palette.appbar.main,
        color: (theme) => theme.palette.appbar.contrastText,
      }}
    >
      <Toolbar variant="dense" disableGutters={true} sx={{ px: 1, gap: 3 }}>
        <Box sx={{ width: '70%', display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>{children}</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'flex-end' }}>
          {currentScenario?.data?.name && (
            <StatusBar status="valid" size="medium" tooltip="This scenario has not been run yet." />
          )}
          <Button sx={{ ml: 1 }} variant="copilot" state="enabled" startIcon={<Bot />}>
            CoPilot
          </Button>
          <ThemeSwitch />
          <Button
            sx={{ ml: 1, backgroundColor: (theme) => theme.palette.neutral.neutral04.main }}
            variant="default"
            state="enabled"
            startIcon={<Languages />}
          >
            English
          </Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  /**
   * React component to be implemented in dynamic part of the app bar
   */
  children: PropTypes.node,
  currentScenario: PropTypes.object,
};
