// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';
import { WORKSPACE_ID } from '../../../config/AppInstance';
import { catchNonCriticalErrors } from '../../../utils/ApiUtils';

export const dispatchSetApplicationStatus = (payLoad) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
  status: payLoad,
});

export const dispatchGetAllInitialData = () => ({
  type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA,
  status: STATUSES.LOADING,
  workspaceId: WORKSPACE_ID,
});

export const dispatchClearMinorErrors = () => ({
  type: APPLICATION_ACTIONS_KEY.CLEAR_ALL_ERRORS,
  error: null,
});

export const dispatchCatchNonCriticalErrors = (error, commentOnAppBehaviour) => {
  return catchNonCriticalErrors(error, commentOnAppBehaviour);
};
