// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join } = require('path');
const fs = require('fs');
const { getConfigFolder, getOutputFolder, getTemplatesFolder, OPTIONAL_CONFIG_FILES } = require('./project.js');

const createOutputFolder = () => {
  fs.mkdirSync(getOutputFolder(), { recursive: true });
};

const copyFileToOutputFolder = (fileName, newFileName) => {
  if (!newFileName) newFileName = fileName;
  const oldFilePath = join(getConfigFolder(), fileName);
  const newFilePath = join(getOutputFolder(), newFileName);
  fs.copyFileSync(oldFilePath, newFilePath);
};

const clearFileFromOutputFolder = (fileName) => {
  const filePath = join(getOutputFolder(), fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const createFileFromTemplate = (templateFileName, outputFileName, replaceDict) => {
  const templateFilePath = join(getTemplatesFolder(), templateFileName);
  const outputFilePath = join(getOutputFolder(), outputFileName);
  const templateContentStr = fs.readFileSync(templateFilePath, { encoding: 'utf8', flag: 'r' });
  let outputContentStr = templateContentStr;
  for (const [pattern, replaceValue] of Object.entries(replaceDict)) {
    const patternRegexp = new RegExp(pattern, 'g');
    outputContentStr = outputContentStr.replace(patternRegexp, replaceValue);
  }
  fs.writeFileSync(outputFilePath, outputContentStr);
};

const copyConfigFileToMJS = (fileName) => {
  const newFileName = fileName.substr(0, fileName.length - 2) + 'mjs';
  const oldFilePath = join(getConfigFolder(), fileName);
  const newFilePath = join(getOutputFolder(), newFileName);
  fs.copyFileSync(oldFilePath, newFilePath);
};

const renameDashboardsConfigFile = () => {
  copyFileToOutputFolder('Dashboards.js', 'PowerBI.js');
};

const copyUnaffectedFiles = () => {
  for (const fileName of OPTIONAL_CONFIG_FILES) {
    const oldFilePath = join(getConfigFolder(), fileName);
    if (fs.existsSync(oldFilePath)) {
      copyFileToOutputFolder(fileName);
    } else {
      const vanillaFileName = fileName.slice(0, fileName.length - 2).concat('vanilla.js');
      const vanillaFilePath = join(getTemplatesFolder(), vanillaFileName);
      const outputFilePath = join(getOutputFolder(), fileName);
      fs.copyFileSync(vanillaFilePath, outputFilePath);
    }
  }
};

const copyAndFillScenarioParametersFile = (config) => {
  const oldFilePath = join(getConfigFolder(), 'ScenarioParameters.js');
  const newFilePath = join(getOutputFolder(), 'ScenarioParameters.js');
  const oldContentStr = fs.readFileSync(oldFilePath, { encoding: 'utf8', flag: 'r' });
  const oldContentArray = oldContentStr.split('\n');
  // findLast not supported by Node 16, using 'find' here (expecting only one occurence of SCENARIO_PARAMETERS_CONFIG
  // in the config file)
  const exportLineIndex = oldContentArray.findIndex((line) => line.includes('SCENARIO_PARAMETERS_CONFIG'));
  const newLines = [
    '// Additional parameters to put in scenario parameters',
    `export const ADD_SCENARIO_NAME_PARAMETER = ${config.ADD_SCENARIO_NAME_PARAMETER || false};`,
    `export const ADD_SCENARIO_ID_PARAMETER = ${config.ADD_SCENARIO_ID_PARAMETER || false};`,
    `export const ADD_SCENARIO_LAST_RUN_ID_PARAMETER = ${config.ADD_SCENARIO_LAST_RUN_ID_PARAMETER || false};`,
    `export const ADD_SCENARIO_PARENT_ID_PARAMETER = ${config.ADD_SCENARIO_PARENT_ID_PARAMETER || false};`,
    `export const ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER = ${
      config.ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER || false
    };`,
    `export const ADD_SCENARIO_MASTER_ID_PARAMETER = ${config.ADD_SCENARIO_MASTER_ID_PARAMETER || false};`,
    `export const ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER = ${
      config.ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER || false
    };`,
    `export const ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER = ${
      config.ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER || false
    };`,
    '',
  ];
  const arrayStart = oldContentArray.slice(0, exportLineIndex);
  const arrayEnd = oldContentArray.slice(exportLineIndex, oldContentArray.length - 1);
  const outputContentStr = arrayStart.concat(newLines).concat(arrayEnd).join('\n');
  fs.writeFileSync(newFilePath, outputContentStr);
};

const copyAndFillPowerBIFile = (config) => {
  // PowerBI.js file has already been renamed and copied into output folder, read it from output folder
  const oldFilePath = join(getOutputFolder(), 'PowerBI.js');
  const newFilePath = join(getOutputFolder(), 'PowerBI.js');
  const oldContentStr = fs.readFileSync(oldFilePath, { encoding: 'utf8', flag: 'r' });
  const oldContentArray = oldContentStr.split('\n');
  // findLast not supported by Node 16, using 'find' here (expecting only one occurence of @cosmotech/azure in the
  // config file)
  const importLineIndex = oldContentArray.findIndex((line) => line.includes('@cosmotech/azure'));
  const newLines = [
    '',
    '// Power BI embedding mode',
    `export const USE_POWER_BI_WITH_USER_CREDENTIALS = ${config.USE_POWER_BI_WITH_USER_CREDENTIALS || false};`,
    `export const POWER_BI_WORKSPACE_ID = '${config.POWER_BI_WORKSPACE_ID || ''}';`,
    `export const SCENARIO_VIEW_IFRAME_DISPLAY_RATIO = ${config.SCENARIO_VIEW_IFRAME_DISPLAY_RATIO || '1580 / 350'};`,
    `export const DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO = ${
      config.DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO || '1280 / 795'
    };`,
    '',
    '// Dashboards configuration',
  ];
  const arrayStart = oldContentArray.slice(0, importLineIndex + 1);
  const arrayEnd = oldContentArray.slice(importLineIndex + 1, oldContentArray.length - 1);
  const outputContentStr = arrayStart.concat(newLines).concat(arrayEnd).join('\n');
  fs.writeFileSync(newFilePath, outputContentStr);
};

const parseAppConfigurationFile = async () => {
  copyConfigFileToMJS('AppConfiguration.js');
  const appConfig = await parseESConfigFile(join(getOutputFolder(), 'AppConfiguration.mjs'));
  clearFileFromOutputFolder('AppConfiguration.mjs');
  return appConfig;
};

const parseAppInstanceFile = async () => {
  copyConfigFileToMJS('AppInstance.js');
  const appInstance = await parseESConfigFile(join(getOutputFolder(), 'AppInstance.mjs'));
  clearFileFromOutputFolder('AppInstance.mjs');
  return appInstance;
};

const createApplicationInsightsConfigFile = async (config) => {
  const replaceDict = {
    __ENABLE_APPLICATION_INSIGHTS__: config.ENABLE_APPLICATION_INSIGHTS,
    __APPLICATION_INSIGHTS_INSTRUMENTATION_KEY__: config.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
  };
  createFileFromTemplate('ApplicationInsights.tpl.js', 'ApplicationInsights.js', replaceDict);
};

const createGlobalConfigurationConfigFile = async (config) => {
  const replaceDict = {
    __AZURE_TENANT_ID__: config.AZURE_TENANT_ID,
    __APP_REGISTRATION_CLIENT_ID__: config.APP_REGISTRATION_CLIENT_ID,
    __COSMOTECH_API_SCOPE__: config.COSMOTECH_API_SCOPE,
    __DEFAULT_BASE_PATH__: config.DEFAULT_BASE_PATH,
    __ORGANIZATION_ID__: config.ORGANIZATION_ID,
    __WORKSPACE_ID__: config.WORKSPACE_ID,
  };
  createFileFromTemplate('GlobalConfiguration.tpl.js', 'GlobalConfiguration.js', replaceDict);
};

const createHelpMenuConfigurationConfigFile = async (config) => {
  const replaceDict = {
    __APP_VERSION__: config.APP_VERSION || 'process.env.REACT_APP_VERSION',
    __SUPPORT_URL__: config.SUPPORT_URL,
    __COSMOTECH_URL__: config.COSMOTECH_URL,
    __DOCUMENTATION_URL__: config.DOCUMENTATION_URL,
  };
  createFileFromTemplate('HelpMenuConfiguration.tpl.js', 'HelpMenuConfiguration.js', replaceDict);
};

const createLanguagesConfigFile = async (config) => {
  const replaceDict = {
    __LANGUAGES__: JSON.stringify(config.LANGUAGES),
    __FALLBACK_LANGUAGE__: config.FALLBACK_LANGUAGE,
  };
  createFileFromTemplate('Languages.tpl.js', 'Languages.js', replaceDict);
};

const parseESConfigFile = async (filePath) => {
  return await import(filePath);
};

const migrateConfigFiles = async () => {
  try {
    console.log('Migrating config folder...');
    createOutputFolder();
    renameDashboardsConfigFile();
    copyUnaffectedFiles();
    const config = {
      ...(await parseAppConfigurationFile()),
      ...(await parseAppInstanceFile()),
    };
    copyAndFillScenarioParametersFile(config);
    copyAndFillPowerBIFile(config);
    createApplicationInsightsConfigFile(config);
    createGlobalConfigurationConfigFile(config);
    createHelpMenuConfigurationConfigFile(config);
    createLanguagesConfigFile(config);
    console.log(
      'Done.\n\nYour configuration files have been transformed to the new expected format, they have been saved in ' +
        `the folder: ${getOutputFolder()}`
    );
    console.log('You can copy and merge this folder into src/config after upgrading to azure-sample-webapp v3.0.0.');
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { migrateConfigFiles };
