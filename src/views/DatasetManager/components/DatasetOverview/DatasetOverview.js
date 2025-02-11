// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit as EditIcon } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid, IconButton, Stack, Typography } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, DatasetOverviewPlaceholder, GraphIndicator } from './components';
import DatasetActions from './components/DatasetActions/DatasetActions';

export const DatasetOverview = () => {
  const { t } = useTranslation();
  const { categories, graphIndicators, queriesResults, datasetIngestionStatus, dataset, datasetName } =
    useDatasetOverview();

  const showPlaceholder = useMemo(
    () =>
      datasetIngestionStatus !== INGESTION_STATUS.SUCCESS || (categories.length === 0 && graphIndicators.length === 0),
    [categories, graphIndicators, datasetIngestionStatus]
  );

  const graphIndicatorsElements = useMemo(() => {
    return graphIndicators.map((kpi) => {
      const result = queriesResults?.graphIndicators?.find((kpiResult) => kpiResult.id === kpi.id);
      return <GraphIndicator key={kpi.id} id={kpi.id} kpi={result}></GraphIndicator>;
    });
  }, [graphIndicators, queriesResults]);

  const datasetCardTitle = useMemo(() => {
    const canRenameScenario = true; // FIXME
    const startEdition = () => {}; // FIXME
    return (
      <Stack direction="row">
        <Typography variant="h5">{datasetName}</Typography>
        {canRenameScenario && (
          <FadingTooltip title={t('commoncomponents.datasetmanager.overview.actions.renameDatasetTooltip', 'Rename')}>
            <IconButton data-cy="rename-dataset-button" aria-label="rename dataset" size="small" onClick={startEdition}>
              <EditIcon fontSize="18px" color="appbar.contrastTextSoft" />
            </IconButton>
          </FadingTooltip>
        )}
      </Stack>
    );
  }, [datasetName, t]);

  return (
    <Card
      elevation={0}
      sx={{ p: 1, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'transparent' }}
      data-cy="dataset-overview-card"
    >
      <CardHeader
        data-cy="dataset-name"
        disableTypography={true}
        title={datasetCardTitle}
        action={<DatasetActions dataset={dataset}></DatasetActions>}
      ></CardHeader>
      <CardContent>
        {showPlaceholder ? (
          <DatasetOverviewPlaceholder />
        ) : (
          <Grid container sx={{ flexFlow: 'column wrap', gap: 4 }}>
            <Grid item>
              <Grid container sx={{ flexFlow: 'row wrap', alignItems: 'stretch', justifyContent: 'center', gap: 4 }}>
                {graphIndicatorsElements}
              </Grid>
            </Grid>
            <Grid item>
              {categories.map((category) => (
                <CategoryAccordion key={category.id} category={category} queriesResults={queriesResults} />
              ))}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
