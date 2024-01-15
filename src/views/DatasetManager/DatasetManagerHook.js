// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useDatasetsReducerStatus } from '../../state/hooks/DatasetHooks';
import { useRedirectFromDatasetManagerToScenarioView } from '../../hooks/RouterHooks';
import { useWorkspaceMainDatasets } from '../../hooks/WorkspaceDatasetsHooks';

export const useDatasetManager = () => {
  const datasets = useWorkspaceMainDatasets();
  const datasetsStatus = useDatasetsReducerStatus();

  return { datasets, datasetsStatus, useRedirectFromDatasetManagerToScenarioView };
};
