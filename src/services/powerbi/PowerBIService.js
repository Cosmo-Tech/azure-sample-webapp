// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { POWER_BI_WORKSPACE_ID } from '../../config/AppInstance';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { POWER_BI_API_DEFAULT_SCOPE } from '../config/Auth';

function _authHeader(accessToken) {
  return 'Bearer '.concat(accessToken);
}

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
async function getPowerBIData() {
  try {
    const embedParams = await getEmbedParamsForAllReportsInWorkspace(POWER_BI_WORKSPACE_ID);
    const result = {
      accesses: {
        accessToken: embedParams.accessToken,
        reportsInfo: embedParams.reportsDetail,
        expiry: embedParams.expiresOn,
      },
      error: null,
    };
    return result;
  } catch (err) {
    return {
      accesses: null,
      error: {
        status: err.status,
        statusText: err.statusText,
        powerBIErrorInfo: err.headers.get('x-powerbi-error-info'),
        description:
          `Error while retrieving report embed details\r\n${err.statusText}\r\nRequestId: \n` +
          `${err.headers.get('requestid')}`,
      },
    };
  }
}

/**
 * Get embed params for all reports for a single workspace
 * @param {string} workspaceId
 * @param {Array<string>} additionalDatasetIds - Optional Parameter
 * @return EmbedConfig object
 */
async function getEmbedParamsForAllReportsInWorkspace(workspaceId, additionalDatasetIds) {
  const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;
  const { headers, accessToken, expiresOn } = await getAuthenticationInfo();

  const reportEmbedConfig = new EmbedConfig('report', {}, accessToken, expiresOn);

  const result = await fetch(reportInGroupApi, {
    method: 'GET',
    headers: headers,
  });

  if (!result.ok) {
    throw result;
  }

  const resultJson = await result.json();
  const reportsInfo = resultJson.value;
  const datasetIds = new Set([]);
  const reportIds = new Set([]);

  for (const reportInfo of reportsInfo) {
    const reportDetails = new PowerBiReportDetails(reportInfo.id, reportInfo.name, reportInfo.embedUrl);
    reportEmbedConfig.reportsDetail[reportInfo.id] = reportDetails;
    datasetIds.add(reportInfo.datasetId);
    reportIds.add(reportInfo.id);
    if (additionalDatasetIds) {
      datasetIds.add(...additionalDatasetIds);
    }
  }

  return reportEmbedConfig;
}

/**
 * Get Authentication information
 * @return Authentication Information with : request header with Bearer token, accessToken and token expiration date
 */
async function getAuthenticationInfo() {
  let tokenResponse, errorResponse;

  try {
    tokenResponse = await Auth.acquireTokensByRequest({
      scopes: [POWER_BI_API_DEFAULT_SCOPE],
    });
  } catch (err) {
    if (
      // eslint-disable-next-line no-prototype-builtins
      err.hasOwnProperty('error_description') &&
      // eslint-disable-next-line no-prototype-builtins
      err.hasOwnProperty('error')
    ) {
      errorResponse = err.error_description;
    } else {
      errorResponse = err.toString();
    }
    return {
      status: 401,
      error: errorResponse,
    };
  }

  const accessToken = tokenResponse.accessToken;
  return {
    accessToken: accessToken,
    expiresOn: tokenResponse.expiresOn,
    headers: {
      'Content-Type': 'application/json',
      Authorization: _authHeader(accessToken),
    },
  };
}

export const PowerBIService = {
  getPowerBIData,
};
