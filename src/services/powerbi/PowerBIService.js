// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { GET_EMBED_INFO_URL } from '../../state/commons/PowerBIConstants';
import { COSMOTECH_API_SCOPE, POWER_BI_API_DEFAULT_SCOPE } from '../config/Auth';
import { clientApi } from '../ClientApi';

const _generateAuthorizationHeader = (accessToken) => 'Bearer '.concat(accessToken);

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
const getPowerBIData = async (powerBIWorkspaceId, reportsIds, logInWithUserCredentials) => {
  return logInWithUserCredentials
    ? await getPowerBIDataWithCurrentUserToken(powerBIWorkspaceId, reportsIds)
    : await getPowerBIDataWithServiceAccount(powerBIWorkspaceId, reportsIds);
};

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
const getPowerBIDataWithCurrentUserToken = async (powerBIWorkspaceId, reportsIds) => {
  try {
    const embedParams = await getEmbedParamsForAllReportsInWorkspace(powerBIWorkspaceId);
    return {
      accesses: {
        accessToken: embedParams.accessToken,
        reportsInfo: embedParams.reportsDetail,
        expiry: embedParams.expiresOn,
      },
      error: null,
    };
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

const getPowerBIDataWithServiceAccount = async (powerBIWorkspaceId, reportsIds) => {
  try {
    const { headers } = await getAuthenticationInfo(COSMOTECH_API_SCOPE);
    const { data } = await clientApi.post(
      GET_EMBED_INFO_URL,
      { reports: reportsIds, workspaceId: powerBIWorkspaceId },
      { headers: { 'csm-authorization': headers.Authorization } }
    );
    return {
      accesses: {
        accessToken: data?.accesses?.accessToken,
        reportsInfo: data?.accesses?.reportsInfo,
        expiry: data?.accesses?.expiry,
      },
      error: data?.error,
    };
  } catch (error) {
    return {
      error,
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
  const { headers, accessToken, expiresOn } = await getAuthenticationInfo(POWER_BI_API_DEFAULT_SCOPE);

  const reportEmbedConfig = new EmbedConfig('report', {}, accessToken, expiresOn);

  const result = await fetch(reportInGroupApi, {
    method: 'GET',
    headers,
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
 * @return EmbedConfig object
 */
const getEmbedParamsForAllReportsInWorkspace = async (workspaceId) => {
  const { reportEmbedConfig, reportsInfo } = await fetchReportEmbedInfo(workspaceId);

  const datasetIds = new Set([]);
  const reportIds = new Set([]);
  for (const reportInfo of reportsInfo) {
    const reportDetails = new PowerBiReportDetails(reportInfo.id, reportInfo.name, reportInfo.embedUrl);
    reportEmbedConfig.reportsDetail[reportInfo.id] = reportDetails;
    datasetIds.add(reportInfo.datasetId);
    reportIds.add(reportInfo.id);
  }

  return reportEmbedConfig;
};

/**
 * Get Authentication information
 * @return Authentication Information with : request header with Bearer token, accessToken and token expiration date
 */
const getAuthenticationInfo = async (scope) => {
  let tokenResponse, errorResponse;

  try {
    tokenResponse = await Auth.acquireTokensByRequest({
      scopes: [scope],
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
    accessToken,
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
