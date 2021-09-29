// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ORGANIZATION_ID } from '../../config/AppInstance';
import { Api } from '../../services/config/Api';

async function downloadScenarioData (workspaceId, scenarioId) {
  try {
    const { data, status } = await Api.Scenarios.downloadScenarioData(ORGANIZATION_ID, workspaceId, scenarioId);
    if (status < 200 || status >= 400) {
      throw new Error('Error in downloadScenarioData');
    }
    return data.id;
  } catch (e) {
    console.error(e);
  }
}

async function getScenarioDataDownloadJobInfo (workspaceId, scenarioId, scenarioDownloadId) {
  try {
    const { data, status } = await Api.Scenarios.getScenarioDataDownloadJobInfo(
      ORGANIZATION_ID, workspaceId, scenarioId, scenarioDownloadId);
    if (status < 200 || status >= 400) {
      throw new Error('Error in getScenarioDataDownloadJobInfo');
    }
    return data;
  } catch (e) {
    console.error(e);
  }
}

const ScenarioService = {
  downloadScenarioData,
  getScenarioDataDownloadJobInfo
};

export default ScenarioService;
