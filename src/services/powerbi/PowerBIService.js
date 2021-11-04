// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { POWER_BI_WORKSPACE_ID } from '../../config/AppInstance';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { POWER_BI_API_SCOPES_PREFIX } from '../config/Auth';

function _authHeader(accessToken) {
  // Function to append Bearer against the Access Token
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
      data: {
        accessToken: embedParams.accessToken,
        reportsInfo: embedParams.reportsDetail,
        expiry: embedParams.expiresOn,
      },
      error: null,
    };
    return result;
  } catch (err) {
    return {
      data: null,
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
  const reportEmbedConfig = new EmbedConfig('report');

  // Get datasets and Embed URLs for all the reports
  const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;
  const { headers, accessToken, expiresOn } = await getAuthenticationInfo();
  reportEmbedConfig.accessToken = accessToken;
  reportEmbedConfig.expiresOn = expiresOn;
  reportEmbedConfig.reportsDetail = {};

  // Get report info by calling the PowerBI REST API
  const result = await fetch(reportInGroupApi, {
    method: 'GET',
    headers: headers,
  });

  if (!result.ok) {
    throw result;
  }

  // Convert result in json to retrieve values
  const resultJson = await result.json();

  const reportsInfo = resultJson.value;

  // Create Set of datasets
  const datasetIds = new Set([]);
  // Create Set of reportId
  const reportIds = new Set([]);

  for (const reportInfo of reportsInfo) {
    // Store result into PowerBiReportDetails object
    const reportDetails = new PowerBiReportDetails(reportInfo.id, reportInfo.name, reportInfo.embedUrl);

    // Create mapping for reports and Embed URLs
    reportEmbedConfig.reportsDetail[reportInfo.id] = reportDetails;

    // Push datasetId of the report into datasetIds array
    datasetIds.add(reportInfo.datasetId);
    reportIds.add(reportInfo.id);

    // Append to existing list of datasets to achieve dynamic binding later
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
  // Store authentication token
  let tokenResponse;

  // Store the error thrown while getting authentication token
  let errorResponse;

  // Get the response from the authentication request
  try {
    // TODO Extract scope in configuration variable (based on user roles)
    tokenResponse = await Auth.acquireTokensByRequest({
      scopes: [
        POWER_BI_API_SCOPES_PREFIX + 'Workspace.Read.All',
        POWER_BI_API_SCOPES_PREFIX + 'Report.Read.All',
        POWER_BI_API_SCOPES_PREFIX + 'Dataset.Read.All',
      ],
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
      // Invalid PowerBI Username provided
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
