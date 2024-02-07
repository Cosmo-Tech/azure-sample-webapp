// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { ResourceUtils } from '@cosmotech/core';
import { PermissionsGate, CreateScenarioButton as CreateScenarioButtonUI } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useCreateScenarioButton } from './CreateScenarioButtonHook';

const CreateScenarioButton = ({ disabled, onScenarioCreated }) => {
  const {
    createScenario,
    createScenarioDialogLabels,
    currentScenario,
    filteredAndTranslatedRunTemplates,
    solution,
    user,
    userPermissionsOnCurrentWorkspace,
    workspaceId,
    filteredDatasets,
    scenarios,
  } = useCreateScenarioButton({ disabled, onScenarioCreated });
  const sortedScenarioList = ResourceUtils.getResourceTree(scenarios);

  return (
    <PermissionsGate
      userPermissions={userPermissionsOnCurrentWorkspace}
      necessaryPermissions={[ACL_PERMISSIONS.WORKSPACE.CREATE_CHILDREN]}
      noPermissionProps={{
        disabled: true, // Prevent scenario creation if user has insufficient privileges
      }}
    >
      <CreateScenarioButtonUI
        solution={solution}
        workspaceId={workspaceId}
        createScenario={createScenario}
        currentScenario={currentScenario}
        runTemplates={filteredAndTranslatedRunTemplates}
        datasets={filteredDatasets}
        scenarios={sortedScenarioList}
        user={user}
        disabled={disabled}
        labels={createScenarioDialogLabels}
      />
    </PermissionsGate>
  );
};

CreateScenarioButton.propTypes = {
  disabled: PropTypes.bool,
  onScenarioCreated: PropTypes.func,
};

CreateScenarioButton.defaultProps = {
  disabled: false,
};

export default CreateScenarioButton;
