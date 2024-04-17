// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { PermissionsGate, RolesEditionButton } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useShareDatasetButton } from './ShareDatasetButtonHook';

const ShareDatasetButton = (props) => {
  const { dataset } = props;
  const {
    accessListSpecific,
    updateDatasetSecurity,
    defaultRole,
    permissionsLabels,
    permissionsMapping,
    rolesLabels,
    shareDatasetDialogLabels,
    getUserPermissionOnDataset,
    workspaceUsers,
  } = useShareDatasetButton();

  const datasetId = dataset?.id;

  return (
    <>
      <PermissionsGate
        userPermissions={getUserPermissionOnDataset(datasetId)}
        necessaryPermissions={[ACL_PERMISSIONS.DATASET.READ_SECURITY]}
      >
        <PermissionsGate
          userPermissions={getUserPermissionOnDataset(datasetId)}
          necessaryPermissions={[ACL_PERMISSIONS.DATASET.WRITE_SECURITY]}
          noPermissionProps={{ isReadOnly: true }}
        >
          <RolesEditionButton
            disabled={false}
            isIconButton={true}
            labels={shareDatasetDialogLabels(datasetId)}
            onConfirmChanges={(security) => updateDatasetSecurity(datasetId, security)}
            resourceRolesPermissionsMapping={permissionsMapping.dataset}
            agents={workspaceUsers}
            specificAccessByAgent={accessListSpecific(datasetId)}
            defaultRole={defaultRole(datasetId)}
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

export default ShareDatasetButton;

ShareDatasetButton.propTypes = {
  dataset: PropTypes.object.isRequired,
};
