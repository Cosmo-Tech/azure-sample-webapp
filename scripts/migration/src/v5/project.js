// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { join, resolve } = require('path');

const MANDATORY_CONFIG_FILES = ['ScenarioParameters.js'];
let rootFolder = null;

const setRootFolder = (newRootFolder) => {
  rootFolder = resolve(newRootFolder);
};

const getConfigFolder = () => {
  return join(rootFolder, 'src', 'config');
};

const getOutputFolder = () => {
  return join(rootFolder, 'config_v5');
};

module.exports = {
  setRootFolder,
  getConfigFolder,
  getOutputFolder,
  MANDATORY_CONFIG_FILES,
};
