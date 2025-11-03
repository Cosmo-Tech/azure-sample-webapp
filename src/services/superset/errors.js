// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class SupersetError extends Error {
  constructor(status = '', statusText = 'Unknown error', errorMessage = '', description = '', ...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, SupersetError);

    this.status = status;
    this.statusText = statusText;
    this.errorMessage = errorMessage;
    this.description = description;
  }
}

export const forgeSupersetError = (
  status = '',
  statusText = 'Unexpected error',
  errorMessage = 'Something went wrong when trying to display Superset dashboards. If the problem persists, please ' +
    'contact an administrator.',
  description,
  titlePrefix = ''
) => {
  if (description) console.error(description);
  return {
    status: `${titlePrefix}${status}`,
    statusText,
    supersetErrorInfo: errorMessage,
    description: description ?? `Error while retrieving Superset dashboard\r\n${errorMessage}`,
  };
};

export const forgeSupersetServiceAccountError = (status, statusText, errorMessage, description) => {
  return forgeSupersetError(status, statusText, errorMessage, description, 'Superset service account error - ');
};

export const forgeSupersetNetworkError = (details) => {
  const errorMessage =
    'Network error while trying to retrieve Superset guest token. Please check your network connection.';
  return forgeSupersetServiceAccountError(504, 'Network error', errorMessage, details);
};

export const handleServiceAccountError = (error) => {
  if (error?.response) {
    if (typeof error.response.data === 'string') {
      if (error.response.status === 504) return forgeSupersetNetworkError(error.response.data);
      return forgeSupersetServiceAccountError(error.response.status, error.response.statusText, error.response.data);
    }

    if (error.response.data?.error) {
      if (error.response.data.error.type === 'ServiceAccountError')
        return forgeSupersetServiceAccountError(
          error.response.data.error.status,
          error.response.data.error.statusText,
          error.response.data.error.supersetErrorInfo,
          error.response.data.error.description
        );
    }

    console.error('Unknown error in service account response:');
    console.error(error.response);
    return forgeSupersetServiceAccountError(error.response.status, error.response.statusText);
  } else if (error.request) {
    if (error.request.status === 0) return forgeSupersetNetworkError(error.request.data);

    console.error('Unknown error in service account request:');
    console.error(error.request);
    return forgeSupersetServiceAccountError(error.request.status, error.request.statusText);
  }

  console.error('Unknown error:');
  console.error(error);
  return forgeSupersetServiceAccountError('', 'Unknown error', error?.message);
};
