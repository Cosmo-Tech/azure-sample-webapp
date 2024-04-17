// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { useDatasetCreationParameters } from './CreateDatasetButtonHook';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateDatasetButton = ({ isContainedButton }) => {
  const { t } = useTranslation();
  const { dataSourceRunTemplates, createDatasetOrRunner } = useDatasetCreationParameters();

  const [isDatasetWizardOpen, setIsDatasetWizardOpen] = useState(false);
  const closeDialog = useCallback(() => setIsDatasetWizardOpen(false), [setIsDatasetWizardOpen]);

  const createDatasetAndCloseDialog = useCallback(
    (values) => {
      createDatasetOrRunner(values);
      closeDialog();
    },
    [createDatasetOrRunner, closeDialog]
  );

  return (
    <>
      {isContainedButton ? (
        <Button variant="contained" onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-dataset-button">
          {t('commoncomponents.datasetmanager.create.label', 'Create')}
        </Button>
      ) : (
        <FadingTooltip
          title={t('commoncomponents.datasetmanager.create.tooltip', 'Create a new dataset')}
          disableInteractive={true}
        >
          <IconButton onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-dataset-button">
            <AddIcon color="primary" />
          </IconButton>
        </FadingTooltip>
      )}
      <DatasetWizard
        open={isDatasetWizardOpen}
        closeDialog={closeDialog}
        onConfirm={createDatasetAndCloseDialog}
        dataSourceRunTemplates={dataSourceRunTemplates}
      />
    </>
  );
};

CreateDatasetButton.propTypes = {
  isContainedButton: PropTypes.bool,
};

CreateDatasetButton.defaultProps = {
  isContainedButton: false,
};
