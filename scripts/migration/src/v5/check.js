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

const checkSolutionFile = (solutionFilePath) => {
  if (solutionFilePath !== undefined && !fs.existsSync(solutionFilePath)) {
    throw new Error(`Provided solution file does not exist: "${solutionFilePath}"`);
  }
};

const runAllChecks = (solutionFilePath) => {
  try {
    checkNodeVersion();
    checkConfigFolder();
    checkSolutionFile(solutionFilePath);
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { runAllChecks };
