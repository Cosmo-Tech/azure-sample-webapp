// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, CardContent, Grid, Link, Typography } from '@mui/material';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';
import {
  DATASET_SOURCE_TYPE,
  INGESTION_STATUS,
  TWINCACHE_STATUS,
} from '../../../../../../services/config/ApiConstants';
import { ApiUtils } from '../../../../../../utils';
import { ReuploadFileDatasetButton } from '../../../ReuploadFileDatasetButton';

export const DatasetOverviewPlaceholder = () => {
  const { t } = useTranslation();
  const {
    currentDatasetId,
    currentDatasetIngestionStatus,
    currentDatasetTwincacheStatus,
    currentDatasetType,
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
      default:
        return t(
          'commoncomponents.datasetmanager.overview.placeholder.unknown',
          'The dataset has an unknown state, if the problem persists, please, contact your administrator'
        );
    }
  }, [currentDatasetIngestionStatus, t]);

  const retryButton = useMemo(() => {
    return currentDatasetIngestionStatus == null ||
      [INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(currentDatasetIngestionStatus) ? (
      currentDatasetType === DATASET_SOURCE_TYPE.LOCAL_FILE ? (
        <ReuploadFileDatasetButton datasetId={currentDatasetId} iconButton={false} />
      ) : (
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
      )
    ) : null;
  }, [
    currentDatasetId,
    currentDatasetIngestionStatus,
    refreshDataset,
    rollbackTwingraphData,
    currentDatasetTwincacheStatus,
    currentDatasetType,
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
