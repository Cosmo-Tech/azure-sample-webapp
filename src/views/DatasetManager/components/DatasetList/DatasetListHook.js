// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useWorkspaceMainDatasets } from '../../../../hooks/WorkspaceDatasetsHooks';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import {
  useCurrentDataset,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/datasets/hooks';
import { useOrganizationData } from '../../../../state/organizations/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useDatasetList = () => {
  const userPermissionsInCurrentOrganization = useOrganizationData()?.security?.currentUserPermissions ?? [];
  const isDatasetCopyEnabledInWorkspace = useWorkspaceData()?.datasetCopy ?? false;
  const datasets = useWorkspaceMainDatasets();
  const selectDataset = useSelectDataset();
  const currentDataset = useCurrentDataset();

  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();

  const visibleDatasets = useMemo(
    () =>
      datasets.filter((dataset) => dataset?.security?.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.READ)),
    [datasets]
  );

  return {
    userPermissionsInCurrentOrganization,
    datasets: visibleDatasets,
    currentDataset,
    selectDataset,
    deleteDataset,
    refreshDatasetById,
    isDatasetCopyEnabledInWorkspace,
  };
};
