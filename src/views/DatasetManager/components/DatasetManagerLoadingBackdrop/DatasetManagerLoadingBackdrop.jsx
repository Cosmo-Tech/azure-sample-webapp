// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { DATASET_REDUCER_STATUS } from '../../../../state/datasets/constants';
import { useDatasetsReducerStatus } from '../../../../state/datasets/hooks';

export const DatasetManagerLoadingBackdrop = () => {
  const datasetReducerStatus = useDatasetsReducerStatus();
  const { t } = useTranslation();

  const backdropMessage = useMemo(() => {
    if (datasetReducerStatus === DATASET_REDUCER_STATUS.DELETING)
      return t('commoncomponents.datasetmanager.backdrop.deleting', 'Deleting dataset');
    if (datasetReducerStatus === DATASET_REDUCER_STATUS.CREATING)
      return t('commoncomponents.datasetmanager.backdrop.creating', 'Creating dataset');
    if (datasetReducerStatus === DATASET_REDUCER_STATUS.STOPPING)
      return t('commoncomponents.datasetmanager.backdrop.stopping', 'Stopping dataset creation');
    if (datasetReducerStatus === DATASET_REDUCER_STATUS.LOADING)
      return t('commoncomponents.datasetmanager.backdrop.loading', 'Loading datasets');
    if (datasetReducerStatus === DATASET_REDUCER_STATUS.SAVING)
      return t('commoncomponents.datasetmanager.backdrop.saving', 'Saving dataset changes');

    return null;
  }, [t, datasetReducerStatus]);

  return (
    <Backdrop open={backdropMessage != null} style={{ zIndex: '10000' }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress color="inherit" />
        <Typography variant="h4">{backdropMessage}</Typography>
      </Stack>
    </Backdrop>
  );
};
