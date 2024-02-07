// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { STATUSES } from '../../commons/Constants';
import { POWER_BI_ACTIONS_KEY } from '../../commons/PowerBIConstants';

export const powerBiInitialState = {
  data: {
    reportsConfig: null,
    accessToken: '',
    reportsInfo: '',
    expiry: '',
  },
  status: STATUSES.IDLE,
};

export const powerBiReducer = createReducer(powerBiInitialState, (builder) => {
  builder
    .addCase(POWER_BI_ACTIONS_KEY.SET_EMBED_INFO, (state, action) => {
      state.data.accessToken = action.data?.accessToken; // TODO: remove from redux
      state.data.reportsInfo = action.data?.reportsInfo; // TODO: rename ?
      state.data.expiry = action.data?.expiry; // TODO: remove from redux
      state.error = action.error;
      state.status = action.status;
    })
    .addCase(POWER_BI_ACTIONS_KEY.SET_REPORTS_CONFIG, (state, action) => {
      state.data.reportsConfig = action.reportsConfig;
    })
    .addCase(POWER_BI_ACTIONS_KEY.CLEAR_EMBED_INFO, (state) => {
      state.data = powerBiInitialState.data;
      state.status = powerBiInitialState.status;
    });
});
