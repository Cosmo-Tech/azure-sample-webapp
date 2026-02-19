// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useWorkspaceMainDatasets } from '../../../../hooks/WorkspaceDatasetsHooks';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { useCurrentDataset, useDeleteDataset, useSelectDataset } from '../../../../state/datasets/hooks';
import { useWorkspaceData, useUserPermissionsOnCurrentWorkspace } from '../../../../state/workspaces/hooks';

export const useDatasetList = () => {
  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const isDatasetCopyEnabledInWorkspace = useWorkspaceData()?.datasetCopy ?? false;
  const datasets = useWorkspaceMainDatasets();
  const selectDataset = useSelectDataset();
  const currentDataset = useCurrentDataset();

  const deleteDataset = useDeleteDataset();

  const visibleDatasets = useMemo(
    () =>
      datasets.filter((dataset) => dataset?.security?.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.READ)),
    [datasets]
  );

  return {
    userPermissionsOnCurrentWorkspace,
    datasets: visibleDatasets,
    currentDataset,
    selectDataset,
    deleteDataset,
    isDatasetCopyEnabledInWorkspace,
  };
};
