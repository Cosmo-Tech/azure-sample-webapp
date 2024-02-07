// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../../commons/AuthConstants';

// Authentication data
export const authInitialState = {
  error: '',
  userEmail: '',
  userId: '',
  userName: '',
  profilePic: '',
  roles: [],
  permissions: [],
  status: AUTH_STATUS.UNKNOWN,
};

export const authReducer = createReducer(authInitialState, (builder) => {
  builder
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, (state, action) => {
      state.status = AUTH_STATUS.CONNECTING;
    })
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_OUT, (state, action) => {
      state.status = AUTH_STATUS.DISCONNECTING;
    })
    .addCase(AUTH_ACTIONS_KEY.SET_AUTH_DATA, (state, action) => {
      state.error = action.error;
      state.status = action.status;
      state.userEmail = action.userEmail;
      state.userId = action.userId;
      state.userName = action.userName;
      state.roles = action.roles;
      state.permissions = action.permissions;
      state.profilePic = action.profilePic;
    });
});
