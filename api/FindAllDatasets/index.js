// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const findAllDatasetsSampleTest = require('./FindAllDatasets.json');
module.exports = async function (context, req) {
  context.log('FindAllDatasets HTTP trigger function.');
  context.res = {
    body: findAllDatasetsSampleTest
  };
};
