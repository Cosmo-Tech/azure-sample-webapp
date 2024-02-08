// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { PermissionsGate, RolesEditionButton } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useShareCurrentScenarioButton } from './ShareCurrentScenarioButtonHook';

const ShareCurrentScenarioButton = () => {
  const {
    isDirty,
    accessListSpecific,
    applyScenarioSecurityChanges,
    defaultRole,
    permissionsLabels,
    permissionsMapping,
    rolesLabels,
    shareScenarioDialogLabels,
    userPermissionsOnCurrentScenario,
    workspaceUsers,
  } = useShareCurrentScenarioButton();

  return (
    <>
      <PermissionsGate
        userPermissions={userPermissionsOnCurrentScenario}
        necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.READ_SECURITY]}
      >
        <PermissionsGate
          userPermissions={userPermissionsOnCurrentScenario}
          necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE_SECURITY]}
          noPermissionProps={{ isReadOnly: true }}
        >
          <RolesEditionButton
            data-cy="share-scenario-button"
            disabled={isDirty}
            labels={shareScenarioDialogLabels}
            onConfirmChanges={applyScenarioSecurityChanges}
            resourceRolesPermissionsMapping={permissionsMapping.scenario}
            agents={workspaceUsers}
            specificAccessByAgent={accessListSpecific}
            defaultRole={defaultRole}
            defaultAccessScope="Workspace"
            preventNoneRoleForAgents={true}
            allRoles={rolesLabels}
            allPermissions={permissionsLabels}
          />
        </PermissionsGate>
      </PermissionsGate>
    </>
  );
};

export default ShareCurrentScenarioButton;
