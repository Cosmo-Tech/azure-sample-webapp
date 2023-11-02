// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Card, Grid } from '@mui/material';
import { DatasetList, DatasetMetadata, DatasetOverview } from './components';

const DatasetManager = () => {
  return (
    <div data-cy="dataset-manager-view">
      <Card sx={{ m: 1, py: 3, px: 2 }}>
        <Grid container spacing={0} sx={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
          <Grid item xs={12} md={4}>
            <DatasetList />
            <DatasetMetadata />
          </Grid>
          <Grid item xs={12} md={8}>
            <DatasetOverview />
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default DatasetManager;
