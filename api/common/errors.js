// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const forgeErrorResponse = (status, statusText, errorMessage, description) => ({
  status,
  body: {
    accesses: null,
    error: {
      type: 'ServiceAccountError',
      status,
      statusText,
      powerBIErrorInfo: errorMessage,
      description: description ?? `Error while retrieving report embed details\r\n${errorMessage}`,
    },
  },
});

class ServiceAccountError extends Error {
  constructor(status = '', statusText = 'Unknown error', errorMessage = '', description = '', ...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, ServiceAccountError);

    this.name = 'ServiceAccountError';
    this.status = status;
    this.statusText = statusText;
    this.errorMessage = errorMessage;
    this.description = description;
  }

  asResponse() {
    return forgeErrorResponse(this.status, this.statusText, this.errorMessage, this.description);
  }
}

module.exports = { forgeErrorResponse, ServiceAccountError };
