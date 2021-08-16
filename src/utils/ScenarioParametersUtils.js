// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const _getVarTypeDefaultValue = (varType) => {
  const varTypesDefaultValues = {
    enum: null, // default value must be defined by integrator in config
    string: '',
    int: 0,
    number: 0,
    bool: false,
    date: new Date(),
    '%DATASETID%': null // no default value for datasets parts
  };
  return varTypesDefaultValues[varType];
};

const _getDefaultParameterValueFromConfig = (parameterId, configParameters) => {
  return configParameters?.[parameterId]?.defaultValue;
};

const _getDefaultParameterValueFromSolution = (parameterId, solutionParameters) => {
  const solutionParameter = solutionParameters?.find(param => param.id === parameterId);
  if (!solutionParameter) {
    console.warn(`Unknown scenario parameter "${parameterId}"`);
    return undefined;
  }
  let defaultValue = solutionParameter.defaultValue;
  if (defaultValue === null) { // No default value defined in Solution description, or unknown parameter
    defaultValue = _getVarTypeDefaultValue(solutionParameter?.varType);
  }
  return defaultValue;
};

const _getDefaultParameterValue = (parameterId, solutionParameters, configParameters) => {
  let defaultValue = _getDefaultParameterValueFromConfig(parameterId, configParameters);
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  defaultValue = _getDefaultParameterValueFromSolution(parameterId, solutionParameters);
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  console.warn(`Couldn't find default value to use for scenario parameter "${parameterId}".`);
};

const _getValueFromScenarioParametersValues = (parameterId, scenarioParametersValues) => {
  return scenarioParametersValues?.find(param => param.parameterId === parameterId)?.value;
};

const _getParameterValueForReset = (parameterId, defaultParametersValues, scenarioParametersValues) => {
  const value = _getValueFromScenarioParametersValues(parameterId, scenarioParametersValues);
  if (value !== undefined) {
    return value;
  }
  return defaultParametersValues?.[parameterId];
};

// Generate a dict of parameters values for each parameter id in the parameters array, based on the data sources below,
// in this order of priority (most important first):
//  * the default values provided in the configuration file
//  * the default values provided in the solution description
//  * default values for each varType, hard-coded in _getVarTypeDefaultValue
const getDefaultParametersValues = (parametersIds, solutionParameters, configParameters) => {
  const paramValues = {};
  for (const parameterId of parametersIds) {
    paramValues[parameterId] = _getDefaultParameterValue(parameterId, solutionParameters, configParameters);
  }
  return paramValues;
};

// Generate a dict of parameters values for each parameter id in the parameters array, based on the data sources below,
// in this order of priority (most important first):
//  * the parameters values of the scenario
//  * the default values provided in defaultParametersValues
const getParametersValuesForReset = (parametersIds, defaultParametersValues, scenarioParametersValues) => {
  const paramValues = {};
  for (const parameterId of parametersIds) {
    paramValues[parameterId] = _getParameterValueForReset(
      parameterId, defaultParametersValues, scenarioParametersValues);
  }
  return paramValues;
};

const constructParameterData = (param, value) => {
  return {
    parameterId: param.id,
    varType: param.varType,
    value: value != null ? value : param.defaultValue
  };
};

const getValueFromParameters = (parameters, parameterToSelect) => {
  if (!parameters) {
    return parameterToSelect.defaultValue;
  }
  const param = parameters.find(element => element.parameterId === parameterToSelect.id);
  if (param !== undefined) {
    return param.value;
  }
  return parameterToSelect.defaultValue;
};

export const ScenarioParametersUtils = {
  getDefaultParametersValues,
  getParametersValuesForReset,
  constructParameterData,
  getValueFromParameters
};
