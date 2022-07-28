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

function checkRootFolder(rootFolder) {
  const packageFilePath = path.join(path.resolve(rootFolder), 'package.json');
  if (!fs.existsSync(packageFilePath)) {
    const errorMessage =
      `Can't find package.json file in project dir: "${path.dirname(packageFilePath)}".` +
      ' Please use the "-p" option to set the path to the root folder of your webapp ';
    throw new Error(errorMessage);
  }
}

const runAllChecks = (args) => {
  try {
    checkTargetVersion(args.target);
    checkRootFolder(args.project_dir);
  } catch (e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
};

module.exports = { runAllChecks };
