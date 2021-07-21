// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { LOG_TYPES } from './ScenarioRunConstants.js';
import { ORGANIZATION_ID } from '../../configs/App.config';
import { ScenarioRunApi } from '../ServiceCommons';

async function downloadCumulatedLogsFile (lastRun) {
  try {
    const logs = await ScenarioRunApi.getScenarioRunCumulatedLogs(ORGANIZATION_ID, lastRun.scenarioRunId);
    const blob = new Blob([logs]);
    fileDownload(blob, lastRun.scenarioRunId + '_cumulated_logs.txt');
  } catch (e) {
    console.error(e);
  }
}

async function downloadLogsSimpleFile (lastRun) {
  try {
    const logs = await ScenarioRunApi.getScenarioRunLogs(ORGANIZATION_ID, lastRun.scenarioRunId);
    const blob = new Blob([logs]);
    fileDownload(blob, lastRun.scenarioRunId + '_simple_logs.json');
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
