// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useMemo } from 'react';
import { useWorkspaceData } from '../../../../state/hooks/WorkspaceHooks';
// import { useCurrentDataset } from '../../../../state/hooks/DatasetHooks';

export const useDatasetOverview = () => {
  const workspaceData = useWorkspaceData();

  const categories = useMemo(() => {
    return workspaceData?.webApp?.options?.datasetManager?.categories ?? [];
  }, [workspaceData?.webApp?.options?.datasetManager?.categories]);

  const graphIndicators = useMemo(() => {
    return workspaceData?.webApp?.options?.datasetManager?.graphIndicators ?? [];
  }, [workspaceData?.webApp?.options?.datasetManager?.graphIndicators]);

  // const dataset = useCurrentDataset();

  // TODO: remove hard-coded JSON below & add redux sagas to query the twingraph instead
  const queriesResults = {
    categoriesKpis: [
      { id: 'transport_kpi1', state: 'FAILED' },
      { id: 'transport_kpi2', state: 'FAILED' },
      { id: 'productionOperation_kpi1', state: 'IDLE' },
      { id: 'productionOperation_kpi2', state: 'IDLE' },
      { id: 'stock_quantity', value: 850, state: 'READY' },
      { id: 'stock_initial_sum', value: 250, state: 'READY' },
      { id: 'stock_purchasing_cost', value: 196.15, state: 'READY' },
      { id: 'stock_resource_quantity', value: 849, state: 'READY' },
      { id: 'demands_kpi1', value: 12034, state: 'READY' },
      { id: 'demands_kpi2', state: 'LOADING' },
      { id: 'demands_kpi3', state: 'LOADING' },
      { id: 'demands_kpi4', state: 'UNKNOWN' },
      { id: 'input_kpi1', value: 1.0, state: 'READY' },
      { id: 'output_kpi1', value: 130.5, state: 'READY' },
      { id: 'output_kpi2', value: 10, state: 'READY' },
      { id: 'output_kpi3', value: 916.1, state: 'READY' },
    ],
    graphIndicators: [
      { id: 'entities', value: 3190, state: 'READY' },
      { id: 'relationships', value: '42136', state: 'READY' },
      { id: 'graphKpi0', state: 'IDLE' },
      { id: 'graphKpi1', state: 'LOADING' },
      { id: 'graphKpi2', state: 'UNKNOWN' },
      { id: 'graphKpi3', state: 'FAILED' },
    ],
  };

  return { categories, graphIndicators, queriesResults };
};
