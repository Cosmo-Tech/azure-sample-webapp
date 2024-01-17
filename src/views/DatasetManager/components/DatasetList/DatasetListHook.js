// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentDataset,
  useDatasets,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';
import { useOrganizationData } from '../../../../state/hooks/OrganizationHooks';

export const useDatasetList = () => {
  const userPermissionsInCurrentOrganization = useOrganizationData()?.security?.currentUserPermissions ?? [];
  const datasets = useDatasets();
  const selectDataset = useSelectDataset();
  const currentDataset = useCurrentDataset();

  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();
  return {
    userPermissionsInCurrentOrganization,
    datasets,
    currentDataset,
    selectDataset,
    deleteDataset,
    refreshDatasetById,
  };
};
