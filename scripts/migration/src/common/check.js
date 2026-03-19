// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const path = require('path');
const fs = require('fs');
const { SELF_CMD_LINE, VALID_TARGET_VERSIONS, LATEST_VERSION } = require('./constants.js');

function checkTargetVersion(targetVersion) {
  if (targetVersion == null) {
    let errorMessage =
      'Error: Please provide target version for migration. Valid options are: ' + VALID_TARGET_VERSIONS.join(', ');
    errorMessage += `\n\nExample:\n  ${SELF_CMD_LINE} ${LATEST_VERSION}`;
    throw new Error(errorMessage);
  }
}

function checkFileExists(filePath, argName) {
  if (filePath == null) return;
  if (!fs.existsSync(path.resolve(filePath))) {
    console.error(`Error: ${argName} file not found: "${filePath}"`);
    process.exit(1);
  }
}

const runAllChecks = (args) => {
  try {
    checkTargetVersion(args.target);
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { runAllChecks, checkFileExists };
