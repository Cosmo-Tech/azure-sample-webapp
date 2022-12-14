// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { createOutputFolder, setRootFolder } = require('./project.js');
const { runAllChecks } = require('./check.js');
const { dumpConfigToYaml: migrateSolution } = require('./merge_config_in_solution_yaml.js');
const { parseAndDumpWorkspaceConfig: migrateWorkspace } = require('./merge_config_in_workspace_yaml.js');

const run = async (args) => {
  setRootFolder(args.project_dir);
  runAllChecks(args.solution, args.workspace);
  createOutputFolder();
  await migrateSolution(args.solution);
  await migrateWorkspace(args.workspace);
};

module.exports = { run };
