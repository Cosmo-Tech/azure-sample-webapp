// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserPermissionsOnCurrentDataset } from '../../hooks/SecurityHooks';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/hooks/ApplicationHooks';
import { useCurrentDataset, useUpdateDatasetSecurity } from '../../state/hooks/DatasetHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { SecurityUtils } from '../../utils/SecurityUtils';
import { getShareDatasetDialogLabels } from './labels';

export const useShareCurrentDatasetButton = () => {
  const { t } = useTranslation();

  const currentDataset = useCurrentDataset();
  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const userPermissionsOnCurrentDataset = useUserPermissionsOnCurrentDataset();
  const permissionsMapping = useApplicationPermissionsMapping();

  const updateDatasetSecurity = useUpdateDatasetSecurity();

  const shareUpdateDialogLabels = useMemo(
    () => getShareDatasetDialogLabels(t, currentDataset?.name),
    [currentDataset?.name, t]
  );

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.dataset);
    return SecurityUtils.getRolesLabels(t, rolesNames);
  }, [roles.dataset, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.dataset);
    return SecurityUtils.getPermissionsLabels(t, permissionsNames);
  }, [permissions.dataset, t]);

  const workspaceUsers = useMemo(() => workspaceData.users.map((user) => ({ id: user })), [workspaceData.users]);

  const accessListSpecific = useMemo(
    () => currentDataset?.security?.accessControlList ?? [],
    [currentDataset?.security?.accessControlList]
  );

  const defaultRole = useMemo(() => currentDataset?.security?.default || '', [currentDataset?.security?.default]);

  const updateCurrentDatasetSecurity = useCallback(
    (newDatasetSecurity) => {
      updateDatasetSecurity(currentDataset.id, newDatasetSecurity);
    },
    [updateDatasetSecurity, currentDataset?.id]
  );

  return {
    userPermissionsOnCurrentDataset,
    permissionsMapping,
    shareUpdateDialogLabels,
    rolesLabels,
    permissionsLabels,
    workspaceUsers,
    accessListSpecific,
    defaultRole,
    updateCurrentDatasetSecurity,
  };
};
