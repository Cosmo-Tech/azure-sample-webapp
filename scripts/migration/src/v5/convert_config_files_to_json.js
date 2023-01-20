// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join } = require('path');
const json = require('../common/json.js');
const { clearFileFromOutputFolder, copyConfigFileToMJS, getOutputFolder } = require('./project.js');
const { parseESFile } = require('../common/js_modules.js');

const migrateRemainingConfigFiles = async () => {
  const filesNames = ['ApplicationInsights', 'GlobalConfiguration', 'HelpMenuConfiguration', 'Languages'];

  filesNames.forEach(async (fileName) => {
    const outputFilePath = join(getOutputFolder(), `${fileName}.json`);
    const mjsFilePath = copyConfigFileToMJS(`${fileName}.js`);
    const config = await parseESFile(mjsFilePath);
    clearFileFromOutputFolder(`${fileName}.mjs`);
    json.writeToFile(config, outputFilePath);
  });
};

module.exports = { migrateRemainingConfigFiles };
