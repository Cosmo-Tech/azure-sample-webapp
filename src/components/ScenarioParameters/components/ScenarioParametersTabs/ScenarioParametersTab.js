// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import ScenarioParameterInput from './ScenarioParameterInput';
import { PermissionsGate } from '../../../index';
import PropTypes from 'prop-types';
import { t } from 'i18next';

const ScenarioParametersTab = ({ parametersGroupData, parametersState, setParametersState, context }) => {
  const noPermissionsPlaceHolder = (t) => {
    return <div>{t('genericcomponent.text.scenario.parameters.tabs.placeholder')}</div>;
  };

  const groupContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };
  return (
    <PermissionsGate
      RenderNoPermissionComponent={() => noPermissionsPlaceHolder(t)}
      authorizedRoles={parametersGroupData.authorizedRoles}
    >
      <div key={parametersGroupData.id} style={groupContainerStyle}>
        {parametersGroupData.parameters.map((parameterData) => (
          <ScenarioParameterInput
            key={parameterData.id}
            parameterData={parameterData}
            parametersState={parametersState}
            setParametersState={setParametersState}
            context={context}
          />
        ))}
      </div>
    </PermissionsGate>
  );
};
ScenarioParametersTab.propTypes = {
  parametersGroupData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParametersTab;
