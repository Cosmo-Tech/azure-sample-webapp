// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { deleteFolder } = require('./deleteFolder');
const { parseXlsx } = require('./parseXlsx');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);
  on('task', {
    deleteFolder,
    parseXlsx,
  });
};
