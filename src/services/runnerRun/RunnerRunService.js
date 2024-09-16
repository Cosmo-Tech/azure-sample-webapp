// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { FileBlobUtils } from '@cosmotech/core';
import applicationStore from '../../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';
import { Api } from '../config/Api';

async function downloadLogsFile(organizationId, workspaceId, runnerId, lastRunId) {
  try {
    const fileName = `${runnerId}_${lastRunId}_logs.txt`;
    const { data } = await Api.RunnerRuns.getRunLogs(organizationId, workspaceId, runnerId, lastRunId);
    const parsedLogs = data?.logs?.map((logItem) => logItem.line)?.join('\n') ?? '';

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
