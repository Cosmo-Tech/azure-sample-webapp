// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { VAR_TYPES_DEFAULT_VALUES } from './DefaultValues';

const clone = rfdc();

const _getVarTypeDefaultValue = (varType) => {
  return VAR_TYPES_DEFAULT_VALUES[varType];
};

const _getDefaultParameterValueFromConfig = (parameterId, configParameters) => {
  return configParameters?.[parameterId]?.defaultValue;
};

const _findParameterInSolutionParametersById = (parameterId, solutionParameters) => {
  return solutionParameters?.find((param) => param.id === parameterId);
};

const _getDefaultParameterValueFromSolution = (parameterId, solutionParameters) => {
  const solutionParameter = _findParameterInSolutionParametersById(parameterId, solutionParameters);
  if (!solutionParameter) {
    console.warn(`Unknown scenario parameter "${parameterId}"`);
    return undefined;
  }
  let defaultValue = solutionParameter.defaultValue;
  if (defaultValue === null) {
    // No default value defined in Solution description, or unknown parameter
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

const _findParameterInScenarioParametersValues = (parameterId, scenarioParametersValues) => {
  return scenarioParametersValues?.find((param) => param.parameterId === parameterId);
};

const _getParameterValueForReset = (datasets, parameterId, defaultParametersValues, scenarioParametersValues) => {
  const parameter = _findParameterInScenarioParametersValues(parameterId, scenarioParametersValues);
  const value = parameter?.value;
  if (value === undefined) {
    return defaultParametersValues?.[parameterId];
  }
  return value;
};

const _getRunTemplateParametersGroupsIdsFromConfig = (runTemplateId, config) => {
  return config?.runTemplates?.[runTemplateId]?.parameterGroups;
};

const _getRunTemplateParametersGroupsIdsFromSolution = (runTemplateId, solution) => {
  const solutionRunTemplate =
    solution?.runTemplates && solution?.runTemplates.find((runTemplate) => runTemplate.id === runTemplateId);
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

const _getParameterMetadataFromSolution = (parameterId, solution) => {
  const parameters = solution.parameters || [];
  return parameters.find((parameter) => parameter.id === parameterId) || {};
};

const _patchParameterMetadataWithConfig = (parameter, parameterId, config) => {
  const parameterInConfig = config.parameters?.[parameterId];
  if (!parameterInConfig) {
    return parameter;
  }
  return {
    ...parameter,
    ...parameterInConfig,
  };
};

const _generateParameterMetadata = (parameterId, solution, config) => {
  let parameter = clone(_getParameterMetadataFromSolution(parameterId, solution));
  parameter = _patchParameterMetadataWithConfig(parameter, parameterId, config);
  if (Object.keys(parameter).length === 0) {
    console.warn(`Unknown parameter "${parameterId}"`);
    return undefined;
  }
  return parameter;
};

const _generateParametersMetadataForGroup = (group, solution, config) => {
  return _generateParametersMetadataList(solution, config, group.parameters);
};

const _getParametersGroupFromSolution = (groupId, solution) => {
  const parametersGroups = solution.parameterGroups || [];
  return parametersGroups.find((group) => group.id === groupId) || {};
};

const _patchParametersGroupWithConfig = (parametersGroup, groupId, config) => {
  const groupInConfig = config.parametersGroups?.[groupId];
  if (!groupInConfig) {
    return parametersGroup;
  }
  return {
    ...parametersGroup,
    ...groupInConfig,
  };
};

const _generateParametersGroupMetadata = (groupId, solution, config) => {
  let parametersGroup = _getParametersGroupFromSolution(groupId, solution);
  parametersGroup = _patchParametersGroupWithConfig(parametersGroup, groupId, config);
  if (Object.keys(parametersGroup).length === 0) {
    console.warn(`Unknown parameters group "${groupId}"`);
    return undefined;
  }
  return {
    id: groupId,
    labels: parametersGroup.labels,
    parameters: _generateParametersMetadataForGroup(parametersGroup, solution, config),
  };
};

const _generateParametersGroupsMetadataFromIds = (groupIds, solution, config) => {
  const groupsMetadata = [];
  for (const groupId of groupIds) {
    const groupMetadata = _generateParametersGroupMetadata(groupId, solution, config);
    if (groupMetadata !== undefined) {
      groupsMetadata.push(groupMetadata);
    }
  }
  return groupsMetadata;
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
const getParametersValuesForReset = (datasets, parametersIds, defaultParametersValues, scenarioParametersValues) => {
  const paramValues = {};
  for (const parameterId of parametersIds) {
    paramValues[parameterId] = _getParameterValueForReset(
      datasets,
      parameterId,
      defaultParametersValues,
      scenarioParametersValues
    );
  }
  return paramValues;
};

const _generateParametersMetadataList = (solution, config, parametersIds) => {
  const parametersMetadataList = [];
  for (const parameterId of parametersIds) {
    const parameterData = _generateParameterMetadata(parameterId, solution, config);
    if (parameterData !== undefined) {
      parametersMetadataList.push(parameterData);
    }
  }
  return parametersMetadataList;
};

// Generate a map of objects containing the metadata of all parameters, from solution description and configuration
// file.
const generateParametersMetadata = (solution, config, parametersIds) => {
  const parametersMetadataList = _generateParametersMetadataList(solution, config, parametersIds);
  const parametersMetadataMap = {};
  for (const parameterMetadata of parametersMetadataList) {
    parametersMetadataMap[parameterMetadata.id] = parameterMetadata;
  }
  return parametersMetadataMap;
};

// Generate an array of objects that will be later used to generate tabs for each parameter group.
// Each tab will be represented by an object such as:
// {
//   id: parameter_group_id,
//   labels: dict_of_translation_labels,
//   parameters: array_of_parameters_data (id, labels, varType, read-only state, setter, minValue, maxValue)
// }
const generateParametersGroupsMetadata = (solution, config, runTemplateId) => {
  const runTemplateParametersGroupsIds = _getRunTemplateParametersGroupsIds(runTemplateId, solution, config) || [];
  return _generateParametersGroupsMetadataFromIds(runTemplateParametersGroupsIds, solution, config);
};

const getParameterVarType = (solution, parameterId) => {
  return _findParameterInSolutionParametersById(parameterId, solution.parameters)?.varType;
};

const _buildParameterForUpdate = (solution, parameters, parameterId) => {
  const parameterVarType = getParameterVarType(solution, parameterId);
  const parameterValue = parameters[parameterId];
  return {
    parameterId: parameterId,
    varType: parameterVarType,
    value: parameterValue,
  };
};

const buildParametersForUpdate = (solution, parametersValues, runTemplateParametersIds) => {
  let parameters = [];
  for (const parameterId of runTemplateParametersIds) {
    const parameter = _buildParameterForUpdate(solution, parametersValues, parameterId);
    if (parameter.value !== null) {
      parameters = parameters.concat(parameter);
    }
  }
  return parameters;
};

export const ScenarioParametersUtils = {
  generateParametersMetadata,
  generateParametersGroupsMetadata,
  getDefaultParametersValues,
  getParametersValuesForReset,
  buildParametersForUpdate,
  getParameterVarType,
};
