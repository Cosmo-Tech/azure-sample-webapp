// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const responseTemplate = require('./GetScenariosTree.json');

// TODO remove the mock response and use the ScenarioAPI when it's ready
module.exports = async function (context, req) {
  context.log('GetScenariosTree HTTP trigger function.');
  context.res = {
    body: responseTemplate
  };
};
