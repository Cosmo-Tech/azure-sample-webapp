// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { LOG_TYPES } from './ScenarioRunConstants.js';
import { ORGANIZATION_ID } from '../../config/AppInstance';
import { Api } from '../../services/config/Api';

async function downloadCumulatedLogsFile (lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_cumulated_logs.txt';
    const { data, status } = await Api.ScenarioRuns.getScenarioRunCumulatedLogs(
      ORGANIZATION_ID, lastRun.scenarioRunId, { responseType: 'blob' });
    if (status !== 200) {
      throw new Error(`Error when fetching ${fileName}`);
    }
    fileDownload(data, fileName);
  } catch (e) {
    console.error(e);
  }
}

async function downloadLogsSimpleFile (lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_simple_logs.json';
    const { data, status } = await Api.ScenarioRuns.getScenarioRunLogs(
      ORGANIZATION_ID, lastRun.scenarioRunId, { responseType: 'blob' });
    if (status !== 200) {
      throw new Error(`Error when fetching ${fileName}`);
    }
    fileDownload(data, fileName);
  } catch (e) {
    console.error(e);
  }
}

function downloadLogsFile (lastRun, logType) {
  switch (logType) {
    case LOG_TYPES.SIMPLE_LOGS:
      downloadLogsSimpleFile(lastRun);
      break;
    case LOG_TYPES.CUMULATED_LOGS:
      downloadCumulatedLogsFile(lastRun);
      break;
  }
}

const ScenarioRunService = {
  downloadLogsFile
};

export default ScenarioRunService;
