// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call, select, fork, all, take } from 'redux-saga/effects';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchWorkspaceByIdData } from '../../workspace/FindWorkspaceById/FindWorkspaceByIdData';
import { fetchSolutionByIdData }
  from '../../solution/FindSolutionById/FindSolutionByIdData';
import { RUN_TEMPLATE_ACTIONS_KEY } from '../../../commons/RunTemplateConstants';
import { fetchScenarioByIdForInitialData } from '../../scenario/FindScenarioById';
import { getPowerBIEmbedInfoSaga } from '../../powerbi/GetPowerBIEmbedInfo/GetPowerBIEmbedInfoData';
import { POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';

const selectSolutionIdFromCurrentWorkspace = (state) => state.workspace.current.data.solution.solutionId;
const selectRunTemplatesFromCurrentSolution = (state) => state.solution.current.data.runTemplates;
const selectScenarioList = (state) => state.scenario.list.data;

export function * fetchAllInitialData (action) {
  try {
    const workspaceId = action.workspaceId;
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.LOADING
    });
    // Fetch all scenarios
    yield call(getAllScenariosData, workspaceId);
    yield call(fetchAllDatasetsData);
    yield call(fetchWorkspaceByIdData, workspaceId);
    const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
    yield call(fetchSolutionByIdData, workspaceId, solutionId);
    const scenarioList = yield select(selectScenarioList);
    if (scenarioList.length !== 0) {
      yield call(fetchScenarioByIdForInitialData, workspaceId, scenarioList[0].id);
      // Start state polling for running scenarios
      for (let i = 0; i < scenarioList.length; ++i) {
        if (scenarioList[i].state === SCENARIO_RUN_STATE.RUNNING) {
          yield put({
            type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
            workspaceId: workspaceId,
            scenarioId: scenarioList[i].id
          });
        }
      }
    } else {
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
        scenario: null,
        status: STATUSES.SUCCESS
      });
    }

    const runTemplates = yield select(selectRunTemplatesFromCurrentSolution);
    yield fork(getPowerBIEmbedInfoSaga);
    yield put({
      type: RUN_TEMPLATE_ACTIONS_KEY.SET_RUN_TEMPLATE_LIST,
      list: runTemplates,
      status: STATUSES.SUCCESS
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.ERROR
    });
  }
}

export function * watchNeededApplicationData () {
  const actions = yield all([
    take(POWER_BI_ACTIONS_KEY.SET_EMBED_INFO),
    take(SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS),
    take(DATASET_ACTIONS_KEY.SET_ALL_DATASETS),
    take(WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE),
    take(SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION),
    take(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO),
    take(RUN_TEMPLATE_ACTIONS_KEY.SET_RUN_TEMPLATE_LIST)
  ]);

  const unSuccessfulActions = actions.filter(action => action.status !== STATUSES.SUCCESS);

  if (unSuccessfulActions.length !== 0) {
    const powerBIError = unSuccessfulActions.find(
      action => action.type === POWER_BI_ACTIONS_KEY.SET_EMBED_INFO &&
        action.status === STATUSES.ERROR);
    // PowerBI Error should not block the web application
    if (unSuccessfulActions.length === 1 && powerBIError !== undefined) {
      yield put({
        type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
        status: STATUSES.SUCCESS
      });
    } else {
      yield put({
        type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
        status: STATUSES.ERROR
      });
    }
  } else {
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.SUCCESS
    });
  }
}

export function * getAllInitialData () {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}
