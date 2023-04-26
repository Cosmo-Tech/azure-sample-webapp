// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { DiscardChangesButton, StopRunButton, SaveButton, LaunchButton } from './components';
import { Grid } from '@mui/material';

export const ScenarioActions = () => {
  return (
    <Grid container spacing={1} alignItems="center">
      <StopRunButton />
      <DiscardChangesButton />
      <SaveButton />
      <LaunchButton />
    </Grid>
  );
};
