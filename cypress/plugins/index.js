// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const auth = require('./auth/auth.js');
const { deleteFolder } = require('./deleteFolder');
const { parseXlsx } = require('./parseXlsx');

module.exports = (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);
  on('task', {
    deleteFolder,
    fetchServiceAccountToken() {
      return auth.fetchServiceAccountToken();
    },
    parseXlsx,
  });
};
