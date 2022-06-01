// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { createReducer } from '@reduxjs/toolkit';
import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';

export const applicationInitialState = {
  status: STATUSES.IDLE,
  error: null,
};

export const applicationReducer = createReducer(applicationInitialState, (builder) => {
  builder
    .addCase(APPLICATION_ACTIONS_KEY.GET_NON_CRITICAL_ERRORS, (state, action) => {
      state.error = action.error;
    })
    .addCase(APPLICATION_ACTIONS_KEY.CLEAR_ALL_ERRORS, (state) => {
      state.error = null;
    })
    .addCase(APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, (state, action) => {
      state.status = action.status;
      if (state.status === STATUSES.ERROR) {
        if (action.error) {
          state.error = action.error;
        } else {
          state.error = { title: 'Unknown error', status: null, detail: 'Something went wrong' };
        }
      }
    });
});
