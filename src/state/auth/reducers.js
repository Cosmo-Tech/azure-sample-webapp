// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { AUTH_STATUS } from './constants';

// Authentication data
const authInitialState = {
  error: '',
  userEmail: '',
  userId: '',
  userName: '',
  profilePic: '',
  roles: [],
  permissions: [],
  status: AUTH_STATUS.UNKNOWN,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setAuthData: (state, action) => {
      const { error, status, userEmail, profilePic, userId, userName, roles, permissions } = action.payload;
      state.error = error;
      state.status = status;
      state.userEmail = userEmail;
      state.userId = userId;
      state.userName = userName;
      state.roles = roles;
      state.permissions = permissions;
      state.profilePic = profilePic;
    },
  },
});

export const { setAuthData } = authSlice.actions;
export default authSlice.reducer;
