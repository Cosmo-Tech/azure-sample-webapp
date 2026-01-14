// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { Api } from '../../../services/config/Api';
import { ApiUtils, ConfigUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../../datasets/constants';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateEtlRunner } from '../reducers';

function* uploadFileParameter(parameter, organizationId, workspaceId, runnerDatasetId) {
  try {
    const connectorId = parameter.connectorId;
    const file = parameter.value?.value;
    const parameterId = parameter.parameterId;

    if (!connectorId) {
      throw new Error(`Missing connector id in configuration file for scenario parameter ${parameterId}`);
    }
    if (!file) {
      throw new Error(`Missing file in parameter ${parameterId}`);
    }
    const datasetPart = {
      name: file.name,
      description: parameter.description,
      connector: { id: connectorId },
      tags: ['dataset_part'],
      main: false,
    };

    // Create the dataset part with the file
    const { data: createdDatasetPart } = yield call(
      Api.Datasets.createDatasetPart,
      organizationId,
      workspaceId,
      runnerDatasetId,
      file,
      datasetPart
    );

    return {
      datasetPartId: createdDatasetPart.id,
      parameterId,
      sourceName: file.name,
      datasetId: runnerDatasetId,
    };
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.runnerFileNotUploaded',
          `Runner file {runnerFile} hasn't been uploaded`,
          {
            runnerFile: parameter.value?.name || 'unknown',
          }
        ),
      })
    );
    throw new Error(error);
  }
}

export function* updateEtlRunnerData(action) {
  try {
    const runnerPatch = action.runnerPatch;
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;
    const dataset = action.dataset;
    const uploadedFiles = [];

    for (const parameter of runnerPatch.parametersValues) {
      if (ConfigUtils.isFileParameter(parameter)) {
        if (parameter.value?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
          const fileInfo = yield call(uploadFileParameter, parameter, organizationId, workspaceId, dataset.id);
          parameter.value = fileInfo.datasetPartId;
          uploadedFiles.push(fileInfo);
        } else if (parameter.value?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD) {
          parameter.value = parameter.value.id;
        }
      }
    }
    const runnerDataToUpdate = runnerPatch.parametersValues
      ? { ...runnerPatch, ...ApiUtils.formatParametersForApi(runnerPatch.parametersValues) }
      : runnerPatch;
    const { data } = yield call(Api.Runners.updateRunner, organizationId, workspaceId, runnerId, runnerDataToUpdate);

    // Update datasets.parameters with uploaded file information
    const updatedRunner = { ...data, parametersValues: ApiUtils.formatParametersFromApi(data.parametersValues) };
    if (uploadedFiles.length > 0) {
      const datasetsParameters = updatedRunner.datasets?.parameters || [];
      uploadedFiles.forEach((fileInfo) => {
        const existingParam = datasetsParameters.find((p) => p.name === fileInfo.parameterId);
        if (existingParam) {
          existingParam.id = fileInfo.datasetPartId;
          existingParam.sourceName = fileInfo.sourceName;
        } else {
          datasetsParameters.push({
            id: fileInfo.datasetPartId,
            name: fileInfo.parameterId,
            datasetId: fileInfo.datasetId,
            sourceName: fileInfo.sourceName,
          });
        }
      });
      updatedRunner.datasets = { ...updatedRunner.datasets, parameters: datasetsParameters };
    }

    yield put(
      updateEtlRunner({
        runnerId,
        runner: updatedRunner,
      })
    );
    yield put({ type: DATASET_ACTIONS_KEY.REFRESH_DATASET, organizationId, dataset });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.runnerNotUpdated', "Runner hasn't been updated"),
      })
    );
  }
}

function* updateEtlRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.UPDATE_ETL_RUNNER, updateEtlRunnerData);
}

export default updateEtlRunnerSaga;
