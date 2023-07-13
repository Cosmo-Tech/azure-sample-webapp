// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class PowerBIError extends Error {
  constructor(status = '', statusText = 'Unknown error', errorMessage = '', description = '', ...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, PowerBIError);

    this.status = status;
    this.statusText = statusText;
    this.errorMessage = errorMessage;
    this.description = description;
  }
}

export const forgePowerBIError = (
  status = '',
  statusText = 'Unexpected error',
  errorMessage = 'Something went wrong when trying to display PowerBI dashboards. If the problem persists, please ' +
    'contact an administrator.',
  description,
  titlePrefix = ''
) => {
  if (description) console.error(description); // Log error details in console, they may not be displayed in the UI
  return {
    status: `${titlePrefix}${status}`,
    statusText,
    powerBIErrorInfo: errorMessage,
    description: description ?? `Error while retrieving report embed details\r\n${errorMessage}`,
  };
};

export const forgePowerBIServiceAccountError = (status, statusText, errorMessage, description) =>
  forgePowerBIError(status, statusText, errorMessage, description, 'PowerBI service account error - ');

export const forgePowerBIUserAccountError = (status, statusText, errorMessage, description) =>
  forgePowerBIError(status, statusText, errorMessage, description, 'PowerBI user account error - ');

export const forgePowerBINetworkError = (details) => {
  const errorMessage =
    "Can't reach the server to retrieve a service account token for powerBI. If the problem persists, please contact " +
    'an administrator.';
  return forgePowerBIServiceAccountError(504, 'Network error', errorMessage, details);
};

export const handleServiceAccountError = (error) => {
  if (error?.response) {
    if (typeof error.response.data === 'string') {
      // Forge specific message if the error comes from the Azure Function not answering. The technical error
      // status & text received in this case is "504 - Gateway Timeout", with an error message like:
      // "Error occurred while trying to proxy: localhost:3000/api/get-embed-info"
      if (error.response.status === 504) return forgePowerBINetworkError(error.response.data);
      return forgePowerBIServiceAccountError(error.response.status, error.response.statusText, error.response.data);
    }

    if (error.response.data?.error) {
      // Check if the error object returned is a known structure
      if (error.response.data.error.type === 'ServiceAccountError')
        return forgePowerBIServiceAccountError(
          error.response.data.error.status,
          error.response.data.error.statusText,
          error.response.data.error.powerBIErrorInfo,
          error.response.data.error.description
        );
    }
    // Otherwise, print error details in console and return a default error message
    console.error('Unknown error in service account response:');
    console.error(error.response);
    return forgePowerBIServiceAccountError(error.response.status, error.response.statusText);
  } else if (error.request) {
    if (error.request.status === 0) return forgePowerBINetworkError(error.request.data);

    console.error('Unknown error in service account request:');
    console.error(error.request);
    return forgePowerBIServiceAccountError(error.request.status, error.request.statusText);
  }

  // Something happened when setting up the request that triggered an Error. Return an "unknown error" message
  console.error('Unknown error:');
  console.error(error);
  return forgePowerBIServiceAccountError('', 'Unknown error', error?.message);
};

export const handleUserAccountError = (error) => {
  if (error instanceof PowerBIError)
    return forgePowerBIUserAccountError(error.status, error.statusText, error.errorMessage, error.description);

  if (error?.response) {
    if (typeof error.response.data === 'string') {
      return forgePowerBIUserAccountError(error.response.status, error.response.statusText, error.response.data);
    }

    console.error('Unknown error in user account response:');
    console.error(error.response);
    return forgePowerBIUserAccountError(error.response.status, error.response.statusText);
  } else if (error.request) {
    console.error('Unknown error in user account request:');
    console.error(error.request);
    return forgePowerBIUserAccountError(error.request.status, error.request.statusText);
  }

  // Something happened when setting up the request that triggered an Error. Return an "unknown error" message
  console.error('Unknown error:');
  console.error(error);
  return forgePowerBIUserAccountError('', 'Unknown error', error?.message);
};
