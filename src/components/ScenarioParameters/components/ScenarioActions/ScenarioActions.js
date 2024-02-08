// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Grid } from '@mui/material';
import { DiscardChangesButton, StopRunButton, SaveButton, LaunchButton, RunningStateSpinner } from './components';

export const ScenarioActions = () => {
  return (
    <Grid container spacing={1} alignItems="center">
      <RunningStateSpinner />
      <StopRunButton />
      <DiscardChangesButton />
      <SaveButton />
      <LaunchButton />
    </Grid>
  );
};
