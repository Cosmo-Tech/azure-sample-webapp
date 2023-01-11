// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { ConfigUtils } from '../../../../utils/ConfigUtils';
import { VAR_TYPES_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/VarTypesComponentsMapping';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';

const ScenarioParameterInput = ({ parameterData, context }) => {
  const { t } = useTranslation();
  const subType = ConfigUtils.getParameterAttribute(parameterData, 'subType');
  const parameterVarType = ConfigUtils.buildExtendedVarType(parameterData.varType, subType);
  let varTypeFactory;

  const store = useStore();

  const getCurrentScenarioId = useCallback(() => store.getState().scenario?.current?.data?.id, [store]);
  const scenarioIdOnMount = useRef(getCurrentScenarioId());

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

  return (
    <Controller
      name={parameterData.id}
      render={(rhfProps) => {
        const { value: parameterValue, onChange: setRhfValue } = rhfProps.field;
        const { isDirty } = rhfProps.fieldState;

        const setParameterValue = (newValue, updateDirty = true) => {
          if (scenarioIdOnMount.current === getCurrentScenarioId()) {
            setRhfValue(newValue);
          }
        };

        const props = {
          parameterData,
          context,
          key: parameterData.id,
          parameterValue,
          setParameterValue,
          isDirty,
        };
        // name property helps distinguish React components from factories
        if ('name' in varTypeFactory) {
          return React.createElement(varTypeFactory, props);
        }
        console.warn(
          "Warning: Factories are now deprecated and won't be supported in the next major version of the webapp"
        );
        return varTypeFactory.create(t, parameterData, context, parameterValue, setParameterValue);
      }}
    />
  );
};
ScenarioParameterInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParameterInput;
