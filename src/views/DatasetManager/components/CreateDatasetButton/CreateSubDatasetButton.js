// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateSubDatasetButton = () => {
  const { t } = useTranslation();
  const [isCreationWizardOpen, setIsCreationWizardOpen] = useState(false);
  const handleCloseDialog = useCallback(() => {
    setIsCreationWizardOpen(false);
  }, [setIsCreationWizardOpen]);

  return (
    <>
      <IconButton onClick={() => setIsCreationWizardOpen(true)} data-cy="create-dataset-button">
        <AddIcon color="primary" />
      </IconButton>
      <DatasetWizard open={isCreationWizardOpen} closeDialog={handleCloseDialog} />
    </>
  );
};

CreateSubDatasetButton.propTypes = {};

CreateSubDatasetButton.defaultProps = {};
