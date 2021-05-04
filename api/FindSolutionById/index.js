// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const solution = require('./FindSolutionById.json');
module.exports = async function (context, req) {
  // eslint-disable-next-line no-unused-vars
  const solutionId = (req.query.solutionId || (req.body && req.body.solutionId));
  context.log('FindSolutionById HTTP trigger function. SolutionId:' + solutionId);
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: solution
  };
};
