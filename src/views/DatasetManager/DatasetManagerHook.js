// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRedirectFromDisabledView } from '../../hooks/RouterHooks';
import { useWorkspaceMainDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { useCurrentDataset } from '../../state/datasets/hooks';
import { selectDefaultDataset } from '../../state/datasets/reducers';

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

      if (shouldReset) dispatch(selectDefaultDataset({ selectableDatasets: workspaceMainDatasets }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDataset?.id, workspaceMainDatasets, dispatch]);
  };

  return { datasets, useResetSelectedDatasetIfNecessary, useRedirectFromDisabledView };
};
