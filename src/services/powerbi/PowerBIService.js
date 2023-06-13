// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { POWER_BI_WORKSPACE_ID } from '../../config/PowerBI';
import { EmbedConfig, PowerBiReportDetails } from './PowerBIModels';
import { POWER_BI_API_DEFAULT_SCOPE } from '../config/Auth';
import { COSMOTECH_API_SCOPE } from '../../config/GlobalConfiguration.js';
import { GET_EMBED_INFO_URL } from '../../state/commons/PowerBIConstants';
import { clientApi } from '../ClientApi';

function _generateAuthorizationHeader(accessToken) {
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

const getPowerBIDataWithServiceAccount = async () => {
  try {
    const { headers } = await getAuthenticationInfo(COSMOTECH_API_SCOPE);
    const { data } = await clientApi.get(GET_EMBED_INFO_URL, {
      headers: { 'csm-authorization': headers.Authorization },
    });
    return {
      accesses: {
        accessToken: data?.accesses?.accessToken,
        reportsInfo: data?.accesses?.reportsInfo,
        expiry: data?.accesses?.expiry,
      },
      error: data?.error,
    };
  } catch (error) {
    console.error(error);
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
async function fetchReportEmbedInfo(workspaceId) {
  const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;
  const { headers, accessToken, expiresOn } = await getAuthenticationInfo(POWER_BI_API_DEFAULT_SCOPE);

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
}

/**
 * Get embed params for all reports for a single workspace
 * @param {string} workspaceId
 * @param {Array<string>} additionalDatasetIds - Optional Parameter
 * @return EmbedConfig object
 */
async function getEmbedParamsForAllReportsInWorkspace(workspaceId, additionalDatasetIds) {
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
}

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
  getPowerBIDataWithServiceAccount,
};
