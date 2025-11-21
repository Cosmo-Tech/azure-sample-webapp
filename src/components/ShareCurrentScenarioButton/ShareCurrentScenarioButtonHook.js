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

  const workspaceUsers = useMemo(() => workspaceData.users.map((user) => ({ id: user })), [workspaceData.users]);

  const usersWithRestrictedDatasets = useMemo(() => {
    const restrictedUsers = [];
    if (baseDatasets.length === 0) return restrictedUsers;

    workspaceUsers.forEach((user) => {
      const restrictedDatasets = baseDatasets.filter((dataset) => {
        const userPermissions = SecurityUtils.getUserPermissionsForResource(
          dataset.security,
          user.id,
          permissionsMapping.dataset
        );
        return !userPermissions.includes(ACL_PERMISSIONS.DATASET.READ);
      });
      if (restrictedDatasets.length > 0) restrictedUsers.push({ id: user.id, restrictedDatasets });
    });

    return restrictedUsers;
  }, [baseDatasets, workspaceUsers, permissionsMapping]);

  const canBeSharedWithAgent = useCallback(
    (user) => {
      const restrictedDatasets = usersWithRestrictedDatasets.find(
        (usersRestricted) => usersRestricted.id === user.id
      )?.restrictedDatasets;
      if (restrictedDatasets == null || restrictedDatasets.length === 0) return null;

      const restrictedDataset = restrictedDatasets[0].name;
      return t(
        'commoncomponents.dialog.share.dialog.select.disabledUserTooltip',
        'This user does not have access to the scenario dataset "{{restrictedDataset}}". ' +
          'Please share this dataset with them first, or ask the dataset owner to do it.',
        { restrictedDataset }
      );
    },
    [usersWithRestrictedDatasets, t]
  );

  const disabled = useMemo(() => isDirty || !hasReadSecurityPermission, [isDirty, hasReadSecurityPermission]);

  const hasWriteSecurityPermission = useMemo(
    () => userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.RUNNER.WRITE_SECURITY),
    [userPermissionsOnCurrentScenario]
  );

  const specificSharingRestriction = useMemo(() => {
    if (missingDatasetIds.length > 0)
      return t(
        'commoncomponents.dialog.share.button.noAccessToBaseDatasetsTooltip',
        'Cannot share this scenario because you cannot share its base dataset "{{restrictedDatasetId}}". Please ' +
          'request the "admin" role on this dataset first, or ask the dataset owner to share this scenario for you.',
        { restrictedDatasetId: missingDatasetIds[0] }
      );

    const missingWriteSecurityPermissionsDatasets = baseDatasets.filter(
      (dataset) => !dataset.security.currentUserPermissions.includes(ACL_PERMISSIONS.DATASET.WRITE_SECURITY)
    );
    if (missingWriteSecurityPermissionsDatasets.length > 0)
      return t(
        'commoncomponents.dialog.share.button.cannotShareBaseDatasetsTooltip',
        'Cannot share this scenario because you do not have access to its base dataset "{{restrictedDataset}}". ' +
          'If you do not know the dataset owner, please contact your administrator.',
        { restrictedDataset: missingWriteSecurityPermissionsDatasets[0].name }
      );

    return null;
  }, [baseDatasets, missingDatasetIds, t]);

  const shareScenarioDialogLabels = useMemo(
    () => getShareScenarioDialogLabels(t, currentScenarioData?.name, isDirty, hasReadSecurityPermission),
    [currentScenarioData?.name, t, isDirty, hasReadSecurityPermission]
  );

  return {
    disabled,
    hasWriteSecurityPermission,
    specificSharingRestriction,
    canBeSharedWithAgent,
    permissionsMapping,
    shareScenarioDialogLabels,
    rolesLabels,
    permissionsLabels,
    accessListSpecific,
    defaultRole,
    applyScenarioSecurityChanges,
    workspaceUsers,
  };
};
