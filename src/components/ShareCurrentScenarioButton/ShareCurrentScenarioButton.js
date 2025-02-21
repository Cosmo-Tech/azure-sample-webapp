// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { RolesEditionButton } from '@cosmotech/ui';
import { useShareCurrentScenarioButton } from './ShareCurrentScenarioButtonHook';

const ShareCurrentScenarioButton = () => {
  const {
    disabled,
    isReadOnly,
    accessListSpecific,
    applyScenarioSecurityChanges,
    defaultRole,
    permissionsLabels,
    permissionsMapping,
    rolesLabels,
    shareScenarioDialogLabels,
    workspaceUsers,
  } = useShareCurrentScenarioButton();

  return (
    <RolesEditionButton
      data-cy="share-scenario-button"
      disabled={disabled}
      isReadOnly={isReadOnly}
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
      isIconButton={true}
    />
  );
};

export default ShareCurrentScenarioButton;
