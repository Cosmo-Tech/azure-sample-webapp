// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, CardContent, Grid, Link, Typography } from '@mui/material';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';
import { INGESTION_STATUS, TWINCACHE_STATUS } from '../../../../../../services/config/ApiConstants';
import { ApiUtils } from '../../../../../../utils';

export const DatasetOverviewPlaceholder = () => {
  const { t } = useTranslation();
  const {
    currentDatasetId,
    currentDatasetIngestionStatus,
    currentDatasetTwincacheStatus,
    refreshDataset,
    rollbackTwingraphData,
  } = useDatasetOverviewPlaceholder();

  const placeholderText = useMemo(() => {
    switch (currentDatasetIngestionStatus) {
      case INGESTION_STATUS.PENDING:
        return t('commoncomponents.datasetmanager.overview.placeholder.loading', 'Importing your data, please wait...');
      case INGESTION_STATUS.NONE:
        return t('commoncomponents.datasetmanager.overview.placeholder.empty', 'Your dataset is empty');
      case INGESTION_STATUS.ERROR:
        return t(
          'commoncomponents.datasetmanager.overview.placeholder.error',
          'An error occurred during import of your data'
        );
      case INGESTION_STATUS.UNKNOWN:
        return t(
          'commoncomponents.datasetmanager.overview.placeholder.unknown',
          'The dataset has an unknown state, if the problem persists, please, contact your administrator'
        );
    }
  }, [currentDatasetIngestionStatus, t]);

  const retryButton = useMemo(() => {
    return [INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(currentDatasetIngestionStatus) ? (
      <>
        <Button
          data-cy="dataset-overview-retry-button"
          variant="contained"
          onClick={() => refreshDataset(currentDatasetId)}
        >
          {t('commoncomponents.datasetmanager.overview.placeholder.retryButton', 'Retry')}
        </Button>
        {currentDatasetTwincacheStatus === TWINCACHE_STATUS.FULL && (
          <Button
            data-cy="dataset-overview-rollback-button"
            variant="contained"
            onClick={() => rollbackTwingraphData(currentDatasetId)}
            sx={{ ml: 1 }}
          >
            {t('commoncomponents.datasetmanager.overview.placeholder.rollbackButton', 'Rollback')}
          </Button>
        )}
      </>
    ) : null;
  }, [
    currentDatasetId,
    currentDatasetIngestionStatus,
    refreshDataset,
    rollbackTwingraphData,
    currentDatasetTwincacheStatus,
    t,
  ]);

  // This component uses node count to implement a link in the translation string,
  // if the string is modified, need to check that the link is still the node N1
  const swaggerLink = useMemo(() => {
    return currentDatasetIngestionStatus === INGESTION_STATUS.NONE ? (
      <Typography variant="caption" color="appbar.contrastTextSoft">
        <Trans i18nKey="commoncomponents.datasetmanager.overview.placeholder.apiLink">
          You can use the
          <Link href={ApiUtils.getDatasetTwingraphSwaggerSection()} color="inherit" target="blank">
            Cosmo Tech API
          </Link>
          to populate it
        </Trans>
      </Typography>
    ) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDatasetIngestionStatus, t]);

  return (
    <CardContent sx={{ height: '100%' }}>
      <Grid
        data-cy="dataset-overview-placeholder"
        container
        direction="column"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: currentDatasetIngestionStatus === INGESTION_STATUS.NONE ? 2 : 4,
          height: '100%',
          width: 'fill-available',
          position: 'fixed',
        }}
      >
        <Grid item>
          <Typography data-cy="dataset-overview-title" variant="h3" align="center">
            {placeholderText}
          </Typography>
        </Grid>
        <Grid item>{retryButton}</Grid>
        <Grid data-cy="dataset-overview-api-link" item>
          {swaggerLink}
        </Grid>
      </Grid>
    </CardContent>
  );
};
