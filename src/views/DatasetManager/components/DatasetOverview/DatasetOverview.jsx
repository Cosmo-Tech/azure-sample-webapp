// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, Grid2 as Grid } from '@mui/material';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, DatasetOverviewPlaceholder, EditableDatasetName, GraphIndicator } from './components';
import DatasetActions from './components/DatasetActions/DatasetActions';

export const DatasetOverview = () => {
  const { categories, graphIndicators, queriesResults, datasetIngestionStatus, dataset } = useDatasetOverview();

  const showPlaceholder = useMemo(
    () =>
      datasetIngestionStatus !== INGESTION_STATUS.SUCCESS || (categories.length === 0 && graphIndicators.length === 0),
    [categories, graphIndicators, datasetIngestionStatus]
  );

  const graphIndicatorsElements = useMemo(() => {
    return graphIndicators.map((kpi) => {
      const result = queriesResults?.graphIndicators?.find((kpiResult) => kpiResult.id === kpi.id);
      return <GraphIndicator key={kpi.id} id={kpi.id} kpi={result} />;
    });
  }, [graphIndicators, queriesResults]);

  const editableDatasetName = <EditableDatasetName />;
  return (
    <Card
      elevation={0}
      sx={{ p: 1, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'transparent' }}
      data-cy="dataset-overview-card"
    >
      <CardHeader title={editableDatasetName} sx={{ height: '65px' }} action={<DatasetActions dataset={dataset} />} />
      <CardContent sx={{ height: 'calc(100% - 65px)' }}>
        {showPlaceholder ? (
          <DatasetOverviewPlaceholder />
        ) : (
          <Grid container sx={{ flexFlow: 'column wrap', gap: 4 }}>
            <Grid>
              <Grid container sx={{ flexFlow: 'row wrap', alignItems: 'stretch', justifyContent: 'center', gap: 4 }}>
                {graphIndicatorsElements}
              </Grid>
            </Grid>
            <Grid>
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
