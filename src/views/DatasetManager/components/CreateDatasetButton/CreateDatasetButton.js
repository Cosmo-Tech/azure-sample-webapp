// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CreateDatasetWizard } from './components/CreateDatasetWizard';

export const CreateDatasetButton = () => {
  const [isCreationWizardOpen, setIsCreationWizardOpen] = useState(false);
  const handleCloseDialog = useCallback(() => {
    setIsCreationWizardOpen(false);
  }, [setIsCreationWizardOpen]);

  return (
    <div>
      <IconButton onClick={() => setIsCreationWizardOpen(true)}>
        <AddIcon color="primary" />
      </IconButton>
      <CreateDatasetWizard open={isCreationWizardOpen} closeDialog={handleCloseDialog} />
    </div>
  );
};
