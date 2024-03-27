// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { COPILOT_ACTIONS_KEY, COPILOT_STATUS } from '../../commons/CopilotConstants';

// Authentication data
export const copilotInitialState = {
  token_status: COPILOT_STATUS.IDLE,
  token: '',
};

export const copilotReducer = createReducer(copilotInitialState, (builder) => {
  builder.addCase(COPILOT_ACTIONS_KEY.SET_COPILOT_TOKEN, (state, action) => {
    state.token_status = action.status;
    state.token = action.token;
  });
});
