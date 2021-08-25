// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const embedToken = require('./embedConfigService.js');
const utils = require('./utils.js');

module.exports = async function (context, req) {
  try {
    // Validate whether all the required configurations are provided in the environment variables.
    const configCheckResult = utils.validateConfig();
    if (configCheckResult) {
      context.res = {
        status: 400,
        body: configCheckResult
      };
    } else {
      // Get the details like Embed URL, Access token and Expiry
      const result = await embedToken.getEmbedInfo();
      context.res = { status: 200, body: result };
    }
  } catch (err) {
    console.error('Error during run of get-embed-info function');
    console.error(err);
    context.res = { status: 500, body: err };
  } finally {
    context.done();
  }
};
