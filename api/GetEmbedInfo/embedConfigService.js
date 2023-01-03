// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const auth = require('./authentication');
const utils = require('./utils');
const PowerBiReportDetails = require('../utils/models/powerbi/embedReportConfig');
const EmbedConfig = require('../utils/models/powerbi/embedConfig.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Generate embed token and embed urls for reports
 * @return Details like Embed URL, Access token and Expiry
 */
async function getEmbedInfo(reportsIds) {
  // Get the Report Embed details
  try {
    // Get report details and embed token
    const embedParams = await getEmbedParamsForSelectedReports(process.env.POWER_BI_WORKSPACE_ID, reportsIds);
    return {
      accesses: {
        accessToken: embedParams.embedToken.token,
        reportsInfo: embedParams.reportsDetail,
        expiry: embedParams.embedToken.expiration,
      },
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      accesses: null,
      error: {
        status: err.status,
        statusText: err.statusText,
        powerBIErrorInfo: err.headers?.get('x-powerbi-error-info'),
        description:
          `Error while retrieving report embed details\r\n${err.statusText}\r\nRequestId: \n` +
          `${err.headers?.get('requestid')}`,
      },
    };
  }
}

/**
 * Get embed params for selected reports
 * @param {string} workspaceId
 * @param {Array} selectedReportsIds
 * @return EmbedConfig object
 */
async function getEmbedParamsForSelectedReports(workspaceId, selectedReportsIds) {
  const reportEmbedConfig = new EmbedConfig();
  reportEmbedConfig.reportsDetail = {};

  // Get all reports from PowerBI workspace
  const getAllReportsURL = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;
  const headers = await getRequestHeader();
  const res = await fetch(getAllReportsURL, {
    method: 'GET',
    headers: headers,
  });

  if (!res.ok) throw res;
  const allReportsJSON = await res.json();
  const allReports = allReportsJSON.value;

  // Get datasets and embed URLs for selected reports
  const selectedReports = allReports.filter((report) => selectedReportsIds.includes(report.id));
  const datasetIds = new Set([]);
  const reportIds = new Set([]);
  for (const report of selectedReports) {
    const reportDetails = new PowerBiReportDetails(report.id, report.name, report.embedUrl);
    reportEmbedConfig.reportsDetail[report.id] = reportDetails;
    datasetIds.add(report.datasetId);
    reportIds.add(report.id);
  }

  // Get token granting access to selected reports & datasets
  reportEmbedConfig.embedToken = await getEmbedTokenForMultipleReportsSingleWorkspace(
    Array.from(reportIds),
    Array.from(datasetIds),
    workspaceId
  );
  return reportEmbedConfig;
}

/**
 * Get Embed token for multiple reports, multiple datasets, and an optional target workspace
 * @param {Array<string>} reportIds
 * @param {Array<string>} datasetIds
 * @param {String} targetWorkspaceId - Optional Parameter
 * @return EmbedToken
 */
async function getEmbedTokenForMultipleReportsSingleWorkspace(reportIds, datasetIds, targetWorkspaceId) {
  // Add dataset ids in the request
  const formData = { datasets: [] };
  for (const datasetId of datasetIds) {
    formData.datasets.push({
      id: datasetId,
    });
  }

  // Add report ids in the request
  formData.reports = [];
  for (const reportId of reportIds) {
    formData.reports.push({
      id: reportId,
    });
  }

  // Add targetWorkspace id in the request
  if (targetWorkspaceId) {
    formData.targetWorkspaces = [];
    formData.targetWorkspaces.push({
      id: targetWorkspaceId,
    });
  }

  const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
  const headers = await getRequestHeader();

  // Generate Embed token for multiple datasets, reports and single workspace.
  // Refer https://aka.ms/MultiResourceEmbedToken
  const result = await fetch(embedTokenApi, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  });

  if (!result.ok) throw result;
  return result.json();
}

/**
 * Get Request header
 * @return Request header with Bearer token
 */
async function getRequestHeader() {
  // Store authentication token
  let tokenResponse;

  // Store the error thrown while getting authentication token
  let errorResponse;

  // Get the response from the authentication request
  try {
    tokenResponse = await auth.getAccessToken();
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

  // Extract AccessToken from the response
  const token = tokenResponse.accessToken;
  return {
    'Content-Type': 'application/json',
    Authorization: utils.getAuthHeader(token),
  };
}

module.exports = {
  getEmbedInfo,
};
