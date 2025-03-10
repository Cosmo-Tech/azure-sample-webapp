// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { Api } from '../../../../services/config/Api';
import { ApiUtils, DatasetsUtils } from '../../../../utils';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

function* uploadFileParameter(parameter, organizationId, workspaceId) {
  try {
    const connectorId = parameter.connectorId;
    const file = parameter.value.file;
    const parameterId = parameter.parameterId;

    if (!connectorId) {
      throw new Error(`Missing connector id in configuration file for scenario parameter ${parameterId}`);
    }
    const datasetPart = {
      name: parameterId,
      description: parameter.description,
      connector: { id: connectorId },
      tags: ['dataset_part'],
      main: false,
    };
    const { data } = yield call(Api.Datasets.createDataset, organizationId, datasetPart);

    const datasetId = data.id;

    const storageFilePath = DatasetsUtils.buildStorageFilePath(datasetId, file.name);
    const newConnector = DatasetsUtils.buildAzureStorageConnector(connectorId, storageFilePath);

    const updatedDatasetPart = { ...datasetPart, connector: newConnector };
    const { data: updatedDataset } = yield call(
      Api.Datasets.updateDataset,
      organizationId,
      datasetId,
      updatedDatasetPart
    );
    yield call(Api.Workspaces.uploadWorkspaceFile, organizationId, workspaceId, file, true, storageFilePath);
    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...updatedDataset,
    });

    return datasetId;
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.runnerFileNotUploaded', `Runner file {runnerFile} hasn't been uploaded`, {
          runnerFile: parameter.value.file,
        })
      )
    );
    throw new Error(error);
  }
}

export function* updateRunner(action) {
  try {
    const runnerPatch = action.runnerPatch;
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;
    const datasetId = action.datasetId;
    for (const parameter of runnerPatch.parametersValues) {
      if (parameter.varType === '%DATASETID%') {
        if (parameter.value.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD)
          parameter.value = yield call(uploadFileParameter, parameter, organizationId, workspaceId);
        else if (parameter.value.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD)
          parameter.value = parameter.value.id;
      }
    }
    const runnerDataToUpdate = runnerPatch.parametersValues
      ? { ...runnerPatch, ...ApiUtils.formatParametersForApi(runnerPatch.parametersValues) }
      : runnerPatch;
    const { data } = yield call(Api.Runners.updateRunner, organizationId, workspaceId, runnerId, runnerDataToUpdate);
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_ETL_RUNNER,
      runnerId,
      runner: { ...data, parametersValues: ApiUtils.formatParametersFromApi(data.parametersValues) },
    });
    yield put({ type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET, organizationId, datasetId });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.runnerUpdateError', "Runner hasn't been updated")
      )
    );
  }
}
function* updateRunnerData() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_RUNNER, updateRunner);
}
export default updateRunnerData;
