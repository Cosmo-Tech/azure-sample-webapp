import { React, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { TwoActionsDialogService } from '../../../../services/twoActionsDialog/twoActionsDialogService';
import { useDeleteDatasetButton } from './DeleteDatasetButtonHooks';

export const DeleteDatasetButton = ({ dataset, location }) => {
  const isDisabled = !dataset || dataset.ingestionStatus === INGESTION_STATUS.PENDING;
  const { t } = useTranslation();

  const { deleteDataset, isDatasetCopyEnabledInWorkspace } = useDeleteDatasetButton();
  const askConfirmationToDeleteDialog = useCallback(
    async (event, dataset) => {
      event.stopPropagation();
      const impactedScenariosWarning = isDatasetCopyEnabledInWorkspace
        ? ''
        : ' ' + // Space character is here on purpose, to separate concatenated sentences in confirmation dialog body
          t(
            'commoncomponents.datasetmanager.dialogs.delete.impactedScenariosWarning',
            'All the scenarios using this dataset will be impacted.'
          );

      const dialogProps = {
        id: 'delete-dataset',
        component: 'div',
        labels: {
          title: t('commoncomponents.datasetmanager.dialogs.delete.title', 'Delete dataset?'),
          body: (
            <Trans
              i18nKey="commoncomponents.datasetmanager.dialogs.delete.body"
              defaultValue="Do you really want to delete <i>{{datasetName}}</i>?
              This action is irreversible.{{impactedScenariosWarning}}"
              values={{ datasetName: dataset?.name, impactedScenariosWarning }}
              shouldUnescape={true}
            />
          ),
          button1: t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel'),
          button2: t('commoncomponents.datasetmanager.dialogs.delete.confirmButton', 'Delete'),
        },
        button2Props: {
          color: 'error',
        },
      };
      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) {
        deleteDataset(dataset?.id);
      }
    },
    [t, deleteDataset, isDatasetCopyEnabledInWorkspace]
  );

  const userPermissionsOnDataset = dataset?.security?.currentUserPermissions ?? [];
  return (
    <PermissionsGate userPermissions={userPermissionsOnDataset} necessaryPermissions={[ACL_PERMISSIONS.DATASET.DELETE]}>
      <FadingTooltip
        title={t('commoncomponents.datasetmanager.overview.actions.deleteButtonTooltip', 'Delete')}
        disableInteractive={true}
      >
        <IconButton
          onClick={(event) => askConfirmationToDeleteDialog(event, dataset)}
          data-cy={`${location}dataset-delete-button-${dataset?.id}`}
          disabled={isDisabled}
        >
          <DeleteForeverIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </FadingTooltip>
    </PermissionsGate>
  );
};

DeleteDatasetButton.propTypes = {
  dataset: PropTypes.object.isRequired,
  location: PropTypes.string,
};
DeleteDatasetButton.defaultProps = {
  location: '',
};
