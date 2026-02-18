// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../../utils';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, DatasetOverviewPlaceholder, EditableDatasetName, GraphIndicator } from './components';
import DatasetActions from './components/DatasetActions/DatasetActions';

export const DatasetOverview = () => {
  const { categories, kpiCards, kpiValues, datasetStatus, dataset } = useDatasetOverview();

  const showPlaceholder = useMemo(
    () =>
      !DatasetsUtils.hasDBDatasetParts(dataset) ||
      datasetStatus !== RUNNER_RUN_STATE.SUCCESSFUL ||
      (categories.length === 0 && kpiCards.length === 0),
    [dataset, categories, kpiCards, datasetStatus]
  );

  const kpiCardElements = useMemo(() => {
    return kpiCards.map((kpi) => {
      const result = kpiValues?.[kpi.queryId]?.[kpi.id];
      const key = `${kpi.queryId}:${kpi.id}`;
      return <GraphIndicator key={key} queryId={kpi.queryId} id={kpi.id} kpi={result} />;
    });
  }, [kpiCards, kpiValues]);

  const editableDatasetName = <EditableDatasetName />;
  return (
    <Card
      elevation={0}
      sx={{ p: 1, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'transparent' }}
      data-cy="dataset-overview-card"
    >
      <CardHeader
        title={editableDatasetName}
        sx={{ height: '65px', '& .MuiCardHeader-content': { overflow: 'hidden' } }}
        action={<DatasetActions dataset={dataset} />}
      />
      <CardContent sx={{ height: 'calc(100% - 65px)' }}>
        {showPlaceholder ? (
          <DatasetOverviewPlaceholder />
        ) : (
          <Grid container sx={{ flexFlow: 'column wrap', gap: 4 }}>
            <Grid>
              <Grid container sx={{ flexFlow: 'row wrap', alignItems: 'stretch', justifyContent: 'center', gap: 4 }}>
                {kpiCardElements}
              </Grid>
            </Grid>
            <Grid>
              {categories.map((category) => (
                <CategoryAccordion key={category.id} category={category} queriesResults={kpiValues} />
              ))}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
