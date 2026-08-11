// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { useDeleteScenarioBatchButton } from './DeleteScenarioBatchButtonHook';

export const DeleteScenarioBatchButton = ({ runnerIdsToDelete }) => {
  const { t } = useTranslation();
  const { askConfirmationToDeleteDialog } = useDeleteScenarioBatchButton();

  const { isDisabled, buttonLabel } = useMemo(() => {
    const isDisabled = runnerIdsToDelete?.length === 0;
    const scenarioCountLabel = runnerIdsToDelete?.length === 0 ? '' : ` (${runnerIdsToDelete.length})`;
    const buttonLabel = t('commoncomponents.scenariomanager.dialog.delete.button', 'Delete') + scenarioCountLabel;
    return { isDisabled, buttonLabel };
  }, [t, runnerIdsToDelete]);

  return (
    <FadingTooltip
      title={t('commoncomponents.scenariomanager.dialog.delete.buttonTooltip', 'Delete scenarios')}
      disableInteractive
    >
      <Button
        data-cy="delete-scenario-batch-button"
        variant="contained"
        startIcon={<DeleteForeverIcon />}
        onClick={(event) => askConfirmationToDeleteDialog(event, runnerIdsToDelete)}
        disabled={isDisabled}
        color="error"
      >
        {buttonLabel}
      </Button>
    </FadingTooltip>
  );
};

DeleteScenarioBatchButton.propTypes = {
  runnerIdsToDelete: PropTypes.array,
};
