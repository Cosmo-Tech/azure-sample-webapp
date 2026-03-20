// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const path = require('path');
const fs = require('fs');
const { checkFileExists } = require('../common/check.js');
const json = require('../common/json.js');
const yaml = require('../common/yaml.js');

const checkArgs = (args) => {
  if (args.solution == null && args.workspace == null) {
    console.error('Error: No input file provided. Please provide at least one of --solution or --workspace.');
    process.exit(1);
  }
  checkFileExists(args.solution, 'Solution');
  checkFileExists(args.workspace, 'Workspace');
};

const parseFile = (filePath) => {
  if (filePath == null) return null;
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.json') return json.readFromFile(filePath);
  if (ext === '.yaml' || ext === '.yml') return yaml.readFromFile(filePath);
  console.error(`Error: unsupported file extension "${ext}" for file "${filePath}". Expected .json, .yaml or .yml.`);
  process.exit(1);
};

const parseInputFiles = (args) => {
  const solution = parseFile(args.solution);
  const workspace = parseFile(args.workspace);
  return { solution, workspace };
};

const DROPPED_SOLUTION_ROOT_KEYS = ['csmSimulator', 'ownerId'];

const DROPPED_RUN_TEMPLATE_KEYS = [
  'csmSimulation',
  'noDataIngestionState',
  'fetchDatasets',
  'scenarioDataDownloadTransform',
  'fetchScenarioParameters',
  'applyParameters',
  'validateData',
  'sendDatasetsToDataWarehouse',
  'sendInputParametersToDataWarehouse',
  'preRun',
  'run',
  'postRun',
  'parametersJson',
  'parametersHandlerSource',
  'datasetValidatorSource',
  'preRunSource',
  'runSource',
  'postRunSource',
  'scenariodataTransformSource',
  'stackSteps',
  'gitRepositoryUrl',
  'gitBranchName',
  'runTemplateSourceDir',
  'orchestratorType',
  'deleteHistoricalData',
];

const dropKeys = (obj, keys) => keys.forEach((key) => delete obj[key]);

const renameOptionsToAdditionalData = (obj) => {
  if ('options' in obj) {
    obj.additionalData = obj.options;
    delete obj.options;
  }
};

const migrateDynamicValuesParameters = (parameters) => {
  const migrated = [];
  parameters?.forEach((param) => {
    if (
      param.additionalData?.dynamicValues !== undefined &&
      !('datasetPartName' in param.additionalData.dynamicValues)
    ) {
      param.additionalData.dynamicValues.datasetPartName = 'TODO';
      migrated.push(param.id);
    }
  });
  if (migrated.length > 0) {
    console.log(
      `Added placeholder "datasetPartName" in "dynamicValues" for parameters: ${migrated.join(', ')}.\n` +
        `Please update the "dynamicValues" field for these parameters. See documentation:\n` +
        `https://github.com/Cosmo-Tech/azure-sample-webapp/blob/v7.0.1-vanilla/doc/scenarioParametersConfiguration.md`
    );
  }
};

const migrateDatasetIdParameters = (parameters) => {
  const migrated = [];
  const droppedDefaultValueParamIds = [];
  parameters?.forEach((param) => {
    if (param.varType === '%DATASETID%') {
      param.varType = '%DATASET_PART_ID_FILE%';
      if (param?.additionalData?.connectorId) delete param.additionalData.connectorId;
      migrated.push(param.id);
      if ('defaultValue' in param) {
        delete param.defaultValue;
        droppedDefaultValueParamIds.push(param.id);
      }
    }
  });
  if (migrated.length > 0)
    console.log(`Updated varType to %DATASET_PART_ID_FILE% for parameters: ${migrated.join(', ')}`);
  if (droppedDefaultValueParamIds.length > 0) {
    console.log(
      `Dropped "defaultValue" for parameters: ${droppedDefaultValueParamIds.join(', ')}.\n` +
        `Please follow the instructions to set default values for dataset part parameters. See documentation:\n` +
        // eslint-disable-next-line max-len
        `https://github.com/Cosmo-Tech/azure-sample-webapp/blob/v7.0.1-vanilla/doc/scenarioParametersConfiguration.md#default-values-for-dataset-part-parameters`
    );
  }
  return droppedDefaultValueParamIds;
};

