// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { React } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

export const UpdateDatasetButton = () => {
  return (
    <IconButton>
      <EditIcon color="primary" />
    </IconButton>
  );
};
