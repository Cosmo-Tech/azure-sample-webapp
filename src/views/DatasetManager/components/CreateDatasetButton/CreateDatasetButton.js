// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const CreateDatasetButton = () => {
  return (
    <IconButton>
      <AddIcon color="primary" />
    </IconButton>
  );
};
