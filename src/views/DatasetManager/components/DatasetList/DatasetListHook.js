// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useMemo } from 'react';
import {
  useCurrentDataset,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';
import { useOrganizationData } from '../../../../state/hooks/OrganizationHooks';
import { useWorkspaceData } from '../../../../state/hooks/WorkspaceHooks';
import { useWorkspaceMainDatasets } from '../../../../hooks/WorkspaceDatasetsHooks';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';

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
