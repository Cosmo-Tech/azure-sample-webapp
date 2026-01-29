// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import DatasetService from '../../../services/dataset/DatasetService';
import { ScenarioParametersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../../datasets/constants';
import { addOrUpdateDatasetPart, deleteDatasetPart } from '../../datasets/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateEtlRunner } from '../reducers';
import { asyncUpdateRunner } from './UpdateSimulationRunner';

const getETLRunners = (state) => state.runner?.etlRunners?.list?.data;
const getSolution = (state) => state.solution?.current?.data;

export function* updateEtlRunnerData(action) {
  try {
    const runners = yield select(getETLRunners);
    const solution = yield select(getSolution);

    const runnerId = action.runnerId;
    const runner = runners?.find((item) => item.id === runnerId);
    if (runner === undefined) {
      const errorMessage = `Couldn't retrieve runner with id "${runnerId}"`;
      yield put(setApplicationErrorMessage({ error: { title: 'Dataset update failed' }, errorMessage }));
      return;
    }

    const runnerPatch = action.runnerPatch;
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const dataset = action.dataset;

    const runnerParameterDatasetId = runner.datasets?.parameter;
    const parameterValueDict = {};
    runnerPatch.parametersValues.forEach((parameterValue) => {
      parameterValueDict[parameterValue.parameterId] = parameterValue.value;
    });

    const parametersForUpdateRequest = ScenarioParametersUtils.buildParametersForUpdateRequest(
      solution,
      parameterValueDict,
      null,
      runner,
      null
    );

    const updatedRunner = yield call(
      asyncUpdateRunner,
      organizationId,
      workspaceId,
      runnerId,
      runner?.runTemplateId,
      parametersForUpdateRequest.nonDatasetParts,
      runnerPatch
    );
    yield put(updateEtlRunner({ runnerId, runner: updatedRunner }));

    for (const parameter of parametersForUpdateRequest.fileDatasetParts) {
      const createdDatasetPart = yield call(
        DatasetService.createDatasetPart,
        organizationId,
        workspaceId,
        runnerParameterDatasetId,
        parameter.value.part,
        parameter.value.file
      );
      yield put(
        addOrUpdateDatasetPart({ datasetId: runnerParameterDatasetId, datasetPart: createdDatasetPart, runnerId })
      );
    }

    for (const datasetPartId of parametersForUpdateRequest.idsOfDatasetPartsToDelete) {
      yield call(
        DatasetService.deleteDatasetPart,
        organizationId,
        workspaceId,
        runnerParameterDatasetId,
        datasetPartId
      );
      yield put(deleteDatasetPart({ datasetId: runnerParameterDatasetId, datasetPartId, runnerId }));
    }

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
