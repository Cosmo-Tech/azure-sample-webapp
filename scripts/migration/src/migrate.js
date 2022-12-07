#!/usr/bin/env node

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getParserInstance } = require('./common/parser.js');
const { runAllChecks } = require('./common/check.js');
const { VALID_TARGET_VERSIONS, LATEST_VERSION } = require('./common/constants.js');
const v3 = require('./v3/migrate_to_v3.js');
const v5 = require('./v5/migrate_to_v5.js');

const parser = getParserInstance();
parser.add_argument('target', { help: `Target version for migration (e.g. ${LATEST_VERSION})` });
parser.add_argument('-p', '--project-dir', { help: 'Root folder of the webapp to migrate', default: '.' });
parser.add_argument('-s', '--solution', {
  help: 'Path to solution file (used when migrating to v5 to generate a new solution YAML file)',
});
parser.add_argument('-w', '--workspace', {
  help: 'Path to workspace file (used when migrating to v5 to generate a new workspace YAML file)',
});

async function main() {
  const args = parser.parse_args();
  runAllChecks(args);
  switch (args.target) {
    case 'v3':
      await v3.run(args);
      break;
    case 'v5':
      await v5.run(args);
      break;
    default:
      console.error('Error: Unknown target version. Valid options are: ' + VALID_TARGET_VERSIONS.join(', '));
      process.exit(1);
  }
}

main();
