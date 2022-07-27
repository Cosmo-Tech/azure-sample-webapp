// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { createReducer } from '@reduxjs/toolkit';
import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';

export const applicationInitialState = {
  status: STATUSES.IDLE,
  error: null,
  isDarkTheme: localStorage.getItem('darkThemeUsed') === 'true',
};

export const applicationReducer = createReducer(applicationInitialState, (builder) => {
  builder
    .addCase(APPLICATION_ACTIONS_KEY.SET_APPLICATION_ERROR_MESSAGE, (state, action) => {
      state.error = action.error;
    })
    .addCase(APPLICATION_ACTIONS_KEY.CLEAR_APPLICATION_ERROR_MESSAGE, (state) => {
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
    })
    .addCase(APPLICATION_ACTIONS_KEY.SET_APPLICATION_THEME, (state, action) => {
      state.isDarkTheme = action.isDarkTheme;
    });
});
