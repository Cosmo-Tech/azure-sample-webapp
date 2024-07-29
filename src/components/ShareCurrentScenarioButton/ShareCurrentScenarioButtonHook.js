// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/hooks/ApplicationHooks';
import { useApplyRunnerSharingSecurity, useCurrentSimulationRunnerData } from '../../state/hooks/RunnerHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { SecurityUtils } from '../../utils';
import { getShareScenarioDialogLabels } from './labels';

export const useShareCurrentScenarioButton = () => {
  const { t } = useTranslation();
  const { isDirty } = useFormState();

  const currentScenarioData = useCurrentSimulationRunnerData();
  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const permissionsMapping = useApplicationPermissionsMapping();

  const applyScenarioSharingSecurity = useApplyRunnerSharingSecurity();

  const shareScenarioDialogLabels = useMemo(
    () => getShareScenarioDialogLabels(t, currentScenarioData?.name, isDirty),
    [currentScenarioData?.name, t, isDirty]
  );

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.runner);
    return SecurityUtils.getRolesLabels(t, rolesNames);
  }, [roles.runner, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.runner);
    return SecurityUtils.getScenarioPermissionsLabels(t, permissionsNames);
  }, [permissions.runner, t]);

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
    isDirty,
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
