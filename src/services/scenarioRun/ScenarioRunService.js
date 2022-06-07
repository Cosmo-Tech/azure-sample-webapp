// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { FileBlobUtils } from '@cosmotech/core';
import { LOG_TYPES } from './ScenarioRunConstants.js';
import { ORGANIZATION_ID } from '../../config/AppInstance';
import { Api } from '../../services/config/Api';
import applicationStore from '../../state/Store.config';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';

async function downloadCumulatedLogsFile(lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_cumulated_logs.txt';
    const { data } = await Api.ScenarioRuns.getScenarioRunCumulatedLogs(ORGANIZATION_ID, lastRun.scenarioRunId, {
      responseType: 'blob',
    });
    FileBlobUtils.downloadFileFromData(data, fileName);
  } catch (error) {
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.logs', "Log file hasn't been downloaded."))
    );
  }
}

async function downloadLogsSimpleFile(lastRun) {
  try {
    const fileName = lastRun.scenarioRunId + '_simple_logs.json';
    const { data } = await Api.ScenarioRuns.getScenarioRunLogs(ORGANIZATION_ID, lastRun.scenarioRunId, {
      responseType: 'blob',
    });
    FileBlobUtils.downloadFileFromData(data, fileName);
  } catch (error) {
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.logs', "Log file hasn't been downloaded."))
    );
  }
}

function downloadLogsFile(lastRun, logType) {
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
  downloadLogsFile,
};

export default ScenarioRunService;
