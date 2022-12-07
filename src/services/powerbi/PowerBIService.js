// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { POWER_BI_API_DEFAULT_SCOPE } from '../config/Auth';

const _generateAuthorizationHeader = (accessToken) => 'Bearer '.concat(accessToken);

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
const getPowerBIData = async (powerBIWorkspaceId) => {
  try {
    const embedParams = await getEmbedParamsForAllReportsInWorkspace(powerBIWorkspaceId);
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
};

/**
 * Fetch Reports info regarding a workspace Id
 * @param {string} workspaceId
 * @returns {Promise<{reportsInfo, reportEmbedConfig: EmbedConfig}>}
 */
const fetchReportEmbedInfo = async (workspaceId) => {
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
  return {
    reportEmbedConfig,
    reportsInfo,
  };
};

/**
 * Get embed params for all reports for a single workspace
 * @param {string} workspaceId
 * @param {Array<string>} additionalDatasetIds - Optional Parameter
 * @return EmbedConfig object
 */
const getEmbedParamsForAllReportsInWorkspace = async (workspaceId, additionalDatasetIds) => {
  const { reportEmbedConfig, reportsInfo } = await fetchReportEmbedInfo(workspaceId);

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
};

/**
 * Get Authentication information
 * @return Authentication Information with : request header with Bearer token, accessToken and token expiration date
 */
const getAuthenticationInfo = async () => {
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
      Authorization: _generateAuthorizationHeader(accessToken),
    },
  };
};

export const PowerBIService = {
  getPowerBIData,
};
