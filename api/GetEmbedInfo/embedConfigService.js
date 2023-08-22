// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const auth = require('./authentication');
const PowerBiReportDetails = require('../utils/models/powerbi/embedReportConfig');
const EmbedConfig = require('../utils/models/powerbi/embedConfig.js');
const { getConfigValue } = require('./config');
const { ServiceAccountError } = require('./errors.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Generate embed token and embed urls for reports
 * @return Details like Embed URL, Access token and Expiry
 */
async function getEmbedInfo(reportsIds, workspaceId) {
  const workspacePBIId = workspaceId ?? process.env.POWER_BI_WORKSPACE_ID;
  const embedParams = await getEmbedParamsForSelectedReports(workspacePBIId, reportsIds);
  return {
    accesses: {
      accessToken: embedParams.embedToken.token,
      reportsInfo: embedParams.reportsDetail,
      expiry: embedParams.embedToken.expiration,
    },
    error: null,
  };
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

  const res = await fetch(getAllReportsURL, { method: 'GET', headers });
  if (!res.ok) {
    const hintsByStatusCode = {
      401: `Please check that the app registration "${getConfigValue(
        'POWER_BI_CLIENT_ID'
      )}" has access to the PowerBI workspace with id "${workspaceId}"`,
      404: `Please check that the PowerBI workspace id "${workspaceId}" is correct`,
    };

    throw new ServiceAccountError(
      res.status,
      res.statusText,
      hintsByStatusCode?.[res.status] ?? res.headers?.get('x-powerbi-error-info'),
      `Error while retrieving report embed details\r\n${res.statusText}`
    );
  }

  const allReportsJSON = await res.json();
  const allReports = allReportsJSON.value;
  if (allReports.length === 0)
    throw new ServiceAccountError(
      404,
      'Not Found',
      `Can't find reports. PowerBI workspace with id "${workspaceId}" does not contain any reports`
    );

  const selectedReports = allReports.filter((report) => selectedReportsIds.includes(report.id));
  if (selectedReports.length === 0) {
    const reportsIds = selectedReportsIds.map((reportId) => ` - ${reportId}`).join('\r\n');
    const details = `PowerBI workspace "${workspaceId}" does not contain the following reports:\r\n${reportsIds}`;
    throw new ServiceAccountError(
      404,
      'Not Found',
      `Can't find requested reports in PowerBI workspace "${workspaceId}". Please check your dashboards configuration.`,
      details
    );
  }

  // Get datasets and embed URLs for selected reports
  const datasetIds = new Set([]);
  const reportIds = new Set([]);
  for (const report of selectedReports) {
    reportEmbedConfig.reportsDetail[report.id] = new PowerBiReportDetails(report.id, report.name, report.embedUrl);
    datasetIds.add(report.datasetId);
    reportIds.add(report.id);
  }

  // Get token granting access to selected reports & datasets
  reportEmbedConfig.embedToken = await getEmbedTokenForMultipleReportsSingleWorkspace(
    Array.from(reportIds),
    Array.from(datasetIds),
    headers,
    workspaceId
  );
  return reportEmbedConfig;
}

/**
 * Get Embed token for multiple reports, multiple datasets, and an optional target workspace
 * @param {Array<string>} reportIds
 * @param {Array<string>} datasetIds
 * @param {Object} headers
 * @param {String} targetWorkspaceId - Optional Parameter
 * @return EmbedToken
 */
async function getEmbedTokenForMultipleReportsSingleWorkspace(reportIds, datasetIds, headers, targetWorkspaceId) {
  const formData = {
    datasets: datasetIds.map((datasetId) => ({ id: datasetId })),
    reports: reportIds.map((reportId) => ({ id: reportId })),
    targetWorkspaces: targetWorkspaceId ? [{ id: targetWorkspaceId }] : undefined,
  };
  const body = JSON.stringify(formData);

  // Generate Embed token for multiple datasets, reports and single workspace.
  // Refer https://aka.ms/MultiResourceEmbedToken
  const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
  const result = await fetch(embedTokenApi, {
    method: 'POST',
    headers,
    body,
  });

  if (!result.ok) {
    if (result.status === 400)
      throw new ServiceAccountError(
        result.status,
        result.statusText,
        'Please check the ids of PowerBI workspace and reports in your workspace configuration.',
        `Details of failing request:\r\n${body}`
      );
    else if (result.status === 401)
      throw new ServiceAccountError(
        result.status,
        result.statusText,
        'Please check that the webapp app registration has been added with the role "Member" in the PowerBI workspace.',
        `Details of failing request:\r\n${body}`
      );

    throw new ServiceAccountError(
      result.status,
      result.statusText,
      result.headers?.get('x-powerbi-error-info'),
      `Error while retrieving report embed details\r\n${result.statusText}`
    );
  }

  return result.json();
}

/**
 * Get Request header
 * @return Request header with Bearer token
 */
async function getRequestHeader() {
  const tokenResponse = await auth.getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenResponse.accessToken}`,
  };
}

module.exports = {
  getEmbedInfo,
};
