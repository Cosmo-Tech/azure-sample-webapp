// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { SOLUTION_ACTIONS_KEY } from '../../commons/SolutionConstants';

export const dispatchGetSolutionById = (payLoad) => ({
  type: SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID,
  ...payLoad
});
