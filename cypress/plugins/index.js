// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { deleteFolder } = require('./deleteFolder');
const { parseXlsx } = require('./parseXlsx');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    deleteFolder,
    parseXlsx,
  });
};
