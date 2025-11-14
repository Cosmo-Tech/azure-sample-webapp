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
import DatasetService from '../../../../../../services/dataset/DatasetService';
import { useSetApplicationErrorMessage } from '../../../../../../state/app/hooks';
import { dispatchUpdateDatasetPart } from '../../../../../../state/datasets/dispatchers';
import { useOrganizationId } from '../../../../../../state/organizations/hooks';
import { useCurrentSimulationRunnerData, useUpdateSimulationRunner } from '../../../../../../state/runner/hooks';
import { useWorkspaceId } from '../../../../../../state/workspaces/hooks';

export const SaveButton = () => {
  const { t } = useTranslation();
  const { isDirty, errors } = useFormState();
  const isValid = Object.keys(errors || {}).length === 0;
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const currentScenario = useCurrentSimulationRunnerData();
  const saveScenario = useUpdateSimulationRunner();
  const { processFilesToUpload, getParametersToUpdate } = useUpdateParameters();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const saveScenarioParameters = useCallback(
    async (event) => {
      event.stopPropagation();
      const error = await processFilesToUpload();
      if (error != null) {
        console.error(error);
        setApplicationErrorMessage(
          error,
          t(
            'commoncomponents.banner.datasetUpdate',
            "A problem occurred during dataset update; your new parameters haven't been saved."
          )
        );
        return;
      }

      const runnerParameterDatasetId = currentScenario.datasets?.parameter;
      const parameters = getParametersToUpdate();
      saveScenario(currentScenario.id, parameters.nonDatasetParts);

      const createdParts = [];
      for (const parameter of parameters.fileDatasetParts) {
        const createdDatasetPart = await DatasetService.createDatasetPart(
          organizationId,
          workspaceId,
          runnerParameterDatasetId,
          parameter.value.part,
          parameter.value.file
        );
        dispatchUpdateDatasetPart(runnerParameterDatasetId, createdDatasetPart);
        createdParts.push(createdDatasetPart);
      }
    },
    [
      organizationId,
      workspaceId,
      currentScenario,
      getParametersToUpdate,
      processFilesToUpload,
      saveScenario,
      t,
      setApplicationErrorMessage,
    ]
  );

  return isDirty ? (
    <PermissionsGate
      userPermissions={userAppAndCurrentScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
    >
      <Grid>
        <Button data-cy="save-button" startIcon={<SaveIcon />} onClick={saveScenarioParameters} disabled={!isValid}>
          {t('commoncomponents.button.scenario.parameters.save', 'SAVE')}
        </Button>
      </Grid>
    </PermissionsGate>
  ) : null;
};
