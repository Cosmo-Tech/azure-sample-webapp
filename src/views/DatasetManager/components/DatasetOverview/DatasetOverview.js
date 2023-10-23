// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, Grid, Paper } from '@mui/material';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, GraphIndicator } from './components';

export const DatasetOverview = () => {
  const { t } = useTranslation();
  const { categories, graphIndicators, queriesResults } = useDatasetOverview();

  const graphIndicatorsElements = useMemo(() => {
    return graphIndicators.map((kpi) => {
      const result = queriesResults.graphIndicators.find((kpiResult) => kpiResult.id === kpi.id);
      return <GraphIndicator key={kpi.id} id={kpi.id} kpi={result}></GraphIndicator>;
    });
  }, [graphIndicators, queriesResults]);

  return (
    <Card component={Paper} sx={{ p: 1, width: '100%', height: '100%' }} data-cy="dataset-overview-card">
      <CardHeader title={t('commoncomponents.datasetmanager.overview.title', 'Overview')}></CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
