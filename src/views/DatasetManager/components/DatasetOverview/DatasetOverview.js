// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, DatasetOverviewPlaceholder, GraphIndicator } from './components';

export const DatasetOverview = () => {
  const { categories, graphIndicators, queriesResults, datasetIngestionStatus, datasetName } = useDatasetOverview();

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

  return (
    <Card
      elevation={0}
      sx={{ p: 1, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'transparent' }}
      data-cy="dataset-overview-card"
    >
      <CardHeader
        data-cy="dataset-name"
        title={datasetName}
        sx={{ height: '65px' }}
        action={
          <div>
            <IconButton>
              <HeartBrokenIcon color="primary" />
            </IconButton>
            <IconButton>
              <BabyChangingStationIcon color="primary" />
            </IconButton>
            <IconButton>
              <RefreshIcon color="primary" />
            </IconButton>
            <IconButton>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton>
              <AddCircleIcon color="primary" />
            </IconButton>
            <IconButton>
              <ShareIcon color="primary" />
            </IconButton>
            <IconButton>
              <DeleteForeverIcon color="primary" />
            </IconButton>
          </div>
        }
      />
      <CardContent sx={{ height: 'calc(100% - 65px)' }}>
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
