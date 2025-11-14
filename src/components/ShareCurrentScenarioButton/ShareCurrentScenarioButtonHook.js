// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks';
import { ACL_ROLES, ACL_PERMISSIONS } from '../../services/config/accessControl';
import {
  useApplicationPermissionsMapping,
  useApplicationRoles,
  useApplicationPermissions,
} from '../../state/app/hooks';
import { useApplyRunnerSharingSecurity, useCurrentSimulationRunnerData } from '../../state/runner/hooks';
import { useWorkspaceData } from '../../state/workspaces/hooks';
import { SecurityUtils } from '../../utils';
import { useScenario } from '../../views/Scenario/ScenarioHook';
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
  const { missingDatasetIds, baseDatasets } = useScenario();

  const rolesLabels = useMemo(() => {
    const rolesNames = Object.values(roles.runner);
    return SecurityUtils.getRolesLabels(t, rolesNames);
  }, [roles.runner, t]);

  const permissionsLabels = useMemo(() => {
    const permissionsNames = Object.values(permissions.runner);
    return SecurityUtils.getScenarioPermissionsLabels(t, permissionsNames);
  }, [permissions.runner, t]);

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
    () => userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.RUNNER.READ_SECURITY),
    [userPermissionsOnCurrentScenario]
  );

  const baseDatasetsCannotBeShared = useMemo(() => {
    if (missingDatasetIds.length > 0) return missingDatasetIds;
    return baseDatasets
      .filter((dataset) => !dataset.security.currentUserPermissions.includes(ACL_PERMISSIONS.DATASET.WRITE_SECURITY))
      .map((dataset) => dataset.id);
  }, [missingDatasetIds, baseDatasets]);

  const workspaceUsers = useMemo(() => workspaceData.users.map((user) => ({ id: user })), [workspaceData.users]);

  const usersWithRestrictedDatasets = useMemo(() => {
    const restrictedUsers = [];
    if (baseDatasets.length === 0) return restrictedUsers;

    const rolesToAccessDataset = [
      ACL_ROLES.DATASET.VIEWER,
      ACL_ROLES.DATASET.USER,
      ACL_ROLES.DATASET.EDITOR,
      ACL_ROLES.DATASET.ADMIN,
    ];

    const baseDatasetsWithoutReadAccess = baseDatasets.filter(
      (dataset) => !rolesToAccessDataset.includes(dataset.security.default)
    );
    if (baseDatasetsWithoutReadAccess.length === 0) return restrictedUsers;

    workspaceUsers.forEach((user) => {
      const restrictedDatasetIds = [];
      baseDatasetsWithoutReadAccess.forEach((dataset) => {
        const security = dataset.security;
        if (
          !security.accessControlList.some(
            (authorizedUser) => authorizedUser.id === user.id && rolesToAccessDataset.includes(authorizedUser.role)
          )
        )
          restrictedDatasetIds.push(dataset.id);
      });
      if (restrictedDatasetIds.length > 0) {
        restrictedUsers.push({ id: user.id, restrictedDatasetIds });
      }
    });

    return restrictedUsers;
  }, [baseDatasets, workspaceUsers]);

  const canBeSharedWithUser = useCallback(
    (user) => {
      const restrictedDatasetIds = usersWithRestrictedDatasets.find(
        (usersRestricted) => usersRestricted.id === user.id
      )?.restrictedDatasetIds;

      return restrictedDatasetIds == null
        ? { canBeShared: true, reason: '' }
        : {
            canBeShared: false,
            reason: t(
              'commoncomponents.dialog.share.dialog.select.disabledUserTooltip',
              'This user does not have access to the scenario dataset "{{restrictedDatasetId}}". ' +
                'Please share this dataset with them first, or ask the dataset owner to do it.',
              { restrictedDatasetId: restrictedDatasetIds[0] }
            ),
          };
    },
    [usersWithRestrictedDatasets, t]
  );

  const shareScenarioDialogLabels = useMemo(
    () =>
      getShareScenarioDialogLabels(
        t,
        currentScenarioData?.name,
        isDirty,
        hasReadSecurityPermission,
        baseDatasetsCannotBeShared[0]
      ),
    [currentScenarioData?.name, t, isDirty, hasReadSecurityPermission, baseDatasetsCannotBeShared]
  );

  const disabled = useMemo(
    () => isDirty || !hasReadSecurityPermission || baseDatasetsCannotBeShared.length > 0,
    [isDirty, hasReadSecurityPermission, baseDatasetsCannotBeShared]
  );

  const isReadOnly = useMemo(
    () => !userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.RUNNER.WRITE_SECURITY),
    [userPermissionsOnCurrentScenario]
  );

  return {
    disabled,
    isReadOnly,
    permissionsMapping,
    shareScenarioDialogLabels,
    rolesLabels,
    permissionsLabels,
    accessListSpecific,
    defaultRole,
    applyScenarioSecurityChanges,
    baseDatasets,
    workspaceUsers,
    canBeSharedWithUser,
  };
};
