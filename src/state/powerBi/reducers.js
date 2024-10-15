// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';

export const powerBiInitialState = {
  data: {
    reportsConfig: null,
    accessToken: '',
    reportsInfo: '',
    expiry: '',
  },
  status: STATUSES.IDLE,
};

const powerBiSlice = createSlice({
  name: 'powerBi',
  initialState: powerBiInitialState,
  reducers: {
    setEmbedInfo: (state, action) => {
      const { data, status, error } = action.payload;
      state.data.accessToken = data?.accessToken; // TODO: remove from redux
      state.data.reportsInfo = data?.reportsInfo; // TODO: rename ?
      state.data.expiry = data?.expiry; // TODO: remove from redux
      state.error = error;
      state.status = status;
    },
    setReportConfig: (state, action) => {
      state.data.reportsConfig = action.payload;
    },
    clearEmbedInfo: (state) => {
      state.data = powerBiInitialState.data;
      state.status = STATUSES.IDLE;
    },
  },
});
export const { setEmbedInfo, setReportConfig, clearEmbedInfo } = powerBiSlice.actions;
export default powerBiSlice.reducer;
