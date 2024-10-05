// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Button, Grid2 as Grid } from '@mui/material';
import { PermissionsGate } from '@cosmotech/ui';
import { useUpdateParameters } from '../../../../../../hooks/ScenarioParametersHooks';
import { useUserAppAndCurrentScenarioPermissions } from '../../../../../../hooks/SecurityHooks';
import { RUNNER_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { useSetApplicationErrorMessage } from '../../../../../../state/hooks/ApplicationHooks';
import {
  useCurrentSimulationRunnerId,
  useCurrentSimulationRunnerState,
  useStartRunner,
  useUpdateAndStartRunner,
} from '../../../../../../state/hooks/RunnerHooks';

export const LaunchButton = () => {
  const { t } = useTranslation();
  const { isDirty, errors } = useFormState();
  const isValid = Object.keys(errors || {}).length === 0;
  const { processFilesToUpload, getParametersToUpdate, forceUpdate } = useUpdateParameters();
  const saveAndLaunchScenario = useUpdateAndStartRunner();
  const currentScenarioId = useCurrentSimulationRunnerId();
  const currentScenarioState = useCurrentSimulationRunnerState();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  const launchScenario = useStartRunner();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const isCurrentScenarioRunning = currentScenarioState === RUNNER_RUN_STATE.RUNNING;
  const launchCurrentScenario = useCallback(
    async (event) => {
      event.stopPropagation();
      if (isDirty || forceUpdate) {
        const error = await processFilesToUpload();
        if (error == null) {
          saveAndLaunchScenario(currentScenarioId, getParametersToUpdate());
        } else {
          setApplicationErrorMessage(
            error,
            t(
              'commoncomponents.banner.incompleteRun',
              // eslint-disable-next-line max-len
              "A problem occurred during dataset update; new parameters haven't been saved and launch has been canceled."
            )
          );
        }
      } else {
        launchScenario(currentScenarioId);
      }
    },
    [
      currentScenarioId,
      forceUpdate,
      getParametersToUpdate,
      isDirty,
      launchScenario,
      processFilesToUpload,
      saveAndLaunchScenario,
      t,
      setApplicationErrorMessage,
    ]
  );
  return !isCurrentScenarioRunning ? (
    <PermissionsGate
      userPermissions={userAppAndCurrentScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
    >
      <Grid>
        <Button
          data-cy="launch-scenario-button"
          variant="contained"
          startIcon={<PlayCircleOutlineIcon />}
          onClick={launchCurrentScenario}
          disabled={!isValid}
        >
          {isDirty ? (
            <span data-cy="save-and-launch-label">
              {t('commoncomponents.button.scenario.parameters.update.launch', 'SAVE AND LAUNCH')}
            </span>
          ) : (
            <span data-cy="launch-label">{t('commoncomponents.button.scenario.parameters.launch', 'LAUNCH')}</span>
          )}
        </Button>
      </Grid>
    </PermissionsGate>
  ) : null;
};
