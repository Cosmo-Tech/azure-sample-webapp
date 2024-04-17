// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUserPermissionOnDataset } from '../../hooks/SecurityHooks';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/hooks/ApplicationHooks';
import { useUpdateDatasetSecurity, useFindDatasetById } from '../../state/hooks/DatasetHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { SecurityUtils } from '../../utils';
import { getShareDatasetDialogLabels } from './labels';

export const useShareDatasetButton = () => {
  const { t } = useTranslation();

  const findDatasetById = useFindDatasetById();

  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const getUserPermissionOnDataset = useGetUserPermissionOnDataset();
  const permissionsMapping = useApplicationPermissionsMapping();

  const updateDatasetSecurity = useUpdateDatasetSecurity();

  const shareDatasetDialogLabels = useCallback(
    (datasetId) => getShareDatasetDialogLabels(t, findDatasetById(datasetId)?.name),
    [findDatasetById, t]
  );

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.dataset);
    return SecurityUtils.getRolesLabels(t, rolesNames);
  }, [roles.dataset, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.dataset);
    return SecurityUtils.getDatasetPermissionsLabels(t, permissionsNames);
  }, [permissions.dataset, t]);

  const workspaceUsers = useMemo(() => workspaceData.users.map((user) => ({ id: user })), [workspaceData.users]);

  const accessListSpecific = useCallback(
    (datasetId) => findDatasetById(datasetId)?.security?.accessControlList ?? [],
    [findDatasetById]
  );

  const defaultRole = useCallback(
    (datasetId) => findDatasetById(datasetId)?.security?.default || '',
    [findDatasetById]
  );

  return {
    getUserPermissionOnDataset,
    permissionsMapping,
    shareDatasetDialogLabels,
    rolesLabels,
    permissionsLabels,
    workspaceUsers,
    accessListSpecific,
    defaultRole,
    updateDatasetSecurity,
  };
};
