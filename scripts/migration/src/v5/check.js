// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const path = require('path');
const fs = require('fs');
const { getConfigFolder, MANDATORY_CONFIG_FILES } = require('./project.js');

const checkNodeVersion = () => {
  const nodeMajorVersion = parseInt(process.versions.node.split('.')[0]);
  if (nodeMajorVersion < 16) {
    throw new Error(`You need node >= 16 to run this script (current node version is v${nodeMajorVersion})`);
  }
};

const checkConfigFolder = () => {
  const configFolder = getConfigFolder();
  for (const fileName of MANDATORY_CONFIG_FILES) {
    const filePath = path.join(configFolder, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing expected configuration file: ${fileName}`);
    }
  }
};

const checkOptionalFile = (filePath) => {
  if (filePath !== undefined && !fs.existsSync(filePath)) {
    throw new Error(`Provided file does not exist: "${filePath}"`);
  }
};

const runAllChecks = (solutionFilePath, workspaceFilePath) => {
  try {
    checkNodeVersion();
    checkConfigFolder();
    checkOptionalFile(solutionFilePath);
    checkOptionalFile(workspaceFilePath);
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { runAllChecks };
