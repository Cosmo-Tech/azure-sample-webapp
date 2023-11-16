// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { CreateDatasetButton } from '../CreateDatasetButton';

export const NoDatasetsPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <Grid container sx={{ height: 1, p: 1 }} data-cy="no-datasets-placeholder">
      <Card sx={{ width: 1 }}>
        <Stack sx={{ height: 1 }} justifyContent="center" alignItems="center">
          <Typography variant="h4">
            {t('commoncomponents.datasetmanager.noDatasets.title', "You don't have any datasets yet")}
          </Typography>
          <Typography>
            <Trans
              i18nKey="commoncomponents.datasetmanager.noDatasets.body"
              defaultValue="Click on <createDatasetButton /> to import your first data"
              components={{ createDatasetButton: <CreateDatasetButton isContainedButton={true} /> }}
            />
          </Typography>
        </Stack>
      </Card>
    </Grid>
  );
};
