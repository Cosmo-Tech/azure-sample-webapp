// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { CreateDatasetWizard } from './components/CreateDatasetWizard';

export const CreateDatasetButton = ({ isContainedButton }) => {
  const { t } = useTranslation();
  const [isCreationWizardOpen, setIsCreationWizardOpen] = useState(false);
  const handleCloseDialog = useCallback(() => {
    setIsCreationWizardOpen(false);
  }, [setIsCreationWizardOpen]);

  return (
    <>
      {isContainedButton ? (
        <Button variant="contained" onClick={() => setIsCreationWizardOpen(true)} data-cy="create-dataset-button">
          {t('commoncomponents.datasetmanager.create.label', 'Create')}
        </Button>
      ) : (
        <IconButton onClick={() => setIsCreationWizardOpen(true)} data-cy="create-dataset-button">
          <AddIcon color="primary" />
        </IconButton>
      )}
      <CreateDatasetWizard open={isCreationWizardOpen} closeDialog={handleCloseDialog} />
    </>
  );
};

CreateDatasetButton.propTypes = {
  isContainedButton: PropTypes.bool,
};

CreateDatasetButton.defaultProps = {
  isContainedButton: false,
};
