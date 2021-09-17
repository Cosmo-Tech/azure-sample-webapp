// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { RUN_TEMPLATE_ACTIONS_KEY } from '../../commons/RunTemplateConstants';

// Run template list

export const runTemplateListInitialState = {
  data: null,
  status: STATUSES.IDLE
};

export const runTemplateListReducer = createReducer(runTemplateListInitialState, (builder) => {
  builder
    .addCase(RUN_TEMPLATE_ACTIONS_KEY.SET_RUN_TEMPLATE_LIST, (state, action) => {
      state.data = action.list;
      state.status = action.status;
    });
});

export const runTemplateReducer = combineReducers({
  list: runTemplateListReducer
});
