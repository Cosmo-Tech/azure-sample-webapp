// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const auth = require('./auth/auth.js')

module.exports = (on) => {
  on('task', {
      logInWithAppSecret() {
        return auth.logInWithAppSecret();
      },
    })
};
