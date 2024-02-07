// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Grid } from '@mui/material';
import { PermissionsGate } from '@cosmotech/ui';
import { useUpdateParameters } from '../../../../../../hooks/ScenarioParametersHooks';
import { useUserAppAndCurrentScenarioPermissions } from '../../../../../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { useSetApplicationErrorMessage } from '../../../../../../state/hooks/ApplicationHooks';
import { useCurrentScenarioId, useSaveScenario } from '../../../../../../state/hooks/ScenarioHooks';

export const SaveButton = () => {
  const { t } = useTranslation();
  const { isDirty, errors } = useFormState();
  const isValid = Object.keys(errors || {}).length === 0;
  const currentScenarioId = useCurrentScenarioId();
  const saveScenario = useSaveScenario();
  const { processFilesToUpload, getParametersToUpdate } = useUpdateParameters();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const saveScenarioParameters = useCallback(
    async (event) => {
      event.stopPropagation();
      const error = await processFilesToUpload();
      if (error == null) {
        saveScenario(currentScenarioId, getParametersToUpdate());
      } else {
        setApplicationErrorMessage(
          error,
          t(
            'commoncomponents.banner.datasetUpdate',
            "A problem occurred during dataset update; your new parameters haven't been saved."
          )
        );
      }
    },
    [currentScenarioId, getParametersToUpdate, processFilesToUpload, saveScenario, t, setApplicationErrorMessage]
  );

  return isDirty ? (
    <PermissionsGate
      userPermissions={userAppAndCurrentScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
    >
      <Grid item>
        <Button data-cy="save-button" startIcon={<SaveIcon />} onClick={saveScenarioParameters} disabled={!isValid}>
          {t('commoncomponents.button.scenario.parameters.save', 'SAVE')}
        </Button>
      </Grid>
    </PermissionsGate>
  ) : null;
};
