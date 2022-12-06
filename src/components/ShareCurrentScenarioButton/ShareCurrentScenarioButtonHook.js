// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks';
import { useCurrentScenarioData, useApplyScenarioSharingSecurity } from '../../state/hooks/ScenarioHooks';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/hooks/ApplicationHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';

import { getShareScenarioDialogLabels, getPermissionsLabels, getRolesLabels } from './labels';

export const useShareCurrentScenarioButton = () => {
  const { t } = useTranslation();

  const currentScenarioData = useCurrentScenarioData();
  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const permissionsMapping = useApplicationPermissionsMapping();

  const applyScenarioSharingSecurity = useApplyScenarioSharingSecurity();

  const shareScenarioDialogLabels = useMemo(
    () => getShareScenarioDialogLabels(t, currentScenarioData?.name),
    [currentScenarioData?.name, t]
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
    () => currentScenarioData?.security?.accessControlList ?? [],
    [currentScenarioData?.security?.accessControlList]
  );

  const defaultRole = useMemo(
    () => currentScenarioData?.security?.default || '',
    [currentScenarioData?.security?.default]
  );

  const applyScenarioSecurityChanges = useCallback(
    (newScenarioSecurity) => {
      applyScenarioSharingSecurity(currentScenarioData.id, newScenarioSecurity);
    },
    [applyScenarioSharingSecurity, currentScenarioData?.id]
  );

  return {
    userPermissionsOnCurrentScenario,
    permissionsMapping,
    shareScenarioDialogLabels,
    rolesLabels,
    permissionsLabels,
    workspaceUsers,
    accessListSpecific,
    defaultRole,
    applyScenarioSecurityChanges,
  };
};
