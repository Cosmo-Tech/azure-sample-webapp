// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, Grid } from '@mui/material';
import rfdc from 'rfdc';
import { PermissionsGate } from '@cosmotech/ui';
import { useUserAppAndCurrentScenarioPermissions } from '../../../../../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { TwoActionsDialogService } from '../../../../../../services/twoActionsDialog/twoActionsDialogService';
import { useScenarioResetValues } from '../../../../ScenarioParametersContext';

const clone = rfdc();
export const DiscardChangesButton = () => {
  const { t } = useTranslation();
  const { reset } = useFormContext();
  /* eslint-disable-next-line no-unused-vars -- "errors" is unused here because RHF seems to return a stale state
  sometimes for isDirty, adding a dependency to "errors" seems to fix the issue (bug only encountered in cypress tests
  so far) */
  const { isDirty, errors: _ } = useFormState();
  const scenarioResetValues = useScenarioResetValues();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const askDiscardConfirmation = useCallback(
    async (event) => {
      event.stopPropagation();
      const dialogProps = {
        id: 'discard-changes',
        labels: {
          title: t('genericcomponent.dialog.scenario.parameters.title'),
          body: t('genericcomponent.dialog.scenario.parameters.body'),
          button1: t('genericcomponent.dialog.scenario.parameters.button.cancel'),
          button2: t('genericcomponent.dialog.scenario.parameters.button.validate'),
        },
      };
      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) reset(clone(scenarioResetValues));
    },
    [reset, scenarioResetValues, t]
  );

  return isDirty ? (
    <PermissionsGate
      userPermissions={userAppAndCurrentScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
    >
      <Grid>
        <Button data-cy="discard-button" startIcon={<CancelIcon />} onClick={askDiscardConfirmation}>
          {t('commoncomponents.button.scenario.parameters.discard', 'DISCARD')}
        </Button>
      </Grid>
    </PermissionsGate>
  ) : null;
};
