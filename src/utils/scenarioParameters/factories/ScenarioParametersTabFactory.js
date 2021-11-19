// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParameterInputFactory } from './ScenarioParameterInputFactory';
import { PermissionsGate } from '../../../components';
import { PROFILES } from '../../../config/Profiles';

// TODO add t as props and use it instead of hardcoded sentence
const noPermissionsPlaceHolder = () => {
  return (
    <div>
      <span>
        {
          "These parameters are confidential and you don't have permission to get access to them. If think this is a \
          mistake, please contact your application administrator."
        }
      </span>
    </div>
  );
};

// TODO move to core and add unit tests
function _extractRolesFromProfiles(profiles) {
  let requiredRoles = [];
  if (profiles) {
    for (const profile of profiles) {
      requiredRoles = [...new Set([...requiredRoles, ...PROFILES[profile]])];
    }
  }
  return requiredRoles;
}

const create = (t, datasets, parametersGroupData, parametersState, setParametersState, editMode) => {
  const requiredRoles = _extractRolesFromProfiles(parametersGroupData.requiredProfiles);
  return (
    <PermissionsGate RenderNoPermissionComponent={noPermissionsPlaceHolder} requiredPermissions={requiredRoles}>
      <div key={parametersGroupData.id}>
        {parametersGroupData.parameters.map((parameterData) =>
          ScenarioParameterInputFactory.create(
            t,
            datasets,
            parameterData,
            parametersState,
            setParametersState,
            editMode
          )
        )}
      </div>
    </PermissionsGate>
  );
};

export const ScenarioParametersTabFactory = {
  create,
};
