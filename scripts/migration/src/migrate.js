#!/usr/bin/env node

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getParserInstance } = require('./common/parser.js');
const { runAllChecks } = require('./common/check.js');
const { VALID_TARGET_VERSIONS, LATEST_VERSION } = require('./common/constants.js');
const v7 = require('./v7/migrate_to_v7.js');

const parser = getParserInstance();
parser.add_argument('target', { help: `Target version for migration (e.g. ${LATEST_VERSION})` });
parser.add_argument('-s', '--solution', {
  help: 'Path to solution file',
});
parser.add_argument('-w', '--workspace', {
  help: 'Path to workspace file',
});
parser.add_argument('-f', '--format', {
  help: 'Output format for migrated files (default: json)',
  choices: ['json', 'yaml'],
  default: 'json',
});

async function main() {
  const args = parser.parse_args();
  runAllChecks(args);
  switch (args.target) {
    case 'v7':
      await v7.run(args);
      break;
    default:
      console.error('Error: Unknown target version. Valid options are: ' + VALID_TARGET_VERSIONS.join(', '));
      process.exit(1);
  }
}

main();
