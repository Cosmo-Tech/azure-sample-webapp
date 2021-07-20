// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { LOG_TYPES } from './ScenarioRunConstants.js';
import { ORGANIZATION_ID } from '../../configs/App.config';
import { ScenarioRunApi } from '../ServiceCommons';

async function runScenario (organizationId, workspaceId, scenarioId) {
  const result = await ScenarioRunApi.runScenario(organizationId, workspaceId, scenarioId);
  return result;
}

async function getScenarioRuns (organizationId, workspaceId, scenarioId) {
  const result = await ScenarioRunApi.getScenarioRuns(organizationId, workspaceId, scenarioId);
  return result;
}

async function downloadCumulatedLogsFile (lastRun) {
  const { error, data } = await ScenarioRunApi.getScenarioRunCumulatedLogs(ORGANIZATION_ID, lastRun.scenarioRunId);
  if (error) {
    console.error(error);
  } else {
    const blob = new Blob([data]);
    fileDownload(blob, lastRun.scenarioRunId + '_cumulated_logs.txt');
  }
}

async function downloadLogsSimpleFile (lastRun) {
  const { error, data } = await ScenarioRunApi.getScenarioRunLogs(ORGANIZATION_ID, lastRun.scenarioRunId);
  if (error) {
    console.error(error);
  } else {
    const blob = new Blob([data]);
    fileDownload(blob, lastRun.scenarioRunId + '_simple_logs.json');
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
  runScenario,
  getScenarioRuns,
  downloadLogsFile
};

export default ScenarioRunService;
