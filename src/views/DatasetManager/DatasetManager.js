// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Card, Grid } from '@mui/material';
import { useDatasetManager } from './DatasetManagerHook';
import { DatasetList, DatasetMetadata, DatasetOverview, NoDatasetsPlaceholder } from './components';

const DatasetManager = () => {
  const { datasets, useRedirectFromDatasetManagerToScenarioView, useResetSelectedDatasetIfNecessary } =
    useDatasetManager();

  useResetSelectedDatasetIfNecessary();
  useRedirectFromDatasetManagerToScenarioView();

  return datasets?.length > 0 ? (
    <div data-cy="dataset-manager-view" style={{ height: '100%', overflow: 'auto' }}>
      <Card sx={{ m: 1, pt: 2, pb: 3, px: 2, height: 'calc(100% - 16px)' }}>
        <Grid container spacing={0} sx={{ alignItems: 'stretch', justifyContent: 'flex-start', height: '100%' }}>
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <div style={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
              <div style={{ flex: '1', minHeight: '300px', overflow: 'auto' }}>
                <DatasetList />
              </div>
              <DatasetMetadata />
            </div>
          </Grid>
          <Grid item xs={12} md={8} style={{ height: '100%' }}>
            <DatasetOverview />
          </Grid>
        </Grid>
      </Card>
    </div>
  ) : (
    <NoDatasetsPlaceholder />
  );
};

export default DatasetManager;
