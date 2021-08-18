// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

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

const _getRunTemplateParametersGroupsIdsFromConfig = (runTemplateId, config) => {
  return config?.runTemplates?.[runTemplateId]?.parameterGroups;
};

const _getRunTemplateParametersGroupsIdsFromSolution = (runTemplateId, solution) => {
  const solutionRunTemplate = solution?.runTemplates && solution?.runTemplates.find(
    runTemplate => runTemplate.id === runTemplateId);
  if (!solutionRunTemplate) {
    console.warn(`Unknown run template "${runTemplateId}"`);
    return [];
  }
  return solutionRunTemplate.parameterGroups;
};

const _getRunTemplateParametersGroupsIds = (runTemplateId, solution, config) => {
  const parametersGroupsIds = _getRunTemplateParametersGroupsIdsFromConfig(runTemplateId, config);
  if (parametersGroupsIds !== undefined) {
    return parametersGroupsIds;
  }
  return _getRunTemplateParametersGroupsIdsFromSolution(runTemplateId, solution);
};

const _getParameterDataFromSolution = (parameterId, solution) => {
  const parameters = solution.parameters || [];
  return parameters.find(parameter => parameter.id === parameterId) || {};
};

const _patchParameterDataWithConfig = (parameter, parameterId, config) => {
  const parameterInConfig = config.parameters?.[parameterId];
  if (!parameterInConfig) {
    return parameter;
  }
  return {
    ...parameter,
    ...parameterInConfig
  };
};

const _generateParameterData = (parameterId, solution, config) => {
  let parameter = clone(_getParameterDataFromSolution(parameterId, solution));
  parameter = _patchParameterDataWithConfig(parameter, parameterId, config);
  if (Object.keys(parameter).length === 0) {
    console.warn(`Unknown parameter "${parameterId}"`);
    return undefined;
  }
  return parameter;
};

const _generateParametersDataForGroup = (group, solution, config) => {
  const parametersData = [];
  const parametersIds = group.parameters;
  for (const parameterId of parametersIds) {
    const parameterData = _generateParameterData(parameterId, solution, config);
    if (parameterData !== undefined) {
      parametersData.push(parameterData);
    }
  }
  return parametersData;
};

const _getParametersGroupFromSolution = (groupId, solution) => {
  const parametersGroups = solution.parameterGroups || [];
  return parametersGroups.find(group => group.id === groupId) || {};
};

const _patchParametersGroupWithConfig = (parametersGroup, groupId, config) => {
  const groupInConfig = config.parametersGroups?.[groupId];
  if (!groupInConfig) {
    return parametersGroup;
  }
  return {
    ...parametersGroup,
    ...groupInConfig
  };
};

const _generateParametersGroupData = (groupId, solution, config) => {
  let parametersGroup = _getParametersGroupFromSolution(groupId, solution);
  parametersGroup = _patchParametersGroupWithConfig(parametersGroup, groupId, config);
  if (Object.keys(parametersGroup).length === 0) {
    console.warn(`Unknown parameters group "${groupId}"`);
    return undefined;
  }
  return {
    id: groupId,
    labels: parametersGroup.labels,
    parameters: _generateParametersDataForGroup(parametersGroup, solution, config)
  };
};

const _generateParametersGroupsDataFromIds = (groupIds, solution, config) => {
  const groupsData = [];
  for (const groupId of groupIds) {
    const groupData = _generateParametersGroupData(groupId, solution, config);
    if (groupData !== undefined) {
      groupsData.push(groupData);
    }
  }
  return groupsData;
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

// Generate an array of objects that will be later used to generate tabs for each parameter group.
// Each tab will be represented by an object such as:
// {
//   id: parameter_group_id,
//   labels: dict_of_translation_labels,
//   parameters: array_of_parameters_data (id, labels, varType, read-only state, setter, minValue, maxValue)
// }
const generateParametersGroupsData = (solution, config, runTemplateId) => {
  const runTemplateParametersGroupsIds = _getRunTemplateParametersGroupsIds(runTemplateId, solution, config) || [];
  return _generateParametersGroupsDataFromIds(runTemplateParametersGroupsIds, solution, config);
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
  generateParametersGroupsData,
  getDefaultParametersValues,
  getParametersValuesForReset,
  constructParameterData,
  getValueFromParameters
};
