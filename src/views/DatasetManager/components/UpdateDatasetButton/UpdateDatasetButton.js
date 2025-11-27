// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { React, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { useGetDatasetRunner, useGetDatasetRunnerStatus } from '../../../../hooks/DatasetRunnerHooks';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { UpdateDatasetDialog } from './components';

export const UpdateDatasetButton = ({ dataset }) => {
  const { t } = useTranslation();
  const getDatasetRunner = useGetDatasetRunner();
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();

  const [isUpdateDatasetDialogOpen, setIsUpdateDatasetDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setIsUpdateDatasetDialogOpen(false), []);

  const datasetRunner = getDatasetRunner(dataset);
  const datasetRunnerStatus = getDatasetRunnerStatus(dataset);
  const userPermissionsOnDataset = dataset?.security?.currentUserPermissions ?? [];
  const isDisabled = datasetRunner == null || datasetRunnerStatus === RUNNER_RUN_STATE.RUNNING;

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
