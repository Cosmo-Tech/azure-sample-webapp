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
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;
  const runnerId = action.runnerId;
  const runTemplateId = action.runTemplateId;
  const runnerParameters = action.runnerParameters;

  try {
    // Update scenario parameters
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      status: STATUSES.SAVING,
    });
    const runnerData = { runTemplateId, ...ApiUtils.formatParametersForApi(runnerParameters) };
    const { data: updateData } = yield call(
      Api.Runners.updateRunner,
      organizationId,
      workspaceId,
      runnerId,
      runnerData
    );
    updateData.parametersValues = ApiUtils.formatParametersFromApi(updateData.parametersValues);
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      status: STATUSES.SUCCESS,
      runnerId,
      runner: { parametersValues: updateData.parametersValues, lastUpdate: updateData.lastUpdate },
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
