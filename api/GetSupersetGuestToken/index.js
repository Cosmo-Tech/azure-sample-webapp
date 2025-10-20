// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { validateQuery } = require('./check.js');
const { getSupersetAdminToken, getSupersetGuestToken } = require('./supersetApi.js');
const config = require('../common/config');
const { forgeErrorResponse, ServiceAccountError } = require('../common/errors');

module.exports = async function (context, req) {
  try {
    config.checkSupersetConfig();
    const dashboardIds = await validateQuery(req);
    const adminToken = await getSupersetAdminToken();
    const guestToken = await getSupersetGuestToken(adminToken, dashboardIds);
    context.res = { status: 200, body: { token: guestToken } };
  } catch (err) {
    if (err instanceof ServiceAccountError) {
      console.error(err);
      context.res = err.asResponse();
    } else {
      console.error('Unknown error during run of get-superset-guest-token function:');
      console.error(err);
      context.res = forgeErrorResponse(500, 'Internal server error', `${err.name}: ${err.message}`);
    }
  }
};
