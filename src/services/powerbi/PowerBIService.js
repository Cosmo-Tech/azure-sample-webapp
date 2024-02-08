// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth } from '@cosmotech/core';
import { GET_EMBED_INFO_URL } from '../../state/commons/PowerBIConstants';
import { clientApi } from '../ClientApi';
import { COSMOTECH_API_SCOPE, POWER_BI_API_DEFAULT_SCOPE } from '../config/Auth';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { handleServiceAccountError, handleUserAccountError, PowerBIError } from './errors';

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
const getPowerBIData = (powerBIWorkspaceId, reportsIds, logInWithUserCredentials) => {
  return logInWithUserCredentials
    ? getPowerBIDataWithCurrentUserToken(powerBIWorkspaceId, reportsIds)
    : getPowerBIDataWithServiceAccount(powerBIWorkspaceId, reportsIds);
};

/**
 * Get PowerBI accessible data
 * @return Details like Embed URL, Access token and Expiry, errors if any
 */
const getPowerBIDataWithCurrentUserToken = async (powerBIWorkspaceId, reportsIds) => {
  try {
    const embedParams = await fetchReportEmbedInfo(powerBIWorkspaceId, reportsIds);
    return {
      accesses: {
        accessToken: embedParams.accessToken,
        reportsInfo: embedParams.reportsDetail,
        expiry: embedParams.expiresOn,
      },
      error: null,
    };
  } catch (error) {
    return {
      accesses: null,
      error: handleUserAccountError(error),
    };
  }
};

const getPowerBIDataWithServiceAccount = async (powerBIWorkspaceId, reportsIds) => {
  let headers;
  try {
    ({ headers } = await getAuthenticationInfo(COSMOTECH_API_SCOPE));
  } catch (error) {
    return handleServiceAccountError(
      new PowerBIError(401, 'Unauthorized', 'Failed to retrieve user token with Cosmo Tech API scopes', error)
    );
  }

  return clientApi
    .post(
      GET_EMBED_INFO_URL,
      { reports: reportsIds, workspaceId: powerBIWorkspaceId },
      { headers: { 'csm-authorization': headers.Authorization } }
    )
    .then((response) => response?.data)
    .catch((error) => ({
      accesses: null,
      error: handleServiceAccountError(error),
    }));
};

/**
 * Fetch Reports info regarding a workspace Id
 * @param {string} workspaceId
 * @param {string} requestedReportsIds
 * @returns {Promise<{reportsInfo, reportEmbedConfig: EmbedConfig}>}
 */
const fetchReportEmbedInfo = async (workspaceId, requestedReportsIds) => {
  let headers, accessToken, expiresOn;
  try {
    ({ headers, accessToken, expiresOn } = await getAuthenticationInfo(POWER_BI_API_DEFAULT_SCOPE));
  } catch (error) {
    return handleServiceAccountError(
      new PowerBIError(401, 'Unauthorized', 'Failed to retrieve user token with PowerBI API scopes', error)
    );
  }

  const getAllReportsURL = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;
  const result = await fetch(getAllReportsURL, { method: 'GET', headers });
  if (!result.ok) {
    const pbiErrorInfoHeader = result.headers?.get('x-powerbi-error-info');
    let hint;
    if (result.status === 401) {
      if (pbiErrorInfoHeader === 'GroupNotAccessible')
        hint =
          `Can't access PowerBI workspace with id "${workspaceId}". ` +
          'Please check your configuration and user permissions.';
      else hint = `Can't access PowerBI workspace with id "${workspaceId}". Please check your configuration.`;
    }
    if (result.status === 404) {
      hint = `Can't find PowerBI workspace with id "${workspaceId}". Please check your configuration.`;
    }

    const statusText = (result.statusText ?? '') + (pbiErrorInfoHeader ? ` (${pbiErrorInfoHeader})` : '');
    throw new PowerBIError(
      result.status,
      statusText,
      hint ?? result.headers?.get('x-powerbi-error-info'),
      `Error while retrieving report embed details\r\n${result.statusText}`
    );
  }

  const resultJson = await result.json();
  const allReports = resultJson.value;
  if (allReports.length === 0)
    throw new PowerBIError(
      404,
      'Not Found',
      `Can't find reports. PowerBI workspace with id "${workspaceId}" does not contain any reports`
    );

  const selectedReports = allReports.filter((report) => requestedReportsIds.includes(report.id));
  if (selectedReports.length === 0) {
    const reportsIds = requestedReportsIds.map((reportId) => ` - ${reportId}`).join('\r\n');
    const details = `PowerBI workspace "${workspaceId}" does not contain the following reports:\r\n${reportsIds}`;
    throw new PowerBIError(
      404,
      'Not Found',
      `Can't find requested reports in PowerBI workspace "${workspaceId}". Please check your dashboards configuration.`,
      details
    );
  }

  const reportEmbedConfig = new EmbedConfig('report', {}, accessToken, expiresOn);
  selectedReports.forEach((report) => {
    reportEmbedConfig.reportsDetail[report.id] = new PowerBiReportDetails(report.id, report.name, report.embedUrl);
  });

  return reportEmbedConfig;
};

/**
 * Get Authentication information
 * @return Authentication Information with : request header with Bearer token, accessToken and token expiration date
 */
const getAuthenticationInfo = async (scope) => {
  try {
    const tokenResponse = await Auth.acquireTokensByRequest({ scopes: [scope] });
    const accessToken = tokenResponse.accessToken;
    return {
      accessToken,
      expiresOn: tokenResponse.expiresOn,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
  } catch (err) {
    const errorResponse =
      // eslint-disable-next-line no-prototype-builtins
      err.hasOwnProperty('error_description') && err.hasOwnProperty('error') ? err.error_description : err.toString();
    throw new Error(errorResponse);
  }
};

export const PowerBIService = {
  getPowerBIData,
};
