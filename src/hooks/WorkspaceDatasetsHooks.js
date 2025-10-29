// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useDatasets } from '../state/datasets/hooks';
import { useWorkspaceDatasetsFilter } from '../state/workspaces/hooks';

export const useWorkspaceDatasets = () => {
  const datasets = useDatasets();
  const workspaceDatasetsFilter = useWorkspaceDatasetsFilter();

  return useMemo(() => {
    if (!workspaceDatasetsFilter) return datasets;

    const workspaceDatasets = [];
    workspaceDatasetsFilter.forEach((filterItem) => {
      if (typeof filterItem !== 'string')
        console.warn(`Ignoring dataset filter entry ${filterItem} because it is not a string`);
      else {
        const readableDataset = datasets.find((dset) => dset.id === filterItem);
        if (readableDataset) workspaceDatasets.push(readableDataset);
      }
    });

    return workspaceDatasets;
  }, [datasets, workspaceDatasetsFilter]);
};

export const useWorkspaceMainDatasets = () => {
  const workspaceDatasets = useWorkspaceDatasets();

  return useMemo(() => {
    return workspaceDatasets;
    // FIXME: filter will be fixed by PROD-14526
    // return workspaceDatasets?.filter((dataset) => dataset.main === true);
  }, [workspaceDatasets]);
};
