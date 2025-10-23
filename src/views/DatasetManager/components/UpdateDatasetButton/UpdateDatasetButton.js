// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { React, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { useGetETLRunners } from '../../../../state/runner/hooks';
import { UpdateDatasetDialog } from './components';

export const UpdateDatasetButton = ({ dataset }) => {
  const { t } = useTranslation();
  const runners = useGetETLRunners();
  const datasetRunner = runners.find((runner) => runner?.id === dataset.createInfo.runnerId);
  const isDisabled =
    dataset?.ingestionStatus === INGESTION_STATUS.PENDING || Object.keys(datasetRunner ?? {})?.length === 0;
  const [isUpdateDatasetDialogOpen, setIsUpdateDatasetDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setIsUpdateDatasetDialogOpen(false), []);
  const userPermissionsOnDataset = dataset?.security?.currentUserPermissions ?? [];

  return (
    <>
      <PermissionsGate
        userPermissions={userPermissionsOnDataset}
        necessaryPermissions={[ACL_PERMISSIONS.DATASET.WRITE]}
      >
        <FadingTooltip
          title={t(
            'commoncomponents.datasetmanager.overview.actions.editParametersButtonTooltip',
            'Edit parameters of the dataset'
          )}
          disableInteractive={true}
        >
          <IconButton
            data-cy="edit-dataset-parameters-button"
            onClick={() => setIsUpdateDatasetDialogOpen(true)}
            disabled={isDisabled}
          >
            <EditIcon color={isDisabled ? 'disabled' : 'primary'} />
          </IconButton>
        </FadingTooltip>
      </PermissionsGate>
      <UpdateDatasetDialog
        open={isUpdateDatasetDialogOpen}
        dataset={dataset}
        selectedRunner={datasetRunner}
        closeDialog={closeDialog}
      />
    </>
  );
};
UpdateDatasetButton.propTypes = {
  dataset: PropTypes.object.isRequired,
};
