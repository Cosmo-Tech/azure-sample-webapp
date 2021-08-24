// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { POWER_BI_ACTIONS_KEY } from '../../commons/PowerBIConstants';

export const powerBiInitialState = {
  data: {
    accessToken: '',
    reportsInfo: '',
    expiry: ''
  },
  status: STATUSES.IDLE
};

export const powerBiReducer = createReducer(powerBiInitialState, (builder) => {
  builder
    .addCase(POWER_BI_ACTIONS_KEY.SET_EMBED_INFO, (state, action) => {
      state.data = action.embedInfo;
      state.error = action.error;
      state.status = action.status;
    });
});
