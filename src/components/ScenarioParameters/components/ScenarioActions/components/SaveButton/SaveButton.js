// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { Button, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { useFormState } from 'react-hook-form';
import { useCurrentScenarioId, useSaveScenario } from '../../../../../../state/hooks/ScenarioHooks';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { PermissionsGate } from '@cosmotech/ui';
import { useUserAppAndCurrentScenarioPermissions } from '../../../../../../hooks/SecurityHooks';
import { useUpdateParameters } from '../../../../../../hooks/ScenarioParametersHooks';

export const SaveButton = () => {
  const { t } = useTranslation();
  const { isDirty, errors } = useFormState();
  const isValid = Object.keys(errors || {}).length === 0;
  const currentScenarioId = useCurrentScenarioId();
  const saveScenario = useSaveScenario();
  const { processFilesToUpload, getParametersToUpdate } = useUpdateParameters();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const saveScenarioParameters = useCallback(
    async (event) => {
      event.stopPropagation();
      await processFilesToUpload();
      saveScenario(currentScenarioId, getParametersToUpdate());
    },
    [currentScenarioId, getParametersToUpdate, processFilesToUpload, saveScenario]
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
