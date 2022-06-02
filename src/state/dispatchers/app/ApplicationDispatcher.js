// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';
import { WORKSPACE_ID } from '../../../config/AppInstance';
import { t } from 'i18next';

export const dispatchSetApplicationStatus = (payLoad) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
  status: payLoad,
});

export const dispatchGetAllInitialData = () => ({
  type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA,
  status: STATUSES.LOADING,
  workspaceId: WORKSPACE_ID,
});

export const dispatchClearApplicationErrorMessage = () => ({
  type: APPLICATION_ACTIONS_KEY.CLEAR_APPLICATION_ERROR_MESSAGE,
  error: null,
});

// Catch non-critical errors to display in error banner
export const dispatchSetApplicationErrorMessage = (error, errorMessage) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_ERROR_MESSAGE,
  error: {
    title:
      error.response?.message || error.response?.data?.title || navigator.onLine
        ? t('commoncomponents.banner.unknownError', 'Unknown error')
        : t('commoncomponents.banner.network', 'Network problem, please check your internet connection'),
    detail: error.response?.data?.detail || '',
    status: error.response?.data?.status || '',
    comment: errorMessage,
  },
});
