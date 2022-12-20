// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, call, fork, select, takeEvery, put } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchSolutionByIdData } from '../../solution/FindSolutionById/FindSolutionByIdData';
import { getPowerBIEmbedInfoSaga } from '../../powerbi/GetPowerBIEmbedInfo/GetPowerBIEmbedInfoData';
import { getFirstScenarioMaster } from '../../../../utils/SortScenarioListUtils';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { t } from 'i18next';

const getOrganizationId = (state) => state?.organization?.current?.data?.id;
const selectSolutionIdFromCurrentWorkspace = (state) => state.workspace.current.data.solution.solutionId;
const selectScenarioList = (state) => state.scenario.list.data;
const getWorkspaces = (state) => state?.workspace?.list?.data;

export function* selectWorkspace(action) {
  const selectedWorkspaceId = action.workspaceId;
  yield put({
    type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
    status: STATUSES.LOADING,
  });

  const organizationId = yield select(getOrganizationId);
  const workspaces = yield select(getWorkspaces);
  const selectedWorkspace = workspaces && workspaces.find((workspace) => workspace.id === selectedWorkspaceId);

  if (selectedWorkspace === undefined) {
    yield put(
      dispatchSetApplicationErrorMessage(
        {
          title: t('genericcomponent.workspaceselector.error.title', 'App initialization error'),
          status: null,
          detail: t(
            'genericcomponent.workspaceselector.error.message',
            'Could not find workspace with id {{workspaceId}} in workspaces list',
            { workspaceId: selectedWorkspaceId }
          ),
        },
        t(
          'genericcomponent.workspaceselector.error.comment',
          'You have been redirected to the list of available workspaces'
        )
      )
    );
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE,
      status: STATUSES.ERROR,
      workspace: null,
    });
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.SUCCESS,
    });
    return;
  }

  yield put({
    type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE,
    status: STATUSES.SUCCESS,
    workspace: selectedWorkspace,
  });

  yield call(getAllScenariosData, organizationId, selectedWorkspaceId);
  const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
  yield call(fetchSolutionByIdData, organizationId, selectedWorkspaceId, solutionId);
  const scenarioList = yield select(selectScenarioList);
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    scenario: getFirstScenarioMaster(scenarioList), // Function returns null if list is empty
    status: STATUSES.SUCCESS,
  });

  // Start run status polling for running scenarios
  const runningScenarios = scenarioList.filter((scenario) => scenario.state === SCENARIO_RUN_STATE.RUNNING);
  yield all(
    runningScenarios.map((scenario) =>
      put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        organizationId: organizationId,
        workspaceId: selectedWorkspaceId,
        scenarioId: scenario.id,
      })
    )
  );

  yield fork(getPowerBIEmbedInfoSaga);

  yield put({
    type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
    status: STATUSES.SUCCESS,
  });
}

function* watchSelectWorkspace() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE, selectWorkspace);
}

export default watchSelectWorkspace;
