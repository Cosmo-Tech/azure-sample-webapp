// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { FileBlobUtils } from '@cosmotech/core';
import { Api } from '../../services/config/Api';
import applicationStore from '../../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';

async function downloadLogsFile(organizationId, workspaceId, runnerId, runId) {
  try {
    const fileName = `${runnerId}_${runId}_cumulated_logs.txt`;
    const { data } = await Api.RunnerRuns.getRunLogs(organizationId, workspaceId, runnerId, runId, {
      responseType: 'text',
    });

    const logsParse = JSON.parse(data);
    const jsonLogs = JSON.parse(logsParse.containers.csmorchestrator.logs);
    const mainContainerLogs = (jsonLogs.data.result ?? []).filter((result) => result.stream.container === 'main');
    const parsedLogs = mainContainerLogs
      .map((result) => result.values)
      .flat()
      .sort((a, b) => a[0] - b[0])
      .map((row) => row[1])
      .join('\n');

    FileBlobUtils.downloadFileFromData(parsedLogs, fileName);
  } catch (error) {
    console.error(error);
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.logs', "Log file hasn't been downloaded."))
    );
  }
}

const RunnerRunService = {
  downloadLogsFile,
};

export default RunnerRunService;
