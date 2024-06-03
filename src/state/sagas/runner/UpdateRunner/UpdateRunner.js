// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { ApiUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* updateRunner(action, throwOnError = false) {
  const { organizationId, workspaceId, runnerId, runTemplateId, runnerParameters, runnerDataPatch } = action;
  try {
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      status: STATUSES.SAVING,
    });

    const runnerData = { ...runnerDataPatch };
    if (runnerParameters) runnerData.parametersValues = runnerParameters;
    if (runTemplateId) runnerData.runTemplateId = runTemplateId;
    const runnerDataForRequest = runnerData.parametersValues
      ? { ...runnerData, ...ApiUtils.formatParametersForApi(runnerData.parametersValues) }
      : runnerData;

    const { data: updateData } = yield call(
      Api.Runners.updateRunner,
      organizationId,
      workspaceId,
      runnerId,
      runnerDataForRequest
    );
    runnerData.lastUpdate = updateData.lastUpdate;
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      status: STATUSES.SUCCESS,
      runnerId,
      runner: runnerData,
    });
  } catch (error) {
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      status: STATUSES.ERROR,
    });

    if (throwOnError) throw error;

    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.update',
          "A problem occurred during scenario update; your new parameters haven't been saved."
        )
      )
    );
  }
}

function* updateRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_RUNNER, updateRunner);
}

export default updateRunnerSaga;
