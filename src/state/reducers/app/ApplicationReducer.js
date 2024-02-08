// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { SecurityUtils } from '../../../utils';
import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';

export const applicationInitialState = {
  status: STATUSES.IDLE,
  error: null,
  isDarkTheme: localStorage.getItem('darkThemeUsed') === 'true',
  roles: {},
  permissions: {},
  permissionsMapping: {},
};

export const applicationReducer = createReducer(applicationInitialState, (builder) => {
  builder
    .addCase(APPLICATION_ACTIONS_KEY.SET_PERMISSIONS_MAPPING, (state, action) => {
      const { roles, permissions, permissionsMapping } = SecurityUtils.parseOrganizationPermissions(
        action.organizationPermissions,
        true // Add the role "none" that is not specified in roles sent by the back-end
      );

      state.roles = roles;
      state.permissions = permissions;
      state.permissionsMapping = permissionsMapping;
    })

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
