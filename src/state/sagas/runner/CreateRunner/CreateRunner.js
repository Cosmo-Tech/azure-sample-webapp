// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DatasetsUtils } from '../../../../utils';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { createDataset } from '../../datasets/CreateDataset';

const getUserEmail = (state) => state.auth.userEmail;

function* uploadFileParameter(parameter, organizationId, workspaceId) {
  try {
    const connectorId = 'c-d7e5p9o0kjn9';
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
    yield call(Api.Datasets.updateDataset, organizationId, datasetId, updatedDatasetPart);
    yield call(Api.Workspaces.uploadWorkspaceFile, organizationId, workspaceId, file, true, storageFilePath);

    return { datasetId };
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.runnerDatasetPartNotCreated',
          `Runner dataset {{datasetName}} part hasn't been created`,
          {
            datasetName: parameter.id,
          }
        )
      )
    );
    throw new Error(error);
  }
}

export function* createRunner(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runner = action.runner;
    const parameters = runner.parametersValues;
    const userEmail = yield select(getUserEmail);

    const security = { default: 'none', accessControlList: [{ id: userEmail, role: 'admin' }] };
    runner.security = security;
    runner.runTemplateId = runner.sourceType;
    delete runner.sourceType;

    for (const parameter of parameters) {
      if (parameter.varType === '%DATASETID%') {
        const { datasetId } = yield call(uploadFileParameter, parameter, organizationId, workspaceId);
        parameter.value = datasetId;
      }
    }

    const { data: runnerCreated } = yield call(Api.Runners.createRunner, organizationId, workspaceId, runner);
    const runnerId = runnerCreated.id;

    const dataset = {
      name: runner.name,
      description: runner.description,
      tags: runner.tags,
      sourceType: 'ETL',
      source: { location: workspaceId, name: runnerId },
    };

    const datasetId = yield call(createDataset, { dataset, organizationId });
    const patchedRunner = { runTemplateId: runner.runTemplateId, datasetList: [datasetId] };
    yield call(Api.Runners.updateRunner, organizationId, workspaceId, runnerId, patchedRunner);

    yield put({
      type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET,
      organizationId,
      datasetId,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.runnerNotCreated', "Runner hasn't been created")
      )
    );
  }
}

function* createRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_RUNNER, createRunner);
}

export default createRunnerSaga;
