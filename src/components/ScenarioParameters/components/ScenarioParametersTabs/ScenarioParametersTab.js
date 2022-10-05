// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';

import { connect, useSelector } from 'react-redux';
import ScenarioParameterInput from './ScenarioParameterInput';
import { PermissionsGate } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { t } from 'i18next';

const ScenarioParametersTab = ({ parametersGroupData, parametersState, setParametersState, context, userAppRole }) => {
  const noPermissionsPlaceHolder = (t) => {
    return <div>{t('genericcomponent.text.scenario.parameters.tabs.placeholder')}</div>;
  };

  const scenarioId = useSelector((state) => state.scenario?.current?.data?.id);

  const groupContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };
  return (
    <PermissionsGate
      RenderNoPermissionComponent={() => noPermissionsPlaceHolder(t)}
      // FIXME : check roles vs permissions usage
      necessaryPermissions={parametersGroupData.authorizedRoles}
      sufficientPermissions={parametersGroupData.authorizedRoles}
      userPermissions={[userAppRole]}
    >
      <div key={parametersGroupData.id} style={groupContainerStyle}>
        {parametersGroupData.parameters.map((parameterData) => (
          <ScenarioParameterInput
            key={`${scenarioId}_${parameterData.id}`}
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
  userAppRole: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userAppRole: state.auth.role,
});

export default connect(mapStateToProps)(ScenarioParametersTab);
