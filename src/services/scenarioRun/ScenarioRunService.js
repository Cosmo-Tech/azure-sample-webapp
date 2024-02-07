// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { FileBlobUtils } from '@cosmotech/core';
import { Api } from '../../services/config/Api';
import applicationStore from '../../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';
import { LOG_TYPES } from './ScenarioRunConstants.js';

async function downloadCumulatedLogsFile(organizationId, lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_cumulated_logs.txt';
    const { data } = await Api.ScenarioRuns.getScenarioRunCumulatedLogs(organizationId, lastRun.scenarioRunId, {
      responseType: 'blob',
    });
    FileBlobUtils.downloadFileFromData(data, fileName);
  } catch (error) {
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.logs', "Log file hasn't been downloaded."))
    );
  }
}

async function downloadLogsSimpleFile(organizationId, lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_simple_logs.json';
    const { data } = await Api.ScenarioRuns.getScenarioRunLogs(organizationId, lastRun.scenarioRunId, {
      responseType: 'blob',
    });
    FileBlobUtils.downloadFileFromData(data, fileName);
  } catch (error) {
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.logs', "Log file hasn't been downloaded."))
    );
  }
}

function downloadLogsFile(organizationId, lastRun, logType) {
  switch (logType) {
    case LOG_TYPES.SIMPLE_LOGS:
      downloadLogsSimpleFile(organizationId, lastRun);
      break;
    case LOG_TYPES.CUMULATED_LOGS:
      downloadCumulatedLogsFile(organizationId, lastRun);
      break;
    default:
      console.warn(`Unknown log type option "${logType}"`);
      break;
  }
}

const ScenarioRunService = {
  downloadLogsFile,
};

export default ScenarioRunService;
