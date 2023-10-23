// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Paper } from '@mui/material';
import { DatasetList } from '../DatasetList';
import { DatasetMetadata } from '../DatasetMetadata';

export const DatasetBrowser = () => {
  return (
    <Paper variant="outlined" square>
      <DatasetList />
      <DatasetMetadata />
    </Paper>
  );
};
