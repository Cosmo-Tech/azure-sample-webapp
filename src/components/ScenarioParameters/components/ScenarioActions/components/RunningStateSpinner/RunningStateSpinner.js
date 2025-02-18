// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { RUNNER_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { useCurrentSimulationRunnerState } from '../../../../../../state/runner/hooks';

export const RunningStateSpinner = () => {
  const { t } = useTranslation();
  const currentScenarioState = useCurrentSimulationRunnerState();

  const isCurrentScenarioRunning = currentScenarioState === RUNNER_RUN_STATE.RUNNING;
  return isCurrentScenarioRunning ? (
    <Grid>
      <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
        <CircularProgress color="inherit" size={16} data-cy="running-state-spinner" />
        <Typography variant="body1" data-cy="running-state-label">
          {t('commoncomponents.scenariomanager.treelist.node.status.running', 'Running')}
        </Typography>
      </Stack>
    </Grid>
  ) : null;
};
