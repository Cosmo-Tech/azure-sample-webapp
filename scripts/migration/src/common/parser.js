// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { ArgumentParser } = require('argparse');

let parser = null;
function getParserInstance() {
  if (parser == null) {
    parser = new ArgumentParser({ description: 'Migration script for azure-sample-webapp' });
  }
  return parser;
}

module.exports = { getParserInstance };
