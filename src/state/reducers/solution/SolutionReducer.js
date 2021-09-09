// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Current Solution

import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { SOLUTION_ACTIONS_KEY } from '../../commons/SolutionConstants';

export const currentSolutionInitialState = {
  data: null,
  status: STATUSES.IDLE
};

export const currentSolutionReducer = createReducer(currentSolutionInitialState, (builder) => {
  builder
    .addCase(SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION, (state, action) => {
      state.data = action.solution;
      state.status = action.status;
    });
});

export const solutionReducer = combineReducers({
  current: currentSolutionReducer
});
