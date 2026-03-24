// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const jwt = require('jsonwebtoken');
const { validateQuery } = require('./check.js');
const { getSupersetAdminToken, getSupersetGuestToken } = require('./supersetApi.js');
const config = require('../common/config');
const { forgeErrorResponse, ServiceAccountError } = require('../common/errors');

module.exports = async function (context, req) {
  try {
    const accessToken = req?.headers?.['csm-authorization']?.replace('Bearer ', '');
    const token = jwt.decode(accessToken);
    const { preferred_username, given_name, family_name, email, groups, userRoles } = token;
    const userDataFromToken = {
      username: token?.preferred_username ?? token?.email,
      first_name: token?.given_name,
      last_name: token?.family_name,
      groups: JSON.stringify(token?.groups),
      roles: JSON.stringify(token?.userRoles),
    };
    console.log({ userDataFromToken });

    config.checkSupersetConfig();
    const dashboardIds = await validateQuery(req);
    const adminToken = await getSupersetAdminToken();
    const guestToken = await getSupersetGuestToken(adminToken, dashboardIds, userDataFromToken);
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
