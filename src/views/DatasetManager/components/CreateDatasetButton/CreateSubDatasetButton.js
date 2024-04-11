// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { PermissionsGate } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { useSubDatasetCreationParameters } from './CreateSubDatasetButtonHook';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateSubDatasetButton = ({ parentDataset }) => {
  const { dataSourceRunTemplates, createSubDatasetRunner, userPermissionsInCurrentOrganization } =
    useSubDatasetCreationParameters();
  const [isDatasetWizardOpen, setIsDatasetWizardOpen] = useState(false);
  const closeDialog = useCallback(() => setIsDatasetWizardOpen(false), [setIsDatasetWizardOpen]);

  const startRunnerAndCloseDialog = useCallback(
    (values) => {
      createSubDatasetRunner(parentDataset?.id, values);
      closeDialog();
    },
    [createSubDatasetRunner, parentDataset?.id, closeDialog]
  );

  return (
    <PermissionsGate
      userPermissions={userPermissionsInCurrentOrganization}
      necessaryPermissions={[ACL_PERMISSIONS.ORGANIZATION.CREATE_CHILDREN]}
    >
      <IconButton onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-subdataset-button">
        <AddIcon color="primary" />
      </IconButton>
      <DatasetWizard
        open={isDatasetWizardOpen}
        closeDialog={closeDialog}
        parentDataset={parentDataset}
        onConfirm={startRunnerAndCloseDialog}
        dataSourceRunTemplates={dataSourceRunTemplates}
      />
    </PermissionsGate>
  );
};

CreateSubDatasetButton.propTypes = {
  parentDataset: PropTypes.object,
};
