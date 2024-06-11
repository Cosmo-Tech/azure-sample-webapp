// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const _isString = (value) => {
  return typeof value === 'string' || value instanceof String;
};

export const parseError = (error) => {
  if (error?.response?.data) {
    const errorData = error.response.data;
    if (_isString(errorData)) {
      return {
        title: error.response.statusText,
        status: error.response.status,
        detail: errorData,
      };
    }
    return {
      title: errorData.title ?? errorData.statusText ?? error.response.statusText,
      status: errorData.status ?? errorData.code ?? error.response.status,
      detail: errorData.detail ?? errorData.message ?? errorData.trace,
    };
  } else if (error?.message === 'Network Error' || error?.title === 'Network Error') {
    return {
      title: 'Network error',
      status: null,
      detail:
        'No response received, please check your network settings. If the problem persists, please contact ' +
        'your administrator.',
    };
  } else if (error?.request) {
    return {
      title: error.request.statusText,
      status: error.request.status,
      detail: error.request.response,
    };
  } else if (_isString(error?.message)) {
    return { title: 'Error', status: null, detail: error.message };
  }

  return {
    title: 'Unknown error',
    status: null,
    detail: 'An unknown error happened. If the problem persists, please contact your administrator.',
  };
};
