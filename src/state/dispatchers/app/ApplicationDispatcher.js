// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { APPLICATION_ACTIONS_KEY } from '../../commons/ApplicationConstants';
import { STATUSES } from '../../commons/Constants';

export const dispatchSetApplicationStatus = (payload) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
  status: payload,
});

export const dispatchGetAllInitialData = (payload) => ({
  type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA,
  status: STATUSES.LOADING,
});

export const dispatchClearApplicationErrorMessage = () => ({
  type: APPLICATION_ACTIONS_KEY.CLEAR_APPLICATION_ERROR_MESSAGE,
  error: null,
});

// Catch non-critical errors to display in error banner
export const dispatchSetApplicationErrorMessage = (error, errorMessage) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_ERROR_MESSAGE,
  error: {
    title: navigator.onLine
      ? error?.title ||
        error?.message ||
        error?.response?.message ||
        error?.response?.data?.title ||
        t('commoncomponents.banner.unknownError', 'Unknown error')
      : t('commoncomponents.banner.network', 'Network problem, please check your internet connection'),
    detail: error?.detail || error?.response?.data?.detail || '',
    status: error?.status || error?.response?.data?.status || '',
    comment: errorMessage,
  },
});

export const dispatchSetApplicationTheme = (isDarkTheme) => ({
  type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_THEME,
  isDarkTheme,
});
