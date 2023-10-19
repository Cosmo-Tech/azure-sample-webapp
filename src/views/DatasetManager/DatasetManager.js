// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { DatasetBrowser } from './components';
import { Grid } from '@mui/material';

const DatasetManager = () => {
  return (
    <div data-cy="dataset-manager-view">
      <Grid container>
        <Grid item>
          <DatasetBrowser />
        </Grid>
      </Grid>
    </div>
  );
};

export default DatasetManager;
