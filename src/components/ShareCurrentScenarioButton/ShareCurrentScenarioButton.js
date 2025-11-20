// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { RolesEditionButton } from '@cosmotech/ui';
import { useShareCurrentScenarioButton } from './ShareCurrentScenarioButtonHook';

const ShareCurrentScenarioButton = () => {
  const {
    disabled,
    hasWriteSecurityPermission,
    specificSharingRestriction,
    accessListSpecific,
    applyScenarioSecurityChanges,
    defaultRole,
    permissionsLabels,
    permissionsMapping,
    rolesLabels,
    shareScenarioDialogLabels,
    workspaceUsers,
    canBeSharedWithAgent,
  } = useShareCurrentScenarioButton();

  return (
    <RolesEditionButton
      data-cy="share-scenario-button"
      disabled={disabled}
      hasWriteSecurityPermission={hasWriteSecurityPermission}
      specificSharingRestriction={specificSharingRestriction}
      labels={shareScenarioDialogLabels}
      onConfirmChanges={applyScenarioSecurityChanges}
      resourceRolesPermissionsMapping={permissionsMapping.runner}
      agents={workspaceUsers}
      canBeSharedWithAgent={canBeSharedWithAgent}
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
