// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useDatasets } from '../state/datasets/hooks';
import { DatasetsUtils } from '../utils';

export const useWorkspaceDatasets = () => {
  // This wrapper for datasets is no longer really useful since webapp v7 + API v5, because datasets are now child
  // resources of the workspaces. This hook is kept for retro-compatibility and to keep supporting customized webapps
  const datasets = useDatasets();
  return datasets;
};

export const useWorkspaceMainDatasets = () => {
  const workspaceDatasets = useWorkspaceDatasets();

  return useMemo(() => workspaceDatasets?.filter(DatasetsUtils.isVisibleInDatasetManager), [workspaceDatasets]);
};
