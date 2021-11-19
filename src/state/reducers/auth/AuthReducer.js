// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../../commons/AuthConstants';
import { createReducer } from '@reduxjs/toolkit';

// Authentication data
export const authInitialState = {
  userId: '',
  userName: '',
  profilePic: '',
  roles: [],
  status: AUTH_STATUS.ANONYMOUS,
};

export const authReducer = createReducer(authInitialState, (builder) => {
  builder
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, (state, action) => {
      state.status = AUTH_STATUS.CONNECTING;
    })
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_OUT, (state, action) => {
      state.status = AUTH_STATUS.ANONYMOUS;
    })
    .addCase(AUTH_ACTIONS_KEY.SET_AUTH_DATA, (state, action) => {
      state.status = action.status;
      state.userId = action.userId;
      state.userName = action.userName;
      state.roles = action.roles;
      state.profilePic = action.profilePic;
    });
});
