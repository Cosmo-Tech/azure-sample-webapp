// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { FileBlobUtils } from '@cosmotech/core';
import { Api } from '../../services/config/Api';
import applicationStore from '../../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';

async function downloadLogs(organizationId, lastRun) {
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

const RunnerRunService = {
  downloadLogs,
};

export default RunnerRunService;
