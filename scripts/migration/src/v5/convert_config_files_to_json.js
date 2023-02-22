// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join } = require('path');
const fs = require('fs');
const json = require('../common/json.js');
const { clearFileFromOutputFolder, copyConfigFileToMJS, getConfigFolder, getOutputFolder } = require('./project.js');
const { parseESFile } = require('../common/js_modules.js');

const adaptConfig = (config, fileName) => {
  // Rename COSMOTECH_URL to ORGANIZATION_URL
  if (fileName === 'HelpMenuConfiguration') {
    config.ORGANIZATION_URL = '' + config.COSMOTECH_URL;
    delete config.COSMOTECH_URL;

    // Set APP_VERSION to null if undefined
    if (config.APP_VERSION === undefined) config.APP_VERSION = null;
  }

  if (fileName === 'GlobalConfiguration') {
    // Set WORKSPACES_IDS_FILTER from WORKSPACE_ID
    const workspaceId = config.WORKSPACE_ID;
    if (workspaceId) {
      config.WORKSPACES_IDS_FILTER = [workspaceId];
      const newValueAsString = JSON.stringify([workspaceId]);
      delete config.WORKSPACE_ID;
      console.log(
        '\nNote: starting with v5.0, webapps will be able to browse multiple workspaces. A new "workspace selector" ' +
          'screen will be available, in which users can select the workspace they want to open. This migration ' +
          'script has restricted the allowed workspaces by setting the new configuration parameter ' +
          '"WORKSPACES_IDS_FILTER" (in file GlobalConfiguration.json) to ' +
          newValueAsString +
          ' based on the previous value of "WORKSPACE_ID". This means that the workspace selector will be ' +
          "bypassed, and users won't be able to browse other workspaces from this webapp. You can allow more " +
          'workspaces by adding their ids in the array, or set the parameter value to null to disable the filter.'
      );
    }
  }
};

const migrateRemainingConfigFiles = async () => {
  const filesNames = ['ApplicationInsights', 'GlobalConfiguration', 'HelpMenuConfiguration', 'Languages'];

  for (const fileName of filesNames) {
    const filePath = join(getConfigFolder(), fileName + '.js');
    if (!fs.existsSync(filePath)) {
      console.warn(`WARNING: file "${fileName}.js" not found in configuration folder, skipping conversion to JSON...`);
      continue;
    }

    const outputFilePath = join(getOutputFolder(), `${fileName}.json`);
    const mjsFilePath = copyConfigFileToMJS(`${fileName}.js`);
    const configModule = await parseESFile(mjsFilePath);
    const config = JSON.parse(JSON.stringify(configModule));
    adaptConfig(config, fileName);
    clearFileFromOutputFolder(`${fileName}.mjs`);
    json.writeToFile(config, outputFilePath);
  }
};

module.exports = { migrateRemainingConfigFiles };
