// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParameterInputFactory } from './ScenarioParameterInputFactory';
import { PermissionsGate } from '../../../components';

const noPermissionsPlaceHolder = (t) => {
  return <div>{t('genericcomponent.text.scenario.parameters.tabs.placeholder')}</div>;
};

const groupContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
};

const create = (t, datasets, parametersGroupData, parametersState, setParametersState, editMode) => {
  return (
    <PermissionsGate
      RenderNoPermissionComponent={() => noPermissionsPlaceHolder(t)}
      authorizedRoles={parametersGroupData.authorizedRoles}
    >
      <div key={parametersGroupData.id} style={groupContainerStyle}>
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
