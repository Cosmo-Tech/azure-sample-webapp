// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ApiUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateSimulationRunner } from '../reducers';

export const asyncUpdateRunner = async (
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
  runnerDataPatch
) => {
  const runnerData = { ...runnerDataPatch };
  if (runnerParameters) runnerData.parametersValues = runnerParameters;
  if (runTemplateId) runnerData.runTemplateId = runTemplateId;
  const runnerDataForRequest = runnerData.parametersValues
    ? { ...runnerData, ...ApiUtils.formatParametersForApi(runnerData.parametersValues) }
    : runnerData;

  const { data: updateData } = await Api.Runners.updateRunner(
    organizationId,
    workspaceId,
    runnerId,
    runnerDataForRequest
  );
  runnerData.updateInfo = updateData.updateInfo;

  return runnerData;
};

export function* callUpdateRunner(action, throwOnError = false) {
  const { organizationId, workspaceId, runnerId, runTemplateId, runnerParameters, runnerDataPatch } = action;
  try {
    yield put(updateSimulationRunner({ runnerId, status: STATUSES.SAVING }));
    const updatedRunner = yield call(
      asyncUpdateRunner,
      organizationId,
      workspaceId,
      runnerId,
      runTemplateId,
      runnerParameters,
      runnerDataPatch
    );
    yield put(updateSimulationRunner({ status: STATUSES.SUCCESS, runnerId, runner: updatedRunner }));
  } catch (error) {
    yield put(updateSimulationRunner({ runnerId, status: STATUSES.ERROR }));

    if (throwOnError) throw error;

    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.update',
          "A problem occurred during scenario update; your new parameters haven't been saved."
        ),
      })
    );
  }
}

function* updateSimulationRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.UPDATE_SIMULATION_RUNNER, callUpdateRunner);
}

export default updateSimulationRunnerSaga;
