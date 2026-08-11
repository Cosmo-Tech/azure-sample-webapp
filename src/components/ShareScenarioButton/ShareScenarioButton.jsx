// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { RolesEditionButton } from '@cosmotech/ui';
import { useShareScenarioButton } from './ShareScenarioButtonHook';

const ShareScenarioButton = ({ scenarioId, RolesEditionButtonProps }) => {
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
  } = useShareScenarioButton(scenarioId);

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
      preventNoneRoleForAgents
      allRoles={rolesLabels}
      allPermissions={permissionsLabels}
      variant="icon"
      {...RolesEditionButtonProps}
    />
  );
};

ShareScenarioButton.propTypes = {
  scenarioId: PropTypes.string,
  RolesEditionButtonProps: PropTypes.object,
};

export default ShareScenarioButton;
