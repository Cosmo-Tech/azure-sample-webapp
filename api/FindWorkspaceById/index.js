// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const workspace = require('./FindWorkspaceById.json');
module.exports = async function (context, req) {
  // eslint-disable-next-line no-unused-vars
  const workspaceId = (req.query.workspaceId || (req.body && req.body.workspaceId));
  context.log('FindWorkspaceById HTTP trigger function. WorkspaceId: ' + workspaceId);
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: workspace
  };
};
