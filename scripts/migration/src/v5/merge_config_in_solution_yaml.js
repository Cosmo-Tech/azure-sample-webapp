// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join } = require('path');
const fs = require('fs');
const { clearFileFromOutputFolder, copyConfigFileToMJS, getConfigFolder, getOutputFolder } = require('./project.js');
const { parseESFile } = require('../common/js_modules.js');
const yaml = require('../common/yaml.js');

const preventRolesImportInFile = (filePath) => {
  const rolesReplaceMapping = {
    'APP_ROLES.OrganizationAdmin': "'Organization.Admin'",
    'APP_ROLES.OrganizationCollaborator': "'Organization.Collaborator'",
    'APP_ROLES.OrganizationModeler': "'Organization.Modeler'",
    'APP_ROLES.OrganizationUser': "'Organization.User'",
    'APP_ROLES.OrganizationViewer': "'Organization.Viewer'",
    'APP_ROLES.PlatformAdmin': "'Platform.Admin'",
  };

  const contentStr = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  const contentArray = contentStr.split('\n');
  // Remove line importing the APP_ROLES constant if it exists
  const patterns = ['import', 'APP_ROLES'];
  const isRolesImportLine = (line) => patterns.every((pattern) => line.includes(pattern));
  const importLineIndex = contentArray.findIndex((line) => isRolesImportLine(line));
  contentArray.splice(importLineIndex, 1);
  // Replace mentions of APP_ROLES object
  const newContentArray = contentArray.map((line) => {
    let newLine = line;
    for (const [roleKey, roleValue] of Object.entries(rolesReplaceMapping)) {
      newLine = newLine.replaceAll(roleKey, roleValue);
    }
    return newLine;
  });
  // Overwrite content of the input file
  fs.writeFileSync(filePath, newContentArray.join('\n'));
};

const parseScenarioParametersConfigFile = async () => {
  const mjsFilePath = copyConfigFileToMJS('ScenarioParameters.js');
  preventRolesImportInFile(mjsFilePath);
  const scenarioParametersConfig = await parseESFile(mjsFilePath);
  clearFileFromOutputFolder('ScenarioParameters.mjs');
  return scenarioParametersConfig;
};

const reshapeObjectToArrayOfObjects = (object) => {
  const arrayOfObjects = [];
  for (const [key, value] of Object.entries(object)) {
    arrayOfObjects.push({
      id: key,
      ...value,
    });
  }
  return arrayOfObjects;
};

const reshapeSolutionConfig = (solutionConfig) => ({
  parameters: reshapeObjectToArrayOfObjects(solutionConfig.parameters),
  parameterGroups: reshapeObjectToArrayOfObjects(solutionConfig.parametersGroups), // Mind the key name
  runTemplates: reshapeObjectToArrayOfObjects(solutionConfig.runTemplates),
});

const moveKeysInConfig = (solutionConfig) => {
  const _deleteAndMoveKeyToOptions = (parent, key) => {
    if (parent[key] !== undefined) {
      parent.options = {
        ...parent.options,
        [key]: parent[key],
      };
    }
    delete parent[key];
  };

  const parametersKeysToMoveInOptions = [
    'enumValues',
    'connectorId',
    'description',
    'defaultFileTypeFilter',
    'subType',
    'columns',
    'hasHeader',
    'dateFormat',
  ];
  solutionConfig.parameters.forEach((parameter) => {
    parametersKeysToMoveInOptions.forEach((keyToMoveInOptions) => {
      _deleteAndMoveKeyToOptions(parameter, keyToMoveInOptions);
    });
  });

  const parametersGroupsKeysToMoveInOptions = ['authorizedRoles', 'hideParameterGroupIfNoPermission'];
  solutionConfig.parameterGroups.forEach((parametersGroup) => {
    parametersGroupsKeysToMoveInOptions.forEach((keyToMoveInOptions) => {
      _deleteAndMoveKeyToOptions(parametersGroup, keyToMoveInOptions);
    });
  });
};

