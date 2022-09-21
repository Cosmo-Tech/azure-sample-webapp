// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useRef } from 'react';
import { ConfigUtils } from '../../../../utils/ConfigUtils';
import { VAR_TYPES_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/VarTypesComponentsMapping';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';

const ScenarioParameterInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const parameterVarType = ConfigUtils.buildExtendedVarType(parameterData.varType, parameterData.subType);
  let varTypeFactory;

  const store = useStore();

  const currentScenarioId = useCallback(() => store.getState().scenario?.current?.data?.id, [store]);
  const scenarioIdOnMount = useRef(currentScenarioId());

  const setParametersStateSecure = useCallback(
    (...args) => {
      if (scenarioIdOnMount.current === currentScenarioId()) {
        setParametersState(...args);
      }
    },
    [currentScenarioId, setParametersState]
  );

  if (parameterVarType in VAR_TYPES_COMPONENTS_MAPPING) {
    varTypeFactory = VAR_TYPES_COMPONENTS_MAPPING[parameterVarType];
  } else {
    varTypeFactory = VAR_TYPES_COMPONENTS_MAPPING[parameterData.varType];
  }

  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterVarType);
    return null;
  }
  if (varTypeFactory === null) {
    return null;
  }

  const props = {
    parameterData,
    parametersState,
    setParametersState: setParametersStateSecure,
    context,
    key: parameterData.id,
  };
  // name property helps distinguish React components from factories
  if ('name' in varTypeFactory) {
    return React.createElement(varTypeFactory, props);
  }
  console.warn("Warning: Factories are now deprecated and won't be supported in the next major version of the webapp");
  return varTypeFactory.create(t, parameterData, parametersState, setParametersStateSecure, context);
};
ScenarioParameterInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParameterInput;
