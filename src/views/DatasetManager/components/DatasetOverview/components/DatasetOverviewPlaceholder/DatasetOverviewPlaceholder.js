// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, CardContent, Grid, Link, Typography } from '@mui/material';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';
import { TWINGRAPH_STATUS } from '../../../../../../services/config/ApiConstants';
import { ApiUtils } from '../../../../../../utils';

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

  // This component uses node count to implement a link in the translation string,
  // if the string is modified, need to check that the link is still the node N1
  const swaggerLink = useMemo(() => {
    return currentDatasetStatus === TWINGRAPH_STATUS.DRAFT ? (
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
  }, [currentDatasetStatus, t]);

  return (
    <CardContent sx={{ height: '100vh' }}>
      <Grid
        container
        direction="column"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: currentDatasetStatus === TWINGRAPH_STATUS.DRAFT ? 2 : 4,
          height: '100%',
          width: 'fill-available',
          position: 'fixed',
        }}
      >
        <Grid item>
          <Typography variant="h3" align="center">
            {placeholderText}
          </Typography>
        </Grid>
        <Grid item>{retryButton}</Grid>
        <Grid item>{swaggerLink}</Grid>
      </Grid>
    </CardContent>
  );
};
