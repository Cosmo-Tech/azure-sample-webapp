// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { useDatasetManager } from '../../DatasetManagerHook';

export const DatasetManagerLoadingBackdrop = () => {
  const { datasetsStatus } = useDatasetManager();
  const { t } = useTranslation();
  const showBackdrop = datasetsStatus === 'DELETING';
  return (
    <Backdrop open={showBackdrop} style={{ zIndex: '10000' }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="h4">
          {t('commoncomponents.datasetmanager.backdrop.deleting', 'Deleting dataset')}
        </Typography>
      </Stack>
    </Backdrop>
  );
};
