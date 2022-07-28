// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { setRootFolder } = require('./project.js');
const { runAllChecks } = require('./check.js');
const { migrateConfigFiles } = require('./migrate_config_files.js');

const run = async (args) => {
  setRootFolder(args.project_dir);
  runAllChecks();
  await migrateConfigFiles();
};

module.exports = { run };
