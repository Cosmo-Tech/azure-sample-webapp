// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* renameRunner(action) {
  try {
    const { organizationId, workspaceId, runnerId, runTemplateId, runnerName } = action;
    yield call(Api.Runners.updateRunner, organizationId, workspaceId, runnerId, {
      name: runnerName,
      runTemplateId,
    });
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      runner: {
        name: runnerName,
      },
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.rename', "Scenario hasn't been renamed."))
    );
  }
}

function* renameRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_RENAME_RUNNER, renameRunner);
}

export default renameRunnerSaga;
