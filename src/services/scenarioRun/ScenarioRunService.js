// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { LOG_TYPES } from './ScenarioRunConstants.js';

class ScenarioRunService {
  constructor (apiService, organizationId) {
    this.apiService = apiService;
    this.organizationId = organizationId;
    this.scenarioRunApi = new apiService.ScenariorunApi();
  }

  async downloadCumulatedLogsFile (lastRun) {
    try {
      const logs = await this.scenarioRunApi.getScenarioRunCumulatedLogs(this.organizationId, lastRun.scenarioRunId);
      const blob = new Blob([logs]);
      fileDownload(blob, lastRun.scenarioRunId + '_cumulated_logs.txt');
    } catch (e) {
      console.error(e);
    }
  }

  async downloadLogsSimpleFile (lastRun) {
    try {
      const logs = await this.scenarioRunApi.getScenarioRunLogs(this.organizationId, lastRun.scenarioRunId);
      const blob = new Blob([logs]);
      fileDownload(blob, lastRun.scenarioRunId + '_simple_logs.json');
    } catch (e) {
      console.error(e);
    }
  }

  downloadLogsFile (lastRun, logType) {
    switch (logType) {
      case LOG_TYPES.SIMPLE_LOGS:
        this.downloadLogsSimpleFile(lastRun);
        break;
      case LOG_TYPES.CUMULATED_LOGS:
        this.downloadCumulatedLogsFile(lastRun);
        break;
    }
  }
}

export default ScenarioRunService;
