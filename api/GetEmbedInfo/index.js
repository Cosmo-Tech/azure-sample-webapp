// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const embedToken = require('./embedConfigService.js');
const utils = require('./utils.js');
const { forgeErrorResponse, ServiceAccountError } = require('./errors.js');

module.exports = async function (context, req) {
  try {
    utils.sanitizeAndValidateConfig();
    await utils.validateQuery(req);

    // Get the details like Embed URL, Access token and Expiry
    const reportsIds = req?.body?.reports;
    const workspaceId = req?.body?.workspaceId;
    const result = await embedToken.getEmbedInfo(reportsIds, workspaceId);
    context.res = { status: 200, body: result };
  } catch (err) {
    if (err instanceof ServiceAccountError) {
      context.res = err.asResponse();
    } else {
      console.error('Unknown error during run of get-embed-info function:');
      console.error(err);
      context.res = forgeErrorResponse(500, 'Internal server error', `${err.name}: ${err.message}`);
    }
  }
};
