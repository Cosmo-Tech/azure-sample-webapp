// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SolutionApi } from '../ServiceCommons';

async function findSolutionById (organizationId, solutionId) {
  const solution = await SolutionApi.findSolutionById(organizationId, solutionId);
  return solution;
}

const SolutionService = {
  findSolutionById
};

export default SolutionService;
