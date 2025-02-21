// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/hooks/ApplicationHooks';
import { useCurrentScenarioData, useApplyScenarioSharingSecurity } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { SecurityUtils } from '../../utils/SecurityUtils';
import { getShareScenarioDialogLabels } from './labels';

export const useShareCurrentScenarioButton = () => {
  const { t } = useTranslation();
  const { isDirty } = useFormState();

  const currentScenarioData = useCurrentScenarioData();
  const workspaceData = useWorkspaceData();

  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();

  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const permissionsMapping = useApplicationPermissionsMapping();

  const applyScenarioSharingSecurity = useApplyScenarioSharingSecurity();

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.scenario);
    return SecurityUtils.getRolesLabels(t, rolesNames);
  }, [roles.scenario, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.scenario);
    return SecurityUtils.getScenarioPermissionsLabels(t, permissionsNames);
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

  const hasReadSecurityPermission = useMemo(
    () => userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.SCENARIO.READ_SECURITY),
    [userPermissionsOnCurrentScenario]
  );
  const disabled = useMemo(() => isDirty || !hasReadSecurityPermission, [isDirty, hasReadSecurityPermission]);
  const isReadOnly = useMemo(
    () => !userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.SCENARIO.WRITE_SECURITY),
    [userPermissionsOnCurrentScenario]
  );

  const shareScenarioDialogLabels = useMemo(
    () => getShareScenarioDialogLabels(t, currentScenarioData?.name, isDirty, hasReadSecurityPermission),
    [currentScenarioData?.name, t, isDirty, hasReadSecurityPermission]
  );

  return {
    disabled,
    isReadOnly,
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
