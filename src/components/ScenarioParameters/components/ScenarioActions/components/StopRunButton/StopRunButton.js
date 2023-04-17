// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CancelIcon from '@mui/icons-material/Cancel';
import { useStopScenarioRun } from '../../../../../../state/hooks/ScenarioRunHooks';
import {
  useCurrentScenarioId,
  useCurrentScenarioLastRunId,
  useCurrentScenarioState,
} from '../../../../../../state/hooks/ScenarioHooks';
import { SCENARIO_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { TwoActionsDialogService } from '../../../../../../services/twoActionsDialog/twoActionsDialogService';

export const StopRunButton = () => {
  const currentScenarioId = useCurrentScenarioId();
  const currentScenarioState = useCurrentScenarioState();
  const currentScenarioLastRunId = useCurrentScenarioLastRunId();
  const stopScenarioRun = useStopScenarioRun();
  const { t } = useTranslation();
  const isCurrentScenarioRunning =
    currentScenarioState === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioState === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;

  const askStopRunConfirmation = useCallback(
    async (event) => {
      event.stopPropagation();
      const dialogProps = {
        id: 'cancel-run',
        labels: {
          title: t('genericcomponent.dialog.scenario.stopRun.title', 'Abort simulation run?'),
          body: t(
            'genericcomponent.dialog.scenario.stopRun.body',
            'If you abort the simulation, its status will become Failed.' +
              "\nNote: previous results are already lost and won't be displayed anymore."
          ),
          button1: t('genericcomponent.dialog.scenario.stopRun.button.cancel', 'Cancel'),
          button2: t('genericcomponent.dialog.scenario.stopRun.button.stop', 'Abort'),
        },
        dialogProps: {
          style: { whiteSpace: 'pre-line' },
        },
        button2Props: {
          color: 'error',
        },
      };
      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) stopScenarioRun(currentScenarioLastRunId, currentScenarioId);
    },
    [currentScenarioId, currentScenarioLastRunId, stopScenarioRun, t]
  );

  useEffect(() => {
    if (!isCurrentScenarioRunning && TwoActionsDialogService.openedDialogId === 'cancel-run') {
      TwoActionsDialogService.closeDialog();
    }
  }, [isCurrentScenarioRunning]);

  return isCurrentScenarioRunning ? (
    <Grid item>
      <Button
        data-cy="stop-scenario-run-button"
        color="error"
        variant="contained"
        startIcon={<CancelIcon />}
        onClick={askStopRunConfirmation}
      >
        {t('commoncomponents.button.scenario.parameters.cancel', 'Abort')}
      </Button>
    </Grid>
  ) : null;
};
