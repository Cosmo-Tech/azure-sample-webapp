// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Grid } from '@mui/material';
import { DatasetBrowser, DatasetOverview } from './components';

const DatasetManager = () => {
  return (
    <div data-cy="dataset-manager-view">
      <Grid container spacing={0} sx={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <Grid item xs={12} md={4}>
          <DatasetBrowser />
        </Grid>
        <Grid item xs={12} md={8}>
          <DatasetOverview />
        </Grid>
      </Grid>
    </div>
  );
};

export default DatasetManager;
