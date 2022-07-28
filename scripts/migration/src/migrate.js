#!/usr/bin/env node

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getParserInstance } = require('./common/parser.js');
const { runAllChecks } = require('./common/check.js');
const { VALID_TARGET_VERSIONS, LATEST_VERSION } = require('./common/constants.js');
const v3 = require('./v3/migrate_to_v3.js');

const parser = getParserInstance();
parser.add_argument('target', { help: `Target version for migration (e.g. ${LATEST_VERSION})` });
parser.add_argument('-p', '--project-dir', { help: 'Root folder of the webapp to migrate', default: '.' });

async function main() {
  const args = parser.parse_args();
  runAllChecks(args);
  switch (args.target) {
    case 'v3':
      await v3.run(args);
      break;
    default:
      console.error('Error: Unknown target version. Valid options are: ' + VALID_TARGET_VERSIONS.join(', '));
      process.exit(1);
  }
}

main();
