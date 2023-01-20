// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');
const { join, resolve } = require('path');
const { copyFileToMJS } = require('../common/js_modules.js');

const MANDATORY_CONFIG_FILES = [];
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

const createOutputFolder = () => {
  fs.mkdirSync(getOutputFolder(), { recursive: true });
};

const clearFileFromOutputFolder = (fileName) => {
  const filePath = join(getOutputFolder(), fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const copyConfigFileToMJS = (fileName) => {
  return copyFileToMJS(getConfigFolder(), fileName, getOutputFolder());
};

module.exports = {
  setRootFolder,
  getConfigFolder,
  getOutputFolder,
  createOutputFolder,
  clearFileFromOutputFolder,
  copyConfigFileToMJS,
  MANDATORY_CONFIG_FILES,
};
