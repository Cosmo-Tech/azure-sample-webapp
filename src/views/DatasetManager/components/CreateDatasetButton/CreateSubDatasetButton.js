// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { useSubDatasetCreationParameters } from './CreateSubDatasetButtonHook';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateSubDatasetButton = ({ parentDatasetId }) => {
  const { t } = useTranslation();
  const { dataSourceRunTemplates, createSubDatasetRunner, userPermissionsInCurrentOrganization } =
    useSubDatasetCreationParameters();
  const [isDatasetWizardOpen, setIsDatasetWizardOpen] = useState(false);
  const closeDialog = useCallback(() => setIsDatasetWizardOpen(false), [setIsDatasetWizardOpen]);

  const startRunnerAndCloseDialog = useCallback(
    (values) => {
      createSubDatasetRunner(parentDatasetId, values);
      closeDialog();
    },
    [createSubDatasetRunner, parentDatasetId, closeDialog]
  );

  return (
    <PermissionsGate
      userPermissions={userPermissionsInCurrentOrganization}
      necessaryPermissions={[ACL_PERMISSIONS.ORGANIZATION.CREATE_CHILDREN]}
    >
      <FadingTooltip
        title={t(
          'commoncomponents.datasetmanager.overview.actions.createSubdatasetButtonTooltip',
          'Create sub-dataset'
        )}
        disableInteractive={true}
      >
        <IconButton onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-subdataset-button">
          <AddIcon color="primary" />
        </IconButton>
      </FadingTooltip>
      <DatasetWizard
        open={isDatasetWizardOpen}
        closeDialog={closeDialog}
        parentDatasetId={parentDatasetId}
        onConfirm={startRunnerAndCloseDialog}
        dataSourceRunTemplates={dataSourceRunTemplates}
      />
    </PermissionsGate>
  );
};

CreateSubDatasetButton.propTypes = {
  parentDatasetId: PropTypes.string,
};
