// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import DatasetService from '../../../services/dataset/DatasetService';
import { ApiUtils, ConfigUtils, DatasetsUtils, RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_REDUCER_STATUS } from '../../datasets/constants';
import { addDataset, addOrUpdateDatasetPart, setDatasetReducerStatus } from '../../datasets/reducers';
import { createDataset } from '../../datasets/sagas/CreateDataset';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { addEtlRunner, updateEtlRunner } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const getUserName = (state) => state.auth.userName;
const getSolution = (state) => state.solution?.current?.data;

function* createETLRunner(action) {
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;
  const runner = action.runner;
  const userEmail = yield select(getUserEmail);
  const ownerName = yield select(getUserName);
  const solution = yield select(getSolution);

  runner.solutionId = solution.id;
  // Add custom security with userEmail to support service accounts in ACL (do not remove, this is NOT managed by the
  // back-end)
  runner.security = { default: 'none', accessControlList: [{ id: userEmail, role: 'admin' }] };
  runner.parametersValues = ApiUtils.formatParametersForApi(runner.parametersValues).parametersValues;
  RunnersUtils.setRunnerOptions(runner, { ownerName });

  const { data: createdRunner } = yield call(Api.Runners.createRunner, organizationId, workspaceId, runner);
  const runnerDatasetId = createdRunner.datasets.parameter;
  const { data: runnerDataset } = yield call(
    DatasetService.findDatasetById,
    organizationId,
    workspaceId,
    runnerDatasetId
  );
  yield put(addDataset(runnerDataset));

  // When creating a new runner, some dataset parameters can be initialized by the back-end (e.g. runner inheritance,
  // workspace solution default values, ...). If the new runner already has dataset parts, we must store them in redux
  const runnerDatasetParameters = createdRunner.datasets.parameters;
  if (Array.isArray(runnerDatasetParameters) && runnerDatasetParameters.length > 0) {
    for (const datasetPart of runnerDatasetParameters) {
      yield put(addOrUpdateDatasetPart({ runnerDatasetId, datasetPart }));
    }
  }

  const formattedParametersValues = ApiUtils.formatParametersFromApi(createdRunner.parametersValues);
  yield put(addEtlRunner({ runner: { ...createdRunner, parametersValues: formattedParametersValues } }));

  return createdRunner;
}

function* createRunnerDatasetParts(action, createdRunner, datasetPartParameters) {
  const runnerParameterDatasetId = createdRunner.datasets?.parameter;
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;

  const createdDatasetParts = [];
  for (const parameter of datasetPartParameters) {
    const parameterId = parameter.parameterId;
    const fileParameter = parameter.value;
    const file = fileParameter.value;
    const datasetPartToCreate = { name: parameterId, sourceName: file?.name };
    const createdDatasetPart = yield call(
      DatasetService.createDatasetPart,
      organizationId,
      workspaceId,
      runnerParameterDatasetId,
      datasetPartToCreate,
      file
    );

    const runnerId = createdRunner.id;
    addOrUpdateDatasetPart({ datasetId: runnerParameterDatasetId, datasetPart: createdDatasetPart, runnerId });
    createdDatasetParts.push(createdDatasetPart);
  }
}

function* forgeAndCreateDataset(action, createdRunner, parentDatasetId) {
  const ownerName = yield select(getUserName);
  const runnerId = createdRunner.id;

  const dataset = {
    name: createdRunner.name,
    description: createdRunner.description,
    tags: createdRunner.tags,
    additionalData: {
      webapp: { runnerId, sourceType: 'ETL', ownerName, visible: { datasetManager: true, scenarioCreation: true } },
    },
    // TODO: should we set dataset.security to support service accounts? (same as we're doing for runner.security)
  };

  if (parentDatasetId != null) DatasetsUtils.setDatasetOptions(dataset, { parentId: parentDatasetId });
  return yield call(createDataset, {
    dataset,
    shouldSelectDataset: true,
    shouldUpdateReducerStatus: false,
  });
}

export function* createETLRunnerAndDataset(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;

    const datasetPartParameters = [];
    if (action?.runner?.parametersValues != null) {
      const filteredParameterValues = [];
      action.runner.parametersValues.forEach((parameter) => {
        if (ConfigUtils.isDatasetPartVarType(parameter?.varType)) datasetPartParameters.push(parameter);
        else filteredParameterValues.push(parameter);
      });
      action.runner.parametersValues = filteredParameterValues;
    }

    // When creating subdatasets, the runner provided to the createRunner saga contains the id of the **parent dataset**
    // in datasets.bases
    const baseDatasets = action?.runner?.datasetList ?? [];
    const parentDatasetId = baseDatasets?.[0];

    const createdRunner = yield call(createETLRunner, action);
    yield call(createRunnerDatasetParts, action, createdRunner, datasetPartParameters);
    const createdDataset = yield call(forgeAndCreateDataset, action, createdRunner, parentDatasetId);

    // First entry of datasetList must be the "ETL" dataset, to which we add the additional datasets (e.g. the parent
    // dataset when creating subdatasets)
    const runnerUpdatePayload = { datasetList: [createdDataset.id].concat(baseDatasets) };
    const runnerId = createdRunner.id;
    const { data: updatedRunner } = yield call(
      Api.Runners.updateRunner,
      organizationId,
      workspaceId,
      createdRunner.id,
      runnerUpdatePayload
    );
    yield put(
      updateEtlRunner({
        runnerId,
        runner: {
          ...updatedRunner,
          parametersValues: ApiUtils.formatParametersFromApi(updatedRunner.parametersValues),
        },
      })
    );

    yield put({ type: RUNNER_ACTIONS_KEY.START_ETL_RUNNER, organizationId, workspaceId, runnerId });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.runnerNotCreated', "Runner hasn't been created"),
      })
    );
  }

  yield put(setDatasetReducerStatus({ status: DATASET_REDUCER_STATUS.SUCCESS }));
}

function* createETLRunnerAndDatasetSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.CREATE_ETL_RUNNER_AND_DATASET, createETLRunnerAndDataset);
}

export default createETLRunnerAndDatasetSaga;
