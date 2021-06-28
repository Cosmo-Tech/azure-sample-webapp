// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';
import fileDownload from 'js-file-download';
import { LOG_TYPES } from './ScenarioRunConstants.js';
import { ORGANISATION_ID } from '../../configs/App.config';

const ScenariorunApi = new CosmotechApiService.ScenariorunApi();

function runScenario (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve) => {
    ScenariorunApi.runScenario(organizationId, workspaceId, scenarioId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function getScenarioRuns (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve) => {
    ScenariorunApi.getScenarioRuns(organizationId, workspaceId, scenarioId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function getScenarioRunCumulatedLogs (organizationId, scenarioRunId) {
  return new Promise((resolve) => {
    ScenariorunApi.getScenarioRunCumulatedLogs(organizationId, scenarioRunId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function getScenarioRunLogs (organizationId, scenarioRunId) {
  return new Promise((resolve) => {
    ScenariorunApi.getScenarioRunLogs(organizationId, scenarioRunId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

async function downloadCumulatedLogsFile (lastRun) {
  const { error, data } = await getScenarioRunCumulatedLogs(ORGANISATION_ID, lastRun.scenarioRunId);
  if (error) {
    console.error(error);
  } else {
    const blob = new Blob([data]);
    fileDownload(blob, lastRun.scenarioRunId + '_cumulated_logs.txt');
  }
}

async function downloadLogsSimpleFile (lastRun) {
  const { error, data } = await getScenarioRunLogs(ORGANISATION_ID, lastRun.scenarioRunId);
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
  getScenarioRunCumulatedLogs,
  getScenarioRunLogs,
  downloadLogsFile
};

export default ScenarioRunService;
