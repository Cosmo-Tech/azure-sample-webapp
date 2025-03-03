// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { all, call, select, takeEvery, put } from 'redux-saga/effects';
import { ResourceUtils } from '@cosmotech/core';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { WorkspaceSchema } from '../../../services/config/WorkspaceSchema';
import { ConfigUtils, RunnersUtils, WorkspacesUtils } from '../../../utils';
import { setApplicationErrorMessage, setApplicationStatus } from '../../app/reducers';
import { dispatchGetPowerBIEmbedInfo } from '../../powerBi/dispatchers';
import { clearEmbedInfo } from '../../powerBi/reducers';
import { RUNNER_ACTIONS_KEY } from '../../runner/constants';
import { setCurrentSimulationRunner } from '../../runner/reducers';
import { getAllRunners } from '../../runner/sagas/GetAllRunners';
import { fetchSolutionByIdData } from '../../solutions/sagas/FindSolutionByIdData';
import { WORKSPACE_ACTIONS_KEY } from '../constants';
import { setCurrentWorkspace } from '../reducers';

const getOrganizationId = (state) => state?.organization?.current?.data?.id;
const selectSolutionIdFromCurrentWorkspace = (state) => state.workspace.current.data.solution.solutionId;
const selectRunnersList = (state) => state.runner.simulationRunners.list.data;
const getWorkspaces = (state) => state?.workspace?.list?.data;

export function* selectWorkspace(action) {
  const selectedWorkspaceId = action.workspaceId;
  yield put(
    setApplicationStatus({
      status: STATUSES.LOADING,
    })
  );

  const organizationId = yield select(getOrganizationId);
  const workspaces = yield select(getWorkspaces);
  const selectedWorkspace = workspaces && workspaces.find((workspace) => workspace.id === selectedWorkspaceId);

  if (selectedWorkspace === undefined) {
    yield put(
      setApplicationErrorMessage({
        error: {
          title: t('genericcomponent.workspaceselector.error.title', 'App initialization error'),
          status: null,
          detail: t(
            'genericcomponent.workspaceselector.error.message',
            'Could not find workspace with id {{workspaceId}} in workspaces list',
            { workspaceId: selectedWorkspaceId }
          ),
        },
        errorMessage: t(
          'genericcomponent.workspaceselector.error.comment',
          'You have been redirected to the list of available workspaces'
        ),
      })
    );
    yield put(
      setCurrentWorkspace({
        status: STATUSES.ERROR,
        workspace: null,
      })
    );
    yield put(
      setApplicationStatus({
        status: STATUSES.SUCCESS,
      })
    );
    return;
  }

  yield put(
    setCurrentWorkspace({
      status: STATUSES.SUCCESS,
      workspace: selectedWorkspace,
    })
  );

  ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, selectedWorkspace);
  WorkspacesUtils.checkDatasetManagerConfiguration(selectedWorkspace);
  WorkspacesUtils.checkConfigurationPitfalls(selectedWorkspace);

  yield put({
    type: RUNNER_ACTIONS_KEY.STOP_ALL_RUNNERS_STATUS_POLLING,
  });

  yield put(clearEmbedInfo());

  const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
  yield call(fetchSolutionByIdData, organizationId, solutionId);

  yield call(getAllRunners, organizationId, selectedWorkspaceId);
  const simulationRunnersList = yield select(selectRunnersList);
  yield put(
    setCurrentSimulationRunner({
      runnerId: ResourceUtils.getFirstRootResource(simulationRunnersList)?.id, // Function returns null if list is empty
      status: STATUSES.SUCCESS,
    })
  );

  // Start run status polling for running scenarios
  const runningRunners = simulationRunnersList.filter((runner) => runner.state === RUNNER_RUN_STATE.RUNNING);
  yield all(
    runningRunners.map((runner) =>
      put({
        type: RUNNER_ACTIONS_KEY.START_RUNNER_STATUS_POLLING,
        organizationId,
        workspaceId: selectedWorkspaceId,
        runnerId: runner.id,
        lastRunId: RunnersUtils.getLastRunId(runner),
      })
    )
  );

  yield put(dispatchGetPowerBIEmbedInfo());

  yield put(
    setApplicationStatus({
      status: STATUSES.SUCCESS,
    })
  );
}

function* watchSelectWorkspace() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE, selectWorkspace);
}

export default watchSelectWorkspace;