const migrateSolutionFile = (solution) => {
  if (solution == null) return { solution: null, droppedDefaultValueParamIds: [] };
  dropKeys(solution, DROPPED_SOLUTION_ROOT_KEYS);
  solution.runTemplates?.forEach((runTemplate) => dropKeys(runTemplate, DROPPED_RUN_TEMPLATE_KEYS));
  solution.parameters?.forEach(renameOptionsToAdditionalData);
  solution.parameterGroups?.forEach(renameOptionsToAdditionalData);
  const droppedDefaultValueParamIds = migrateDatasetIdParameters(solution.parameters);
  migrateDynamicValuesParameters(solution.parameters);
  return { solution, droppedDefaultValueParamIds };
};

const DROPPED_WORKSPACE_ROOT_KEYS = [
  'linkedDatasetIdList',
  'ownerId',
  'sendInputToDataWarehouse',
  'useDedicatedEventHubNamespace',
  'dedicatedEventHubSasKeyName',
  'dedicatedEventHubAuthenticationStrategy',
  'sendScenarioRunToEventHub',
  'sendScenarioMetadataToEventHub',
];

const migrateWorkspaceFile = (workspace, droppedDefaultValueParamIds = []) => {
  if (workspace == null) return null;
  dropKeys(workspace, DROPPED_WORKSPACE_ROOT_KEYS);
  if (droppedDefaultValueParamIds.length > 0) {
    workspace.solution ??= {};
    workspace.solution.datasetId ??= 'TODO';
    workspace.solution.defaultParameterValues ??= {};
    droppedDefaultValueParamIds.forEach((id) => {
      workspace.solution.defaultParameterValues[id] ??= 'TODO';
    });
  }
  if (workspace.webApp != null) {
    if (workspace.webApp.options !== undefined) {
      workspace.additionalData = {
        ...workspace.additionalData,
        webapp: { ...workspace.additionalData?.webapp, ...workspace.webApp.options },
      };
    }
    delete workspace.webApp;
  }
  const SOLUTION_KEYS_TO_MOVE = ['runTemplateFilter', 'defaultRunTemplateDataset'];
  SOLUTION_KEYS_TO_MOVE.forEach((key) => {
    if (workspace.solution?.[key] !== undefined) {
      workspace.additionalData ??= {};
      workspace.additionalData.webapp ??= {};
      workspace.additionalData.webapp.solution ??= {};
      workspace.additionalData.webapp.solution[key] = workspace.solution[key];
      delete workspace.solution[key];
    }
  });
  const datasetManager = workspace.additionalData?.webapp?.datasetManager;
  if (datasetManager !== undefined) {
    if ('graphIndicators' in datasetManager) {
      datasetManager.kpiCards = datasetManager.graphIndicators;
      delete datasetManager.graphIndicators;
    }
    const queries = datasetManager.queries;
    if (queries !== undefined) {
      const migrated = [];
      queries.forEach((query) => {
        if (!('datasetPartName' in query)) {
          query.datasetPartName = 'TODO';
          migrated.push(query.id ?? JSON.stringify(query));
        }
      });
      if (migrated.length > 0) {
        console.log(
          `Added placeholder "datasetPartName" in datasetManager queries: ${migrated.join(', ')}.\n` +
            `Please update these queries. See documentation:\n` +
            // eslint-disable-next-line max-len
            `https://github.com/Cosmo-Tech/azure-sample-webapp/blob/v7.0.1-vanilla/doc/datasetManager_datasetOverview.md`
        );
      }
    }
  }
  return workspace;
};

const OUTPUT_DIR = 'config_v7';

const exportFile = async (obj, inputFilePath, format) => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const baseName = path.basename(inputFilePath, path.extname(inputFilePath));
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.${format}`);
  if (format === 'yaml') {
    yaml.writeToFile(obj, outputPath);
  } else {
    await json.writeToFile(obj, outputPath);
  }
  console.log(`Exported: ${outputPath}`);
};

const run = async (args) => {
  checkArgs(args);
  const { solution, workspace } = parseInputFiles(args);
  const { droppedDefaultValueParamIds } = migrateSolutionFile(solution);
  migrateWorkspaceFile(workspace, droppedDefaultValueParamIds);
  if (solution != null) await exportFile(solution, args.solution, args.format);
  if (workspace != null) await exportFile(workspace, args.workspace, args.format);
};

module.exports = { run };
