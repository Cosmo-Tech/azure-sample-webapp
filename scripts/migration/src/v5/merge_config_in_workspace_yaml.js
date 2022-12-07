// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join } = require('path');
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
    for (const [key2, value2] of Object.entries(replaceMapping)) {
      newLine = newLine.replaceAll(key2, value2);
    }
    return newLine;
  });
  // Overwrite content of the input file
  fs.writeFileSync(filePath, newContentArray.join('\n'));
};

const parsePBIConfigFile = async () => {
  const mjsFilePath = copyConfigFileToMJS('PowerBI.js');
  replacePowerBIConstructorsInFile(mjsFilePath);
  const pbiConfig = await parseESFile(mjsFilePath);
  clearFileFromOutputFolder('PowerBI.mjs');
  return pbiConfig;
};

const mergeAndDumpWorkspaceYaml = (powerBIConfig, workspaceFilePath) => {
  const workspace = yaml.readFromFile(workspaceFilePath);

  const newWorkspace = {
    ...workspace,
    webapp: {
      options: {
        charts: {
          workspaceId: powerBIConfig.POWER_BI_WORKSPACE_ID,
          logInWithUserCredentials: powerBIConfig.USE_POWER_BI_WITH_USER_CREDENTIALS,
          scenarioViewIframeDisplayRatio: powerBIConfig.SCENARIO_VIEW_IFRAME_DISPLAY_RATIO,
          dashboardsViewIframeDisplayRatio: powerBIConfig.DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO,
          dashboardsView: powerBIConfig.DASHBOARDS_LIST_CONFIG,
          scenarioView: powerBIConfig.SCENARIO_DASHBOARD_CONFIG,
        },
      },
    },
  };

  const newWorkspaceFilePath = join(getOutputFolder(), 'mergedWorkspace.yaml');
  yaml.writeToFile(newWorkspace, newWorkspaceFilePath);
};

const dumpDashboardsViewReportsToJSON = (pbiConfig) => {
  const filePath = join(getOutputFolder(), 'dashboardsViewReports.json');
  json.writeToFile({ dashboardsView: pbiConfig.DASHBOARDS_LIST_CONFIG }, filePath);
};

const dumpScenarioViewReportsToJSON = (pbiConfig) => {
  const filePath = join(getOutputFolder(), 'scenarioViewReports.json');
  json.writeToFile({ scenarioView: pbiConfig.SCENARIO_DASHBOARD_CONFIG }, filePath);
};

const dumpDashboardsViewReportsToYAML = (pbiConfig) => {
  const filePath = join(getOutputFolder(), 'dashboardsViewReports.yaml');
  yaml.writeToFile({ dashboardsView: pbiConfig.DASHBOARDS_LIST_CONFIG }, filePath);
};

const dumpScenarioViewReportsToYAML = (pbiConfig) => {
  const filePath = join(getOutputFolder(), 'scenarioViewReports.yaml');
  yaml.writeToFile({ scenarioView: pbiConfig.SCENARIO_DASHBOARD_CONFIG }, filePath);
};

const dumpConfigToYaml = async (workspaceFilePath) => {
  const pbiConfigFilePath = join(getConfigFolder(), 'PowerBI.js');
  if (!fs.existsSync(pbiConfigFilePath)) {
    console.warn('WARNING: file "PowerBI.js" not found in configuration folder, skipping migration of dashboards...');
    return;
  }

  try {
    console.log('Parsing dashboards configuration file...');
    const powerBIConfig = await parsePBIConfigFile();

    if (workspaceFilePath !== undefined) {
      console.log('Merging with existing workspace file...');
      mergeAndDumpWorkspaceYaml(powerBIConfig, workspaceFilePath);
      console.log(
        'Done.\n\nThe YAML file "mergedWorkspace.yaml" has been generated in the output folder ' +
          `"${getOutputFolder()}" based on your configuration file "src/config/PowerBI.js". You can use its content ` +
          'to update your "Workspace.yaml" file'
      );
      return;
    }

    console.log('Dumping reports config...');
    dumpDashboardsViewReportsToJSON(powerBIConfig);
    dumpScenarioViewReportsToJSON(powerBIConfig);
    dumpDashboardsViewReportsToYAML(powerBIConfig);
    dumpScenarioViewReportsToYAML(powerBIConfig);

    console.log(
      `Done.\n\nThe files listed below have been generated in the output folder "${getOutputFolder()}" ` +
        'based on the configuration file "src/config/PowerBI.js". You can compare and manually merge ' +
        'these files in your "Workspace.yaml" file, or override your workspace file in the front-end ' +
        'configuration file "src/config/overrides/Workspaces.js"\n' +
        '  - dashboardsViewReports.json\n' +
        '  - dashboardsViewReports.yaml\n' +
        '  - scenarioViewReports.json\n' +
        '  - scenarioViewReports.yaml'
    );
    console.log(
      '\nIf you want to merge these files in an existing "Workspace.yaml" file, you can use the option -w ' +
        ' (or --workspace) of this script, followed by the path to your "Workspace.yaml" file.'
    );
  } catch (e) {
    console.error('Error: ' + e.message);
    console.error(e);
    process.exit(1);
  }
};

module.exports = { dumpConfigToYaml };
