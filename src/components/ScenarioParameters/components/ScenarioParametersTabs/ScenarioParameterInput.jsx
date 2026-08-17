// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useStore } from 'react-redux';
import PropTypes from 'prop-types';
import { ConfigUtils } from '../../../../utils';
import { PARAMETER_CONTEXT_VIEWS } from '../../../../utils/scenarioParameters/ParameterContext';
// eslint-disable-next-line max-len
import { VAR_TYPES_COMPONENTS_MAPPING as VAR_TYPE_COMPONENTS } from '../../../../utils/scenarioParameters/VarTypesComponentsMapping';
import { useScenarioResetValues } from '../../ScenarioParametersContext';

const ScenarioParameterInput = ({ parameterData, context }) => {
  const subType = ConfigUtils.getParameterAttribute(parameterData, 'subType');
  const parameterVarType = ConfigUtils.buildExtendedVarType(parameterData.varType, subType);
  const fieldName = context?.fieldName ?? parameterData.id;

  const store = useStore();
  const { resetField } = useFormContext();
  const scenarioResetValues = useScenarioResetValues();

  const getCurrentScenarioId = useCallback(
    () => store.getState().runner?.simulationRunners?.current?.data?.id,
    [store]
  );
  const scenarioIdOnMount = useRef(getCurrentScenarioId());

  const varTypeFactory = VAR_TYPE_COMPONENTS?.[parameterVarType] ?? VAR_TYPE_COMPONENTS[parameterData.varType];
  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterVarType);
    return null;
  }
  if (varTypeFactory === null) return null;

  const factoryRules = varTypeFactory.useValidationRules ? varTypeFactory.useValidationRules(parameterData) : {};
  const isDatasetManagerView = context?.view === PARAMETER_CONTEXT_VIEWS.DATASET_MANAGER;

  return (
    <Controller
      name={fieldName}
      defaultValue={context?.defaultValue}
      rules={factoryRules}
      render={({ field, fieldState }) => {
        const { value: parameterValue, onChange: setRhfValue } = field;
        const { isDirty, error } = fieldState;
        const setParameterValue = (newValue) => {
          if (scenarioIdOnMount.current === getCurrentScenarioId()) setRhfValue(newValue);
        };

        const resetParameterValue = (newDefaultValue) => {
          if (scenarioIdOnMount.current === getCurrentScenarioId())
            resetField(fieldName, { defaultValue: newDefaultValue });
        };

        const props = {
          parameterData,
          context,
          key: fieldName,
          parameterValue,
          setParameterValue,
          isDirty: isDatasetManagerView ? null : isDirty,
          defaultParameterValue: scenarioResetValues?.[fieldName],
          resetParameterValue,
          error,
        };
        // name property helps distinguish React components from factories
        if ('name' in varTypeFactory) return React.createElement(varTypeFactory, props);

        // Factories as a function are not supported
        throw new Error(`
          Factories as a function are no longer supported for scenario parameter input.
          Please update your factories to React components (see migration guide for further instructions).
        `);
      }}
    />
  );
};

ScenarioParameterInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};

export default ScenarioParameterInput;
