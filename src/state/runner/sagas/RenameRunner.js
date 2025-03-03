// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateSimulationRunner } from '../reducers';

export function* renameRunner(action) {
  try {
    const { organizationId, workspaceId, runnerId, runTemplateId, runnerName } = action;
    yield call(Api.Runners.updateRunner, organizationId, workspaceId, runnerId, {
      name: runnerName,
      runTemplateId,
    });
    yield put(
      updateSimulationRunner({
        runnerId,
        runner: {
          name: runnerName,
        },
      })
    );
  } catch (error) {
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.rename', "Scenario hasn't been renamed."),
      })
    );
  }
}

function* renameRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.RENAME_RUNNER, renameRunner);
}

export default renameRunnerSaga;
