// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { React, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { TwoActionsDialogService } from '../../../../services/twoActionsDialog/twoActionsDialogService';
import { useDeleteCurrentScenarioButton } from './DeleteCurrentScenarioButtonHooks';

const DeleteCurrentScenarioButton = () => {
  const { t } = useTranslation();
  const { deleteScenario, currentScenario, currentScenarioLastRunStatus } = useDeleteCurrentScenarioButton();

  const isDisabled = currentScenarioLastRunStatus === RUNNER_RUN_STATE.RUNNING;

  const askConfirmationToDeleteDialog = useCallback(
    async (event) => {
      event.stopPropagation();
      const dialogProps = {
        id: 'delete-scenario',
        component: 'div',
        labels: {
          title: t('views.scenario.dialogs.delete.title', 'Delete scenario?'),
          body: (
            <Trans
              i18nKey="views.scenario.dialogs.delete.body"
              defaultValue="Do you really want to delete <i>{{scenarioName}}</i>? This action is irreversible."
              values={{ scenarioName: currentScenario?.name }}
              shouldUnescape
            />
          ),
          button1: t('views.scenario.dialogs.delete.cancelButton', 'Cancel'),
          button2: t('views.scenario.dialogs.delete.confirmButton', 'Delete'),
        },
        button2Props: {
          color: 'error',
        },
      };

      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) {
        if (currentScenario?.id) deleteScenario(currentScenario.id);
        else console.warn('Cannot delete current scenario, missing id in the scenario object.');
      }
    },
    [t, currentScenario, deleteScenario]
  );

  if (!currentScenario) return null;

  const userPermissionsOnCurrentScenario = currentScenario.security?.currentUserPermissions ?? [];
  return (
    <PermissionsGate
      userPermissions={userPermissionsOnCurrentScenario}
      necessaryPermissions={[ACL_PERMISSIONS.RUNNER.DELETE]}
    >
      <FadingTooltip title={t('views.scenario.dialogs.delete.buttonTooltip', 'Delete')} disableInteractive>
        <IconButton
          sx={{ color: (theme) => theme.palette.error.main }}
          onClick={askConfirmationToDeleteDialog}
          data-cy="scenario-delete-button"
          disabled={isDisabled}
        >
          <DeleteForeverIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </FadingTooltip>
    </PermissionsGate>
  );
};

export default DeleteCurrentScenarioButton;
