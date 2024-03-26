// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { PermissionsGate, RolesEditionButton } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useShareCurrentDatasetButton } from './ShareCurrentDatasetButtonHook';

const ShareCurrentDatasetButton = () => {
  const {
    accessListSpecific,
    updateCurrentDatasetSecurity,
    defaultRole,
    permissionsLabels,
    permissionsMapping,
    rolesLabels,
    shareDatasetDialogLabels,
    userPermissionsOnCurrentDataset,
    workspaceUsers,
  } = useShareCurrentDatasetButton();

  return (
    <>
      <PermissionsGate
        userPermissions={userPermissionsOnCurrentDataset}
        necessaryPermissions={[userPermissionsOnCurrentDataset.DATASET.READ_SECURITY]}
      >
        <PermissionsGate
          userPermissions={userPermissionsOnCurrentDataset}
          necessaryPermissions={[ACL_PERMISSIONS.DATASET.WRITE_SECURITY]}
          noPermissionProps={{ isReadOnly: true }}
        >
          <RolesEditionButton
            data-cy="share-dataset-button"
            disabled={false}
            labels={shareDatasetDialogLabels}
            onConfirmChanges={updateCurrentDatasetSecurity}
            resourceRolesPermissionsMapping={permissionsMapping.dataset}
            agents={workspaceUsers}
            specificAccessByAgent={accessListSpecific}
            defaultRole={defaultRole}
            defaultAccessScope="Organization"
            preventNoneRoleForAgents={true}
            allRoles={rolesLabels}
            allPermissions={permissionsLabels}
          />
        </PermissionsGate>
      </PermissionsGate>
    </>
  );
};

export default ShareCurrentDatasetButton;
