// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTranslation } from 'react-i18next';
import { useFormState } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import {
  useCurrentScenarioId,
  useCurrentScenarioState,
  useLaunchScenario,
  useSaveAndLaunchScenario,
} from '../../../../../../state/hooks/ScenarioHooks';
import { SCENARIO_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { useUserAppAndCurrentScenarioPermissions } from '../../../../../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { PermissionsGate } from '@cosmotech/ui';
import { useUpdateParameters } from '../../../../../../hooks/ScenarioParametersHooks';

export const LaunchButton = () => {
  const { t } = useTranslation();
  const { isDirty, errors } = useFormState();
  const isValid = Object.keys(errors || {}).length === 0;
  const { processFilesToUpload, getParametersToUpdate, forceUpdate } = useUpdateParameters();
  const saveAndLaunchScenario = useSaveAndLaunchScenario();
  const currentScenarioId = useCurrentScenarioId();
  const currentScenarioState = useCurrentScenarioState();
  const launchScenario = useLaunchScenario();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const isCurrentScenarioRunning =
    currentScenarioState === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioState === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;

  const launchCurrentScenario = useCallback(
    async (event) => {
      event.stopPropagation();
      if (isDirty || forceUpdate) {
        await processFilesToUpload();
        saveAndLaunchScenario(currentScenarioId, getParametersToUpdate());
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
    ]
  );
  return !isCurrentScenarioRunning ? (
    <PermissionsGate
      userPermissions={userAppAndCurrentScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
    >
      <Grid item>
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
