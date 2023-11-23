// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CardContent, Grid, Typography } from '@mui/material';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';
import { TWINGRAPH_STATUS } from '../../../../../../services/config/ApiConstants';

export const DatasetOverviewPlaceholder = () => {
  const { t } = useTranslation();
  const { currentDatasetId, currentDatasetStatus, refreshDataset } = useDatasetOverviewPlaceholder();

  const placeholderText = useMemo(() => {
    switch (currentDatasetStatus) {
      case TWINGRAPH_STATUS.PENDING:
        return t('commoncomponents.datasetmanager.overview.placeholder.loading', 'Importing your data, please wait...');
      case TWINGRAPH_STATUS.DRAFT:
        return t('commoncomponents.datasetmanager.overview.placeholder.empty', 'Your dataset is empty');
      case TWINGRAPH_STATUS.ERROR:
        return t(
          'commoncomponents.datasetmanager.overview.placeholder.error',
          'An error occurred during import of your data'
        );
      case TWINGRAPH_STATUS.UNKNOWN:
        return t(
          'commoncomponents.datasetmanager.overview.placeholder.unknown',
          'The dataset has an unknown state, if the problem persists, please, contact your administrator'
        );
    }
  }, [currentDatasetStatus, t]);

  const retryButton = useMemo(() => {
    return [TWINGRAPH_STATUS.ERROR, TWINGRAPH_STATUS.UNKNOWN].includes(currentDatasetStatus) ? (
      <Button variant="contained" onClick={() => refreshDataset(currentDatasetId)}>
        {t('commoncomponents.datasetmanager.overview.placeholder.retryButton', 'Retry')}
      </Button>
    ) : null;
  }, [currentDatasetId, currentDatasetStatus, refreshDataset, t]);

  return (
    <CardContent sx={{ height: '100%' }}>
      <Grid
        container
        direction="column"
        sx={{ justifyContent: 'center', alignItems: 'center', gap: 4, height: '100%' }}
      >
        <Grid item>
          <Typography variant="h5">{placeholderText}</Typography>
        </Grid>
        <Grid item>{retryButton}</Grid>
      </Grid>
    </CardContent>
  );
};
