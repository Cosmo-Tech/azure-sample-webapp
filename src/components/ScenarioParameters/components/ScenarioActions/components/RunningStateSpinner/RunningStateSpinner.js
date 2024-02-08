// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { SCENARIO_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { useCurrentScenarioState } from '../../../../../../state/hooks/ScenarioHooks';

export const RunningStateSpinner = () => {
  const { t } = useTranslation();
  const currentScenarioState = useCurrentScenarioState();

  const isCurrentScenarioRunning =
    currentScenarioState === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioState === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;

  return isCurrentScenarioRunning ? (
    <Grid item>
      <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
        <CircularProgress color="inherit" size={16} data-cy="running-state-spinner" />
        <Typography variant="body1" data-cy="running-state-label">
          {currentScenarioState === SCENARIO_RUN_STATE.RUNNING
            ? t('commoncomponents.scenariomanager.treelist.node.status.running', 'Running')
            : t(
                'commoncomponents.scenariomanager.treelist.node.status.dataingestioninprogress',
                'Transferring results'
              )}
        </Typography>
      </Stack>
    </Grid>
  ) : null;
};
