// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect, useMemo } from 'react';
import { useGetDatasetRunnerStatus } from '../../../../hooks/DatasetRunnerHooks';
import {
  useDatasetTwingraphQueriesResults,
  useInitializeDatasetTwingraphQueriesResults,
} from '../../../../state/datasetTwingraph/hooks';
import { useCurrentDataset } from '../../../../state/datasets/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useDatasetOverview = () => {
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();
  const workspaceData = useWorkspaceData();
  const currentDataset = useCurrentDataset();
  const datasetTwingraphQueriesResults = useDatasetTwingraphQueriesResults();
  const initializeDatasetTwingraphQueriesResults = useInitializeDatasetTwingraphQueriesResults();

  const datasetStatus = getDatasetRunnerStatus(currentDataset);

  const flatQueriesResults = useMemo(() => {
    return datasetTwingraphQueriesResults[currentDataset?.id] ?? {};
  }, [currentDataset?.id, datasetTwingraphQueriesResults]);

  const datasetManagerConfig = useMemo(() => {
    // Make a shallow copy of config object to prevent error "Object is not extensible" when trying to set properties
    const config = { ...workspaceData?.additionalData?.webapp?.datasetManager };
    if (config.categories == null) config.categories = [];
    if (config.kpiCards == null) config.kpiCards = [];
    if (config.queries == null) config.queries = [];
    return config;
  }, [workspaceData?.additionalData?.webapp?.datasetManager]);
  useEffect(() => {
    initializeDatasetTwingraphQueriesResults(currentDataset);
  }, [currentDataset, initializeDatasetTwingraphQueriesResults]);

  return {
    categories: datasetManagerConfig.categories,
    kpiCards: datasetManagerConfig.kpiCards,
    kpiValues: flatQueriesResults,
    datasetStatus,
    dataset: currentDataset,
  };
};
