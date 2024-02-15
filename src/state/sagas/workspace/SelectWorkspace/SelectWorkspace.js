// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { all, call, select, takeEvery, put } from 'redux-saga/effects';
import { ResourceUtils } from '@cosmotech/core';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { WorkspaceSchema } from '../../../../services/config/WorkspaceSchema';
import { ConfigUtils, WorkspacesUtils } from '../../../../utils';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { STATUSES } from '../../../commons/Constants';
import { POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { dispatchGetPowerBIEmbedInfo } from '../../../dispatchers/powerbi/PowerBIDispatcher';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchSolutionByIdData } from '../../solution/FindSolutionById/FindSolutionByIdData';

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

  ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, selectedWorkspace);
  WorkspacesUtils.checkDatasetManagerConfiguration(selectedWorkspace);

  yield put({
    type: SCENARIO_ACTIONS_KEY.STOP_ALL_SCENARIO_STATUS_POLLINGS,
  });

  yield put({ type: POWER_BI_ACTIONS_KEY.CLEAR_EMBED_INFO });

  const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
  yield call(fetchSolutionByIdData, organizationId, solutionId);

  yield call(getAllScenariosData, organizationId, selectedWorkspaceId);
  const scenarioList = yield select(selectScenarioList);

  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    scenario: ResourceUtils.getFirstRootResource(scenarioList), // Function returns null if list is empty
    status: STATUSES.SUCCESS,
  });

  // Start run status polling for running scenarios
  const runningScenarios = scenarioList.filter((scenario) =>
    [SCENARIO_RUN_STATE.RUNNING, SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS].includes(scenario.state)
  );
  yield all(
    runningScenarios.map((scenario) =>
      put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        organizationId,
        workspaceId: selectedWorkspaceId,
        scenarioId: scenario.id,
      })
    )
  );

  yield put(dispatchGetPowerBIEmbedInfo());

  yield put({
    type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
    status: STATUSES.SUCCESS,
  });
}

function* watchSelectWorkspace() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE, selectWorkspace);
}

export default watchSelectWorkspace;
