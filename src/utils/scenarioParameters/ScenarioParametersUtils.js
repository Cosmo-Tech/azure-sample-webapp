// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { ConfigUtils } from '../ConfigUtils';
import { RunnersUtils } from '../RunnersUtils';
import { SolutionsUtils } from '../SolutionsUtils';
import { VAR_TYPES_DEFAULT_VALUES } from './DefaultValues';
import { forgeFileParameter, forgeFileParameterFromDatasetPart } from './FileParameterUtils';

const clone = rfdc();

const shouldForceScenarioParametersUpdate = (runTemplateParametersIds, parametersValues, solutionData) => {
  const hiddenParametersIds = [
    'ScenarioName',
    'ScenarioId',
    'MasterId',
    'RunTemplateName',
    'ParentId',
    'ScenarioLastRunId',
    'ParentLastRunId',
    'MasterLastRunId',
  ];
  const dynamicParametersIds = solutionData?.parameters
    ?.filter((parameter) => parameter.options?.dynamicValues)
    .map((parameter) => parameter.id);
  const isDynamicValueUploaded = Object.keys(parametersValues).some(
    (parameterId) =>
      dynamicParametersIds?.includes(parameterId) &&
      parametersValues[parameterId]?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD
  );
  return (
    isDynamicValueUploaded || runTemplateParametersIds.some((parameterId) => hiddenParametersIds.includes(parameterId))
  );
};

const _buildScenarioParameter = (parameterId, varType, value) => {
  if (parameterId && varType) {
    return { parameterId, varType, value: value ?? '' };
  }
  return undefined;
};

function _addOrReplaceScenarioParameter(parameterId, varType, value, parameters) {
  const newParameter = _buildScenarioParameter(parameterId, varType, value);
  if (newParameter === undefined) {
    return;
  }

  const previousParameterIndex = parameters.findIndex((parameter) => parameter.parameterId === parameterId);
  if (previousParameterIndex === -1) {
    parameters.push(newParameter);
  } else {
    parameters[previousParameterIndex] = newParameter;
  }
}

function _getParentScenarioLastRunId(scenarioData, scenarios) {
  if (scenarioData.parentId) {
    const parentScenario = scenarios.find((scenario) => scenario.id === scenarioData.parentId);
    if (parentScenario) {
      return RunnersUtils.getLastRunId(parentScenario);
    } else {
      console.warn(
        "Cannot build value for parameter 'ParentLastRunId', because scenario parent with id " +
          `"${scenarioData.parentId}" could not be found. Either this parent scenario does not exist, or you don't ` +
          'have access to it.'
      );
    }
  }
  return undefined;
}

function _getRootScenarioLastRunId(scenarioData, scenarios) {
  if (scenarioData.rootId) {
    const rootScenario = scenarios.find((scenario) => scenario.id === scenarioData.rootId);
    if (rootScenario) {
      return RunnersUtils.getLastRunId(rootScenario);
    } else {
      console.warn(
        "Cannot build value for parameter 'MasterLastRunId', because root scenario with id " +
          `"${scenarioData.rootId}" could not be found. Either this root scenario does not exist, or you don't ` +
          'have access to it.'
      );
    }
  }
  return undefined;
}

function _addHiddenParameters(parameters, scenarioData, scenarios, runTemplateParametersIds) {
  if (scenarioData == null || scenarios == null || scenarios.length === 0) {
    return parameters;
  }

  const parameterValueGetterFunctionMap = {
    ScenarioName: () => scenarioData.name,
    ScenarioId: () => scenarioData.id,
    MasterId: () => scenarioData.rootId,
    RunTemplateName: () => scenarioData.runTemplateName,
    ParentId: () => scenarioData.parentId,
    ScenarioLastRunId: () => scenarioData?.lastRunId,
    ParentLastRunId: () => _getParentScenarioLastRunId(scenarioData, scenarios),
    MasterLastRunId: () => _getRootScenarioLastRunId(scenarioData, scenarios),
  };

  for (const [parameterId, getParameter] of Object.entries(parameterValueGetterFunctionMap)) {
    if (runTemplateParametersIds.includes(parameterId))
      _addOrReplaceScenarioParameter(parameterId, 'string', getParameter(), parameters);
  }
  return parameters;
}

const _getVarTypeDefaultValue = (varType, subType) => {
  const extendedVarType = ConfigUtils.buildExtendedVarType(varType, subType);
  if (extendedVarType in VAR_TYPES_DEFAULT_VALUES) {
    return VAR_TYPES_DEFAULT_VALUES[extendedVarType];
  }
  return VAR_TYPES_DEFAULT_VALUES[varType];
};

const _findParameterInSolutionParametersById = (parameterId, solutionParameters) => {
  return solutionParameters?.find((param) => param.id === parameterId);
};

function _getDefaultParameterValueFromDefaultValues(solutionParameter, parameterVarType) {
  const subType = ConfigUtils.getParameterAttribute(solutionParameter, 'subType');
  return _getVarTypeDefaultValue(parameterVarType, subType);
}

