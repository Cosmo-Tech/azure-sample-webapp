// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { STATUSES } from '../../services/config/StatusConstants';
import { SecurityUtils } from '../../utils';

export const applicationInitialState = {
  status: STATUSES.IDLE,
  error: null,
  isDarkTheme: localStorage.getItem('darkThemeUsed') === 'true',
  roles: {},
  permissions: {},
  permissionsMapping: {},
};

const applicationSlice = createSlice({
  name: 'application',
  initialState: applicationInitialState,
  reducers: {
    setPermissionsMapping: (state, action) => {
      const { organizationPermissions } = action.payload;
      const { roles, permissions, permissionsMapping } = SecurityUtils.parseOrganizationPermissions(
        organizationPermissions,
        true // Add the role "none" that is not specified in roles sent by the back-end
      );
      state.roles = roles;
      state.permissions = permissions;
      state.permissionsMapping = permissionsMapping;
    },
    setApplicationErrorMessage: (state, action) => {
      const { error, errorMessage } = action.payload;
      state.error = {
        title: navigator.onLine
          ? error?.title ||
            error?.message ||
            error?.response?.message ||
            error?.response?.data?.title ||
            t('commoncomponents.banner.unknownError', 'Unknown error')
          : t('commoncomponents.banner.network', 'Network problem, please check your internet connection'),
        detail: error?.detail || error?.response?.data?.detail || '',
        status: error?.status || error?.response?.data?.status || '',
        comment: error?.comment ?? errorMessage,
      };
    },
    clearApplicationErrorMessage: (state, action) => {
      state.error = null;
    },
    setApplicationStatus: (state, action) => {
      const { status, error } = action.payload;
      state.status = status;
      if (state.status === STATUSES.ERROR) {
        if (error) {
          state.error = error;
        } else {
          state.error = { title: 'Unknown error', status: null, detail: 'Something went wrong' };
        }
      }
    },
    setApplicationTheme: (state, action) => {
      const { isDarkTheme } = action.payload;
      state.isDarkTheme = isDarkTheme;
    },
  },
});
export const {
  setPermissionsMapping,
  setApplicationErrorMessage,
  clearApplicationErrorMessage,
  setApplicationStatus,
  setApplicationTheme,
} = applicationSlice.actions;
export default applicationSlice.reducer;
