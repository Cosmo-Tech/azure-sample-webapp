// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';

const currentOrganizationInitialState = {
  current: {
    data: null,
    status: STATUSES.IDLE,
  },
};

const currentOrganizationSlice = createSlice({
  name: 'organization',
  initialState: currentOrganizationInitialState,
  reducers: {
    setCurrentOrganization(state, action) {
      const { organization, status } = action.payload;
      state.current.data = organization;
      state.current.status = status;
    },
  },
});

export const { setCurrentOrganization } = currentOrganizationSlice.actions;
export default currentOrganizationSlice.reducer;
