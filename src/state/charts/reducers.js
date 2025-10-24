// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';

export const chartsInitialState = {
  mode: null, // null, 'powerbi', or 'superset'
  powerbi: {
    data: {
      reportsConfig: null,
      accessToken: '',
      reportsInfo: '',
      expiry: '',
    },
    status: STATUSES.IDLE,
  },
  superset: {
    data: {
      dashboards: null,
      guestToken: '',
      supersetUrl: '',
      expiry: '',
    },
    status: STATUSES.IDLE,
  },
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState: chartsInitialState,
  reducers: {
    setChartMode: (state, action) => {
      state.mode = action.payload;
    },

    setPowerBIEmbedInfo: (state, action) => {
      const { data, status, error } = action.payload;
      if (data) {
        state.powerbi.data.accessToken = data?.accessToken;
        state.powerbi.data.reportsInfo = data?.reportsInfo;
        state.powerbi.data.expiry = data?.expiry;
      }
      if (error) state.powerbi.error = error;
      if (status) state.powerbi.status = status;
    },
    setPowerBIReportConfig: (state, action) => {
      state.powerbi.data.reportsConfig = action.payload;
    },
    clearPowerBIEmbedInfo: (state) => {
      state.powerbi.data = chartsInitialState.powerbi.data;
      state.powerbi.status = STATUSES.IDLE;
    },

    setSupersetGuestToken: (state, action) => {
      const { data, status, error } = action.payload;
      if (data) {
        state.superset.data.guestToken = data?.token;
        state.superset.data.expiry = data?.expiry;
      }
      if (error) state.superset.error = error;
      if (status) state.superset.status = status;
    },
    setSupersetDashboards: (state, action) => {
      state.superset.data.dashboards = action.payload;
    },
    setSupersetUrl: (state, action) => {
      state.superset.data.supersetUrl = action.payload;
    },
    clearSupersetInfo: (state) => {
      state.superset.data = chartsInitialState.superset.data;
      state.superset.status = STATUSES.IDLE;
    },
    clearAllChartsInfo: (state) => {
      state.mode = null;
      state.powerbi = chartsInitialState.powerbi;
      state.superset = chartsInitialState.superset;
    },
  },
});

export const {
  setChartMode,
  setPowerBIEmbedInfo,
  setPowerBIReportConfig,
  clearPowerBIEmbedInfo,
  setSupersetGuestToken,
  setSupersetDashboards,
  setSupersetUrl,
  clearSupersetInfo,
  clearAllChartsInfo,
} = chartsSlice.actions;

export default chartsSlice.reducer;
