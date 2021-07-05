// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const auth = require(__dirname.join('/authentication.js'));
const utils = require(__dirname.join('/utils.js'));
const PowerBiReportDetails = require(__dirname.join('/../utils/models/powerbi/embedReportConfig.js'));
const EmbedConfig = require(__dirname.join('/../utils/models/powerbi/embedConfig.js'));
const fetch = require('node-fetch');

/**
 * Generate embed token and embed urls for reports
 * @return Details like Embed URL, Access token and Expiry
 */
async function getEmbedInfo () {
  // Get the Report Embed details
  try {
    // Get report details and embed token
    const embedParams = await getEmbedParamsForMultipleReports(
      process.env.POWER_BI_WORKSPACE_ID,
      [
        process.env.POWER_BI_REPORT_ID_DASHBOARD,
        process.env.POWER_BI_REPORT_ID_MAIN_PAGE
      ]
    );

    return {
      accessToken: embedParams.embedToken.token,
      embedUrl: embedParams.reportsDetail,
      expiry: embedParams.embedToken.expiration
    };
  } catch (err) {
    return {
      status: err.status,
      error: `Error while retrieving report embed details\r\n${err.statusText}\r\nRequestId: \n${err.headers.get('requestid')}`
    };
  }
}

/**
 * Get embed params for multiple reports for a single workspace
 * @param {string} workspaceId
 * @param {Array<string>} reportIds
 * @param {Array<string>} additionalDatasetIds - Optional Parameter
 * @return EmbedConfig object
 */
async function getEmbedParamsForMultipleReports (
  workspaceId,
  reportIds,
  additionalDatasetIds
) {
  // EmbedConfig object
  const reportEmbedConfig = new EmbedConfig();

  // Create dictionary of embedReports for mapping
  reportEmbedConfig.reportsDetail = {};

  // Create Array of datasets
  const datasetIds = [];

  // Get datasets and Embed URLs for all the reports
  for (const reportId of reportIds) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await getRequestHeader();

    // Get report info by calling the PowerBI REST API
    const result = await fetch(reportInGroupApi, {
      method: 'GET',
      headers: headers
    });

    if (!result.ok) {
      throw result;
    }

    // Convert result in json to retrieve values
    const resultJson = await result.json();

    // Store result into PowerBiReportDetails object
    const reportDetails = new PowerBiReportDetails(
      resultJson.id,
      resultJson.name,
      resultJson.embedUrl
    );

    // Create mapping for reports and Embed URLs
    reportEmbedConfig.reportsDetail[resultJson.name] = reportDetails;

    // Push datasetId of the report into datasetIds array
    datasetIds.push(resultJson.datasetId);
  }

  // Append to existing list of datasets to achieve dynamic binding later
  if (additionalDatasetIds) {
    datasetIds.push(...additionalDatasetIds);
  }

  // Get Embed token multiple resources
  reportEmbedConfig.embedToken = await getEmbedTokenForMultipleReportsSingleWorkspace(
    reportIds,
    datasetIds,
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
async function getEmbedTokenForMultipleReportsSingleWorkspace (
  reportIds,
  datasetIds,
  targetWorkspaceId
) {
  // Add dataset ids in the request
  const formData = { datasets: [] };
  for (const datasetId of datasetIds) {
    formData.datasets.push({
      id: datasetId
    });
  }

  // Add report ids in the request
  formData.reports = [];
  for (const reportId of reportIds) {
    formData.reports.push({
      id: reportId
    });
  }

  // Add targetWorkspace id in the request
  if (targetWorkspaceId) {
    formData.targetWorkspaces = [];
    formData.targetWorkspaces.push({
      id: targetWorkspaceId
    });
  }

  const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
  const headers = await getRequestHeader();

  // Generate Embed token for multiple datasets, reports and single workspace. Refer https://aka.ms/MultiResourceEmbedToken
  const result = await fetch(embedTokenApi, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData)
  });

  if (!result.ok) throw result;
  return result.json();
}

/**
 * Get Request header
 * @return Request header with Bearer token
 */
async function getRequestHeader () {
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
      err.hasOwnProperty('error_description') && err.hasOwnProperty('error')
    ) {
      errorResponse = err.error_description;
    } else {
      // Invalid PowerBI Username provided
      errorResponse = err.toString();
    }
    return {
      status: 401,
      error: errorResponse
    };
  }

  // Extract AccessToken from the response
  const token = tokenResponse.accessToken;
  return {
    'Content-Type': 'application/json',
    Authorization: utils.getAuthHeader(token)
  };
}

module.exports = {
  getEmbedInfo: getEmbedInfo
};
