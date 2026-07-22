// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import { TwoActionsDialogService } from '../../../services/twoActionsDialog/twoActionsDialogService';
import { useDeleteRunnerBatch, useGetRunnerById } from '../../../state/runner/hooks';

export const useDeleteScenarioBatchButton = () => {
  const { t } = useTranslation();
  const deleteScenarios = useDeleteRunnerBatch();
  const getRunnerById = useGetRunnerById();

  const askConfirmationToDeleteDialog = useCallback(
    async (event, runnerIdsToDelete) => {
      event.stopPropagation();
      const scenariosCount = runnerIdsToDelete?.length ?? 0;
      if (scenariosCount === 0) return;

      const body = (
        <Stack spacing={1.5}>
          <Typography data-cy="scenario-delete-dialog-body" variant="h6">
            {t(
              'commoncomponents.scenariomanager.dialog.delete.body',
              'Do you really want to delete the scenarios listed below? This action is irreversible.'
            )}
          </Typography>
          <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 3, maxHeight: 200, overflowY: 'auto' }}>
            {runnerIdsToDelete.map((runnerId) => {
              const runnerName = getRunnerById(runnerId)?.name;
              return (
                <Typography
                  key={runnerId}
                  component="li"
                  data-cy={`scenario-delete-dialog-body-list-item-${runnerId}`}
                  variant="body2"
                >
                  {runnerName}
                </Typography>
              );
            })}
          </Stack>
        </Stack>
      );

      const dialogProps = {
        id: 'delete-scenarios',
        dialogProps: {
          maxWidth: null, // Override defailt maxWidth of the @cosmotech/ui package component
          fullWidth: false, // Override defailt fullWidth of the @cosmotech/ui package component
        },
        component: 'div',
        labels: {
          title: t('commoncomponents.scenariomanager.dialog.delete.title', 'Delete scenarios?', {
            count: scenariosCount,
          }),
          body,
          button1: t('commoncomponents.scenariomanager.dialog.delete.cancelButton', 'Cancel'),
          button2: t('commoncomponents.scenariomanager.dialog.delete.confirmButton', 'Delete'),
        },
        button2Props: { color: 'error' },
      };

      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) deleteScenarios(runnerIdsToDelete);
    },
    [t, deleteScenarios, getRunnerById]
  );

  return { askConfirmationToDeleteDialog };
};
