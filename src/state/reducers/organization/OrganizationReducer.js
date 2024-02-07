// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { STATUSES } from '../../commons/Constants';
import { ORGANIZATION_ACTIONS_KEY } from '../../commons/OrganizationConstants';

const currentOrganizationInitialState = {
  data: null,
  status: STATUSES.IDLE,
};

const currentOrganizationReducer = createReducer(currentOrganizationInitialState, (builder) => {
  builder.addCase(ORGANIZATION_ACTIONS_KEY.SET_CURRENT_ORGANIZATION, (state, action) => {
    state.data = action.organization;
    state.status = action.status;
  });
});

export const organizationReducer = combineReducers({
  current: currentOrganizationReducer,
});
