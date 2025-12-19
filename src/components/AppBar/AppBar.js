// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Bot, Languages } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { StatusBar } from '../';

export const AppBar = ({ children, currentScenario }) => {
  return (
    <MuiAppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => theme.palette.background.background01.main,
        color: (theme) => theme.palette.neutral.neutral02.main,
        boxShadow: 'none',
        borderBottom: (theme) => `1px solid ${theme.palette.background.background02.main}`,
      }}
    >
      <Toolbar variant="dense" disableGutters={true} sx={{ px: 1 }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>{children}</div>
        {currentScenario?.data?.name && (
          <StatusBar status="valid" size="medium" tooltip="This scenario has not been run yet." />
        )}
        <Button sx={{ ml: 1 }} variant="copilot" state="enabled" startIcon={<Bot />}>
          CoPilot
        </Button>
        <Button
          sx={{ ml: 1, backgroundColor: (theme) => theme.palette.neutral.neutral04.main }}
          variant="default"
          state="enabled"
          startIcon={<Languages />}
        >
          English
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  children: PropTypes.node,
  currentScenario: PropTypes.object,
};
