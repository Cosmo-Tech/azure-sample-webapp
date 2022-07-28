// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join, resolve } = require('path');

const MANDATORY_CONFIG_FILES = ['AppConfiguration.js', 'AppInstance.js', 'Dashboards.js', 'ScenarioParameters.js'];
const OPTIONAL_CONFIG_FILES = [
  'InstanceVisualization.js', // Added in v2.8
  'Profiles.js', // Added in v2.2
];
const CONFIG_FILES = MANDATORY_CONFIG_FILES.concat(OPTIONAL_CONFIG_FILES);
let rootFolder = null;

const setRootFolder = (newRootFolder) => {
  rootFolder = resolve(newRootFolder);
};

const getConfigFolder = () => {
  return join(rootFolder, 'src', 'config');
};

const getOutputFolder = () => {
  return join(rootFolder, 'src', 'config_v3');
};

const getTemplatesFolder = () => {
  // Get config root folder based on location of the current file
  return join(__dirname, 'templates');
};

module.exports = {
  setRootFolder,
  getConfigFolder,
  getOutputFolder,
  getTemplatesFolder,
  MANDATORY_CONFIG_FILES,
  OPTIONAL_CONFIG_FILES,
  CONFIG_FILES,
};
