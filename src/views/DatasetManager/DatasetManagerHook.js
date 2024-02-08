// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRedirectFromDatasetManagerToScenarioView } from '../../hooks/RouterHooks';
import { useWorkspaceMainDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { dispatchSelectDefaultDataset } from '../../state/dispatchers/dataset/DatasetDispatcher';
import { useCurrentDataset } from '../../state/hooks/DatasetHooks';

export const useDatasetManager = () => {
  const datasets = useWorkspaceMainDatasets();
  const currentDataset = useCurrentDataset();

  const useResetSelectedDatasetIfNecessary = () => {
    const workspaceMainDatasets = useWorkspaceMainDatasets();
    const dispatch = useDispatch();

    return useEffect(() => {
      const shouldReset =
        currentDataset == null ||
        workspaceMainDatasets.find((dataset) => dataset.id === currentDataset.id) === undefined;

      if (shouldReset) dispatch(dispatchSelectDefaultDataset(workspaceMainDatasets));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDataset?.id, workspaceMainDatasets, dispatch]);
  };

  return { datasets, useResetSelectedDatasetIfNecessary, useRedirectFromDatasetManagerToScenarioView };
};
