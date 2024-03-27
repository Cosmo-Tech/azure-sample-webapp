// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { DatasetWizard } from './components/DatasetWizard';

export const CreateSubDatasetButton = ({ parentDatasetId }) => {
  const [isCreationWizardOpen, setIsCreationWizardOpen] = useState(false);
  const handleCloseDialog = useCallback(() => {
    setIsCreationWizardOpen(false);
  }, [setIsCreationWizardOpen]);

  return (
    <>
      <IconButton onClick={() => setIsCreationWizardOpen(true)} data-cy="create-dataset-button">
        <AddIcon color="primary" />
      </IconButton>
      <DatasetWizard open={isCreationWizardOpen} closeDialog={handleCloseDialog} parentDatasetId={parentDatasetId} />
    </>
  );
};

CreateSubDatasetButton.propTypes = {
  parentDatasetId: PropTypes.string,
};
