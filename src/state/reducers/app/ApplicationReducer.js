// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { createReducer } from '@reduxjs/toolkit'
import { APPLICATION_STATUS, APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants'

export const applicationInitialState = {
  status: APPLICATION_STATUS.IDLE
}

export const applicationReducer = createReducer(applicationInitialState, (builder) => {
  builder
    .addCase(APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, (state, action) => { state.status = action.status })
})