const _getDefaultParameterValue = (parameterId, solutionParameters) => {
  const solutionParameter = _findParameterInSolutionParametersById(parameterId, solutionParameters);
  if (!solutionParameter) {
    console.warn(`Unknown scenario parameter "${parameterId}"`);
    return undefined;
  }
  if (solutionParameter.options?.dynamicValues) return null;
  let defaultValue = solutionParameter.defaultValue;
  // defaultValue might not be in parameter data for parameters overridden by local config; when sent by the back-end,
  // parameters should always have a defaultValue property, that will be set to 'null' by default
  if (!('defaultValue' in solutionParameter) || defaultValue === null) {
    const parameterVarType = solutionParameter?.varType;
    defaultValue = _getDefaultParameterValueFromDefaultValues(solutionParameter, parameterVarType);
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  console.warn(
    `Couldn't find default value to use for scenario parameter "${parameterId}". Its varType may not be ` +
      'defined, or its default value may be set to undefined ' +
      '(in this case, please use "null" instead of "undefined").'
  );
};

const _getRunTemplateParametersGroupsIds = (runTemplateId, solution) => {
  const solutionRunTemplate =
    solution?.runTemplates && solution?.runTemplates.find((runTemplate) => runTemplate.id === runTemplateId);
  if (!solutionRunTemplate) {
    console.warn(`Unknown run template "${runTemplateId}"`);
    return [];
  }
  return solutionRunTemplate.parameterGroups;
};

const _getParameterMetadataFromSolution = (parameterId, solution) => {
  const parameters = solution.parameters ?? [];
  return parameters.find((parameter) => parameter.id === parameterId) ?? {};
};

const _generateParameterMetadata = (parameterId, solution) => {
  const parameter = clone(_getParameterMetadataFromSolution(parameterId, solution));
  if (Object.keys(parameter).length === 0) {
    console.warn(`Unknown parameter "${parameterId}"`);
    return undefined;
  }
  return parameter;
};

const _generateParametersMetadataForGroup = (group, solution) => {
  return _generateParametersMetadataList(solution, group.parameters);
};

const _getParametersGroupFromSolution = (groupId, solution) => {
  const parametersGroups = solution.parameterGroups ?? [];
  return parametersGroups.find((group) => group.id === groupId) ?? {};
};

const _generateParametersGroupMetadata = (groupId, solution) => {
  const parametersGroup = _getParametersGroupFromSolution(groupId, solution);
  if (Object.keys(parametersGroup).length === 0) {
    console.warn(`Unknown parameters group "${groupId}"`);
    return undefined;
  }

  return {
    id: groupId,
    labels: parametersGroup.labels,
    parameters: _generateParametersMetadataForGroup(parametersGroup, solution),
    options: {
      ...parametersGroup?.options,
      authorizedRoles: ConfigUtils.getParametersGroupAttribute(parametersGroup, 'authorizedRoles') ?? [],
      hideParameterGroupIfNoPermission:
        ConfigUtils.getParametersGroupAttribute(parametersGroup, 'hideParameterGroupIfNoPermission') ?? false,
    },
  };
};

const _generateParametersGroupsMetadataFromIds = (groupIds, solution) => {
  const groupsMetadata = [];
  for (const groupId of groupIds) {
    const groupMetadata = _generateParametersGroupMetadata(groupId, solution);
    if (groupMetadata !== undefined) {
      groupsMetadata.push(groupMetadata);
    }
  }
  return groupsMetadata;
};

// Generate a dict of parameters values for each parameter id in the parameters array, based on the data sources below,
// in this order of priority (most important first):
//  * the default values provided in the solution description (or in the "overrides" configuration file if provided)
//  * default values for each varType, hard-coded in _getVarTypeDefaultValue
const getDefaultParametersValues = (parametersIds, solutionParameters) => {
  const paramValues = {};
  for (const parameterId of parametersIds) {
    paramValues[parameterId] = _getDefaultParameterValue(parameterId, solutionParameters);
  }
  return paramValues;
};

// Generate a dict of parameters values for each parameter id in the parameters array, based on the data sources below,
// in this order of priority (most important first):
//  * the runner parameters values and parameter datasets
//  * the default values provided in defaultParametersValues
const getParametersValuesForReset = (parameterIds, defaultParametersValues, runner, solution) => {
  const parameterValues = {};
  // FIXME: remove this when back-end bug is fixed (listAllRunners and patchRunner endpoints don't return datasets
  const FALLBACK_DATASETS_TO_REMOVE = [
    {
      createInfo: { timestamp: 1762798370011, userId: 'tristan.huet@cosmotech.com' },
      datasetId: 'd-yr7g1mz2dlop6',
      description: null,
      id: 'dp-9qv2yrj2rjmmq',
      name: 'initial_stock_dataset',
      organizationId: 'o-0wl82j3nlvwy1',
      sourceName: 'customers.csv',
      tags: [],
      type: 'File',
      updateInfo: { timestamp: 1762798370011, userId: 'tristan.huet@cosmotech.com' },
      workspaceId: 'w-1qq3x178qk5m3',
    },
  ];

  const runnerDatasetParameters = runner?.datasets?.parameters ?? FALLBACK_DATASETS_TO_REMOVE;

  for (const parameterId of parameterIds) {
    const parameter = SolutionsUtils.getParameterFromSolution(solution, parameterId);
    const varType = parameter?.varType;
    const subType = ConfigUtils.getParameterAttribute(parameter, 'subType');
    if (ConfigUtils.isDatasetPartVarType(varType)) {
      const datasetPart = RunnersUtils.findParameterInDatasetParts(parameterId, runnerDatasetParameters);
      if (datasetPart !== undefined)
        parameterValues[parameterId] = forgeFileParameterFromDatasetPart(datasetPart, varType, subType);
      else {
        parameterValues[parameterId] = forgeFileParameter(parameterId, varType, subType, null);
        // FIXME: handle default values
        // else parameterValues[parameterId] = defaultParametersValues?.[parameterId];
      }
    } else {
      const runnerParameter = runner.parametersValues?.find((parameter) => parameter.parameterId === parameterId);
      parameterValues[parameterId] = runnerParameter?.value ?? defaultParametersValues?.[parameterId];
    }
  }
  return parameterValues;
};

const _generateParametersMetadataList = (solution, parametersIds) => {
  const parametersMetadataList = [];
  for (const parameterId of parametersIds) {
    const parameterData = _generateParameterMetadata(parameterId, solution);
    if (parameterData !== undefined) {
      parametersMetadataList.push(parameterData);
    }
  }
  return parametersMetadataList;
};

// Generate a map of objects containing the metadata of all parameters from solution description
const generateParametersMetadata = (solution, parametersIds) => {
  const parametersMetadataList = _generateParametersMetadataList(solution, parametersIds);
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
const generateParametersGroupsMetadata = (solution, runTemplateId) => {
  const runTemplateParametersGroupsIds = _getRunTemplateParametersGroupsIds(runTemplateId, solution) ?? [];
  return _generateParametersGroupsMetadataFromIds(runTemplateParametersGroupsIds, solution);
};

const buildParameterForUpdateRequest = (solution, parameterId, parameterValue) => {
  const varType = SolutionsUtils.getParameterVarType(solution, parameterId);
  const parameter = { parameterId, varType, value: parameterValue };
  if (parameterValue == null || !ConfigUtils.isDatasetPartVarType(varType)) return parameter;

  if (ConfigUtils.isFileParameter(parameter)) {
    let file = parameterValue.file;
    if (file == null && parameterValue.serializedData != null)
      file = new File([parameterValue.serializedData], parameterId, { type: 'text/plain' });

    if (file == null && parameterValue.status !== UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) return null;
    // FIXME: handle file removal
    return { parameterId, varType, value: { file, part: { name: parameterId, sourceName: file?.name } } };
  }
  console.warn(`Var type "${varType}" is not supported`);

  return parameter;
};

// Returns an object with 3 fields dbDatasetParts, fileDatasetParts and nonDatasetParts, containing the parameter data
//required for runner update requests
const buildParametersForUpdateRequest = (
  solution,
  parameterValues,
  runTemplateParametersIds,
  selectedScenario,
  allScenarios
) => {
  const parameters = { dbDatasetParts: [], fileDatasetParts: [], nonDatasetParts: [] };
  for (const parameterId of runTemplateParametersIds) {
    const parameterValue = parameterValues[parameterId];
    if (parameterValue == null) continue;

    const parameter = buildParameterForUpdateRequest(solution, parameterId, parameterValue);
    if (parameter == null) continue;

    if (ConfigUtils.isFileParameter(parameter)) parameters.fileDatasetParts.push(parameter);
    else if (ConfigUtils.isDBParameter(parameter)) parameters.dbDatasetParts.push(parameter);
    else parameters.nonDatasetParts.push(parameter);
  }
  _addHiddenParameters(parameters.nonDatasetParts, selectedScenario, allScenarios, runTemplateParametersIds);
  return parameters;
};

const getErrorsCountByTab = (tabs, errors) => {
  return Object.assign(
    {},
    ...tabs.map((tab) => ({
      [tab.id]:
        tab.parameters?.map((param) => param.id)?.filter((parameter) => Object.keys(errors ?? {}).includes(parameter))
          ?.length ?? 0,
    }))
  );
};

export const ScenarioParametersUtils = {
  generateParametersMetadata,
  generateParametersGroupsMetadata,
  getDefaultParametersValues,
  getParametersValuesForReset,
  buildParametersForUpdateRequest,
  shouldForceScenarioParametersUpdate,
  getErrorsCountByTab,
};
