// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const merge = require('deepmerge');
const { basename, join } = require('path');
const fs = require('fs');
const { clearFileFromOutputFolder, copyConfigFileToMJS, getConfigFolder, getOutputFolder } = require('./project.js');
const { parseESFile } = require('../common/js_modules.js');
const json = require('../common/json.js');
const yaml = require('../common/yaml.js');

const replacePowerBIConstructorsInFile = (filePath) => {
  const replaceMapping = {
    'new PowerBIReportEmbedMultipleFilter': 'new GenericFilter',
    'new PowerBIReportEmbedSimpleFilter': 'new GenericFilter',
  };
  const genericFilterClassLines =
    'class GenericFilter {\n' +
    '  constructor(table, column, values) {\n' +
    '    this.table = table;\n' +
    '    this.column = column;\n' +
    '    this.values = values;\n' +
    '  }\n' +
    '}\n\n';

  let contentStr = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  contentStr = genericFilterClassLines + contentStr;
  const contentArray = contentStr.split('\n');

  // Replace specific filters constructors by generic filter constructor
  const newContentArray = contentArray.map((line) => {
    let newLine = line;
    for (const [key, value] of Object.entries(replaceMapping)) {
      newLine = newLine.replaceAll(key, value);
    }
    return newLine;
  });
  // Overwrite content of the input file
  fs.writeFileSync(filePath, newContentArray.join('\n'));
};

const fixExportsInInstanceConfigFile = (filePath) => {
  let contentStr = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

  const replaceMapping = {
    'const DATA_SOURCE': 'export const DATA_SOURCE',
    'const DATA_CONTENT': 'export const DATA_CONTENT',
  };
  for (const [key, value] of Object.entries(replaceMapping)) {
    contentStr = contentStr.replaceAll(key, value);
  }

  const contentArray = contentStr.split('\n');
  const newContentArray = contentArray.map((line) => {
    if (line.includes('module.exports')) return null;
    return line;
  });
  // Overwrite content of the input file
  fs.writeFileSync(filePath, newContentArray.join('\n'));
};

const parseHelpMenuConfigFile = async () => {
  const helpMenuConfigFilePath = join(getConfigFolder(), 'HelpMenuConfiguration.js');
  if (!fs.existsSync(helpMenuConfigFilePath)) {
    console.warn(
      'WARNING: file "HelpMenuConfiguration.js" not found in configuration folder, skipping migration of ' +
        'help menu configuration...'
    );
    return;
  }

  try {
    console.log('Parsing help menu configuration file...');
    const mjsFilePath = copyConfigFileToMJS('HelpMenuConfiguration.js');
    const helpMenuConfig = await parseESFile(mjsFilePath);
    clearFileFromOutputFolder('HelpMenuConfiguration.mjs');
    return helpMenuConfig;
  } catch (error) {
    console.log('Failed to parse help menu configuration file');
    throw error;
  }
};

const parseInstanceConfigFile = async () => {
  const instanceConfigFilePath = join(getConfigFolder(), 'InstanceVisualization.js');
  if (!fs.existsSync(instanceConfigFilePath)) {
    console.warn(
      'WARNING: file "InstanceVisualization.js" not found in configuration folder, skipping migration of ' +
        'instance view configuration...'
    );
    return;
  }

  try {
    console.log('Parsing instance view configuration file...');
    const mjsFilePath = copyConfigFileToMJS('InstanceVisualization.js');
    fixExportsInInstanceConfigFile(mjsFilePath);
    const instanceConfig = await parseESFile(mjsFilePath);
    clearFileFromOutputFolder('InstanceVisualization.mjs');
    return instanceConfig;
  } catch (error) {
    console.log('Failed to parse instance view configuration file');
    throw error;
  }
};

const parsePBIConfigFile = async () => {
  const pbiConfigFilePath = join(getConfigFolder(), 'PowerBI.js');
  if (!fs.existsSync(pbiConfigFilePath)) {
    console.warn('WARNING: file "PowerBI.js" not found in configuration folder, skipping migration of dashboards...');
    return;
  }

  try {
    console.log('Parsing dashboards configuration file...');
    const mjsFilePath = copyConfigFileToMJS('PowerBI.js');
    replacePowerBIConstructorsInFile(mjsFilePath);
    const pbiConfig = await parseESFile(mjsFilePath);
    clearFileFromOutputFolder('PowerBI.mjs');
    return pbiConfig;
  } catch (error) {
    console.log('Failed to parse PowerBI configuration file');
    throw error;
  }
};