const dumpParametersToYAML = (scenarioParametersConfig) => {
  const filePath = join(getOutputFolder(), 'parameters.yaml');
  yaml.writeToFile({ parameters: scenarioParametersConfig.parameters }, filePath);
};

const dumpParametersGroupsToYAML = (scenarioParametersConfig) => {
  const filePath = join(getOutputFolder(), 'parameterGroups.yaml');
  yaml.writeToFile({ parameterGroups: scenarioParametersConfig.parameterGroups }, filePath);
};

const dumpRunTemplatesToYAML = (scenarioParametersConfig) => {
  const filePath = join(getOutputFolder(), 'runTemplates.yaml');
  yaml.writeToFile({ runTemplates: scenarioParametersConfig.runTemplates }, filePath);
};

const mergeConfigParts = (part1, part2) => {
  return part1
    .map((el1) => ({
      ...el1,
      ...part2.find((el2) => el1.id === el2.id),
    }))
    .concat(part2.filter((el2) => !part1.some((el1) => el1.id === el2.id)));
};

const mergeAndDumpSolutionYaml = (scenarioParametersConfig, solutionFilePath) => {
  const solution = yaml.readFromFile(solutionFilePath);
  const newSolution = {
    ...solution,
    parameters: mergeConfigParts(solution.parameters, scenarioParametersConfig.parameters),
    parameterGroups: mergeConfigParts(solution.parameterGroups, scenarioParametersConfig.parameterGroups),
    runTemplates: mergeConfigParts(solution.runTemplates, scenarioParametersConfig.runTemplates),
  };
  const newSolutionFilePath = join(getOutputFolder(), 'mergedSolution.yaml');
  yaml.writeToFile(newSolution, newSolutionFilePath);
};

const dumpConfigToYaml = async (solutionFilePath) => {
  const scenarioParametersConfigFilePath = join(getConfigFolder(), 'ScenarioParameters.js');
  if (!fs.existsSync(scenarioParametersConfigFilePath)) {
    console.warn(
      'WARNING: file "ScenarioParameters.js" not found in configuration folder, skipping migration of ' +
        'scenario parameters...'
    );
    return;
  }

  try {
    console.log('Parsing scenario parameters configuration file...');
    const scenarioParameters = await parseScenarioParametersConfigFile();
    const scenarioParametersConfig = reshapeSolutionConfig(scenarioParameters.SCENARIO_PARAMETERS_CONFIG);
    moveKeysInConfig(scenarioParametersConfig);

    if (solutionFilePath !== undefined) {
      console.log('Merging with existing solution file...');
      mergeAndDumpSolutionYaml(scenarioParametersConfig, solutionFilePath);
      console.log(
        `Done.\n\nThe YAML file "mergedSolution.yaml" has been generated in the output folder "${getOutputFolder()}" ` +
          'based on your configuration file "src/config/ScenarioParameters.js". You can use its content to update ' +
          'your "Solution.yaml" file'
      );
      return;
    }

    console.log('Dumping parameters...');
    dumpParametersToYAML(scenarioParametersConfig);
    console.log('Dumping parameters groups...');
    dumpParametersGroupsToYAML(scenarioParametersConfig);
    console.log('Dumping run templates...');
    dumpRunTemplatesToYAML(scenarioParametersConfig);

    console.log(
      `Done.\n\nThe YAML files listed below have been generated in the output folder "${getOutputFolder()}" ` +
        'based on the configuration file "src/config/ScenarioParameters.js". You can compare and manually merge ' +
        'these files in your "Solution.yaml" file\n' +
        '  - parameters.yaml\n' +
        '  - parameterGroups.yaml\n' +
        '  - runTemplates.yaml'
    );
    console.log(
      '\nIf you want to merge these files in an existing "Solution.yaml" file, you can use the option -s ' +
        ' (or --solution) of this script, followed by the path to your "Solution.yaml" file.'
    );
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { dumpConfigToYaml };
