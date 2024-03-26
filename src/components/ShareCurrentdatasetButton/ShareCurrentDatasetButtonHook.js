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
import { getShareScenarioDialogLabels, getPermissionsLabels, getRolesLabels } from './labels';

export const useShareCurrentScenarioButton = () => {
  const { t } = useTranslation();

  const currentDataset = useCurrentDataset();
  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const userPermissionsOnCurrentDataset = useUserPermissionsOnCurrentDataset();
  const permissionsMapping = useApplicationPermissionsMapping();

  const updateDatasetSecurity = useUpdateDatasetSecurity();

  const shareUpdateDialogLabels = useMemo(
    () => getShareScenarioDialogLabels(t, currentScenarioData?.name, isDirty),
    [currentScenarioData?.name, t, isDirty]
  );

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.scenario);
    return getRolesLabels(t, rolesNames);
  }, [roles.scenario, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.scenario);
    return getPermissionsLabels(t, permissionsNames);
  }, [permissions.scenario, t]);

  const workspaceUsers = useMemo(() => workspaceData.users.map((user) => ({ id: user })), [workspaceData.users]);

  const accessListSpecific = useMemo(
    () => currentDataset?.security?.accessControlList ?? [],
    [currentDataset?.security?.accessControlList]
  );

  const defaultRole = useMemo(() => currentDataset?.security?.default || '', [currentDataset?.security?.default]);

  const applyScenarioSecurityChanges = useCallback(
    (newScenarioSecurity) => {
      applyScenarioSharingSecurity(currentScenarioData.id, newScenarioSecurity);
    },
    [applyScenarioSharingSecurity, currentScenarioData?.id]
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
    applyScenarioSecurityChanges,
  };
};
