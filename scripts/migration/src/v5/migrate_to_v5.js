// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { setRootFolder } = require('./project.js');
const { runAllChecks } = require('./check.js');
const { dumpConfigToYaml } = require('./merge_config_in_solution_yaml.js');

const run = async (args) => {
  setRootFolder(args.project_dir);
  runAllChecks(args.solution);
  await dumpConfigToYaml(args.solution);
};

module.exports = { run };
