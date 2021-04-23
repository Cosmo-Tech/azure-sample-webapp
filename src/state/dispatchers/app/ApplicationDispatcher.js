// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { APPLICATION_ACTIONS_KEY, APPLICATION_STATUS } from '../../commons/ApplicationConstants'

export const dispatchSetApplicationStatus = (payLoad) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
  status: payLoad
})

export const dispatchGetAllInitialData = () => ({
  type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA,
  status: APPLICATION_STATUS.LOADING
})