const mergeAndDumpWorkspaceYaml = (workspaceParts, workspaceFilePath) => {
  console.log('Merging with existing workspace file...');
  const workspace = yaml.readFromFile(workspaceFilePath);
  const newWorkspace = merge(workspace, workspaceParts);
  const newWorkspaceFilePath = join(getOutputFolder(), 'mergedWorkspace.yaml');
  yaml.writeToFile(newWorkspace, newWorkspaceFilePath);

  console.log(
    'Done.\n\nThe YAML file "mergedWorkspace.yaml" has been generated in the output folder ' +
      `"${getOutputFolder()}" based on your configuration file "src/config/PowerBI.js". You can use its content ` +
      'to update your "Workspace.yaml" file'
  );
};

const parseLocalConfigFiles = async () => {
  const helpMenuConfig = await parseHelpMenuConfigFile();
  const instanceConfig = await parseInstanceConfigFile();
  const powerBIConfig = await parsePBIConfigFile();
  if (helpMenuConfig || instanceConfig || powerBIConfig)
    return {
      helpMenu: helpMenuConfig,
      instance: instanceConfig,
      powerBI: powerBIConfig,
    };
  return null;
};

const dumpWorkspaceParts = (workspaceParts) => {
  console.log('Dumping reports config...');
  const jsonFilePath = join(getOutputFolder(), 'workspace.json');
  const yamlFilePath = join(getOutputFolder(), 'workspace.yaml');
  json.writeToFile(workspaceParts, jsonFilePath);
  yaml.writeToFile(workspaceParts, yamlFilePath);
  const generatedFiles = [jsonFilePath, yamlFilePath];

  console.log(
    `Done.\n\nThe files listed below have been generated in the output folder "${getOutputFolder()}" ` +
      'based on the configuration files in "src/config". You can compare and manually merge ' +
      'these files in your "Workspace.yaml" file, or override your workspace file in the front-end ' +
      'configuration file "src/config/overrides/Workspaces.js"\n' +
      generatedFiles.map((filePath) => `  - ${basename(filePath)}`).join('\n')
  );
  console.log(
    '\nNote: if you want to merge these files with an existing "Workspace.yaml" file, you can use the option -w ' +
      ' (or --workspace) of this script, followed by the path to your "Workspace.yaml" file.'
  );
};

const forgeWorkspaceFromConfig = (config) => {
  const workspace = {
    webApp: {
      options: {},
    },
  };

  if (config.powerBI) {
    workspace.webApp.options.charts = {
      workspaceId: config.powerBI.POWER_BI_WORKSPACE_ID,
      logInWithUserCredentials: config.powerBI.USE_POWER_BI_WITH_USER_CREDENTIALS,
      scenarioViewIframeDisplayRatio: config.powerBI.SCENARIO_VIEW_IFRAME_DISPLAY_RATIO,
      dashboardsViewIframeDisplayRatio: config.powerBI.DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO,
      dashboardsView: config.powerBI.DASHBOARDS_LIST_CONFIG,
      scenarioView: config.powerBI.SCENARIO_DASHBOARD_CONFIG,
    };
  }

  if (config.helpMenu) {
    workspace.webApp.options.menu = {
      documentationUrl: config.helpMenu.DOCUMENTATION_URL,
      supportUrl: config.helpMenu.SUPPORT_URL,
      organizationUrl: config.helpMenu.COSMOTECH_URL,
    };
  }

  if (config.instance) {
    workspace.webApp.options.instanceView = {
      dataSource: config.instance.DATA_SOURCE,
      dataContent: config.instance.DATA_CONTENT,
    };
  }

  return workspace;
};

const parseAndDumpWorkspaceConfig = async (workspaceFilePath) => {
  const config = await parseLocalConfigFiles();
  if (!config) {
    console.log('No local configuration files to migrate to workspace data.');
    return;
  }

  const workspaceParts = forgeWorkspaceFromConfig(config);

  try {
    if (workspaceFilePath !== undefined) mergeAndDumpWorkspaceYaml(workspaceParts, workspaceFilePath);
    else dumpWorkspaceParts(workspaceParts);
  } catch (e) {
    console.error('Error: ' + e.message);
    console.error(e);
    process.exit(1);
  }
};

module.exports = { parseAndDumpWorkspaceConfig };
