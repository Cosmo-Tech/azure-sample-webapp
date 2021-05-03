// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AUTH_STATUS, AUTH_ACTIONS_KEY } from '../../commons/AuthConstants';
import { createReducer } from '@reduxjs/toolkit';
import { Auth } from '@cosmotech/core';

// Authentication data
export const authInitialState = {
  id: '',
  userName: '',
  profilePic: '',
  status: AUTH_STATUS.ANONYMOUS
};

export const authReducer = createReducer(authInitialState, (builder) => {
  builder
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, (state, action) => {
      state.status = AUTH_STATUS.CONNECTING;
    })
    .addCase(AUTH_ACTIONS_KEY.REQUEST_LOG_OUT, (state, action) => {
      Auth.signOut();
      state.status = AUTH_STATUS.ANONYMOUS;
    })
    .addCase(AUTH_ACTIONS_KEY.SET_AUTH_DATA, (state, action) => {
      state.status = action.status;
      state.id = action.id;
      state.userName = action.userName;
      state.profilePic = action.profilePic;
    });
});
