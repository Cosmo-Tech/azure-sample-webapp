// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { INGESTION_STATUS, TWINCACHE_STATUS } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { useSubDatasetCreationParameters } from './CreateSubDatasetButtonHook';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateSubDatasetButton = ({ parentDataset }) => {
  const { t } = useTranslation();
  const { dataSourceRunTemplates, createSubDatasetRunner, userPermissionsInCurrentOrganization } =
    useSubDatasetCreationParameters();
  const [isDatasetWizardOpen, setIsDatasetWizardOpen] = useState(false);
  const isDisabled = useMemo(
    () =>
      !parentDataset ||
      parentDataset.twincacheStatus !== TWINCACHE_STATUS.FULL ||
      parentDataset.ingestionStatus !== INGESTION_STATUS.SUCCESS,
    [parentDataset]
  );
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
      <FadingTooltip
        title={t(
          'commoncomponents.datasetmanager.overview.actions.createSubdatasetButtonTooltip',
          'Create sub-dataset'
        )}
        disableInteractive={true}
      >
        <IconButton
          onClick={() => setIsDatasetWizardOpen(true)}
          data-cy="create-subdataset-button"
          disabled={isDisabled}
        >
          <AddIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </FadingTooltip>
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
