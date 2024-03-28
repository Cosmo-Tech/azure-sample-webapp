// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useCreateDatasetOrRunner } from './CreateDatasetButtonHook';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateDatasetButton = ({ isContainedButton }) => {
  const { t } = useTranslation();
  const createDataset = useCreateDatasetOrRunner();

  const [isDatasetWizardOpen, setIsDatasetWizardOpen] = useState(false);
  const closeDialog = useCallback(() => setIsDatasetWizardOpen(false), [setIsDatasetWizardOpen]);

  const createDatasetAndCloseDialog = useCallback(
    (values) => {
      createDataset(values);
      closeDialog();
    },
    [createDataset, closeDialog]
  );

  return (
    <>
      {isContainedButton ? (
        <Button variant="contained" onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-dataset-button">
          {t('commoncomponents.datasetmanager.create.label', 'Create')}
        </Button>
      ) : (
        <IconButton onClick={() => setIsDatasetWizardOpen(true)} data-cy="create-dataset-button">
          <AddIcon color="primary" />
        </IconButton>
      )}
      <DatasetWizard open={isDatasetWizardOpen} closeDialog={closeDialog} onConfirm={createDatasetAndCloseDialog} />
    </>
  );
};

CreateDatasetButton.propTypes = {
  isContainedButton: PropTypes.bool,
};

CreateDatasetButton.defaultProps = {
  isContainedButton: false,
};
