// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useCurrentDataset } from '../../../../state/hooks/DatasetHooks';
import {
  useDatasetTwingraphQueriesResults,
  useInitializeDatasetTwingraphQueriesResults,
} from '../../../../state/hooks/DatasetTwingraphQueriesResultsHooks';
import { useWorkspaceData } from '../../../../state/hooks/WorkspaceHooks';

export const useDatasetOverview = () => {
  const workspaceData = useWorkspaceData();
  const currentDataset = useCurrentDataset();
  const datasetIngestionStatus = useCurrentDataset()?.ingestionStatus;
  const datasetTwingraphQueriesResults = useDatasetTwingraphQueriesResults();
  const initializeDatasetTwingraphQueriesResults = useInitializeDatasetTwingraphQueriesResults();
  const flatQueriesResults = useMemo(() => {
    return datasetTwingraphQueriesResults[currentDataset?.id] ?? {};
  }, [currentDataset?.id, datasetTwingraphQueriesResults]);

  const datasetManagerConfig = useMemo(() => {
    // Make a shallow copy of config object to prevent error "Object is not extensible" when trying to set properties
    const config = { ...workspaceData?.webApp?.options?.datasetManager };
    if (config.categories == null) config.categories = [];
    if (config.graphIndicators == null) config.graphIndicators = [];
    if (config.queries == null) config.queries = [];
    return config;
  }, [workspaceData?.webApp?.options?.datasetManager]);

  initializeDatasetTwingraphQueriesResults(currentDataset);

  const queriesResults = useMemo(() => {
    const result = { categoriesKpis: [], graphIndicators: [] };
    workspaceData?.indicators?.categoriesKpis?.forEach((kpiId) =>
      result.categoriesKpis.push({ id: kpiId, ...flatQueriesResults[kpiId] })
    );
    workspaceData?.indicators?.graphIndicators?.forEach((kpiId) =>
      result.graphIndicators.push({ id: kpiId, ...flatQueriesResults[kpiId] })
    );
    return result;
  }, [workspaceData?.indicators?.categoriesKpis, workspaceData?.indicators?.graphIndicators, flatQueriesResults]);

  return {
    categories: datasetManagerConfig.categories,
    graphIndicators: datasetManagerConfig.graphIndicators,
    queriesResults,
    datasetIngestionStatus,
    dataset: currentDataset,
    datasetName: currentDataset?.name,
  };
};
