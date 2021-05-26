// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call, select } from 'redux-saga/effects';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { STATUSES } from '../../../commons/Constants';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchScenarioTreeData } from '../../scenario/GetScenariosTree/GetScenariosTreeData';
import { fetchWorkspaceByIdData } from '../../workspace/FindWorkspaceById/FindWorkspaceByIdData';
import { fetchSolutionByIdData }
  from '../../solution/FindSolutionById/FindSolutionByIdData';
import { RUN_TEMPLATE_ACTIONS_KEY } from '../../../commons/RunTemplateConstants';
import { fetchScenarioByIdForInitialData } from '../../scenario/FindScenarioById';

// Selectors
const selectSolutionIdFromCurrentWorkspace = (state) => state.workspace.current.data.solution.solutionId;
const selectRunTemplatesFromCurrentSolution = (state) => state.solution.current.data.runTemplates;
const selectFirstScenarioFromScenarioTree = (state) => state.scenario.tree.data;

// generators function
export function * fetchAllInitialData (action) {
  try {
    const workspaceId = action.workspaceId;
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.LOADING });
    // Fetch all scenarios
    yield call(getAllScenariosData, workspaceId);
    yield call(fetchScenarioTreeData, workspaceId);
    yield call(fetchAllDatasetsData);
    yield call(fetchWorkspaceByIdData, workspaceId);
    const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
    yield call(fetchSolutionByIdData, workspaceId, solutionId);
    const scenarioTree = yield select(selectFirstScenarioFromScenarioTree);
    if (scenarioTree.length !== 0) {
      yield call(fetchScenarioByIdForInitialData, workspaceId, scenarioTree[0].id);
    }
    const runTemplates = yield select(selectRunTemplatesFromCurrentSolution);
    yield put({ type: RUN_TEMPLATE_ACTIONS_KEY.SET_RUN_TEMPLATE_LIST, data: { list: runTemplates, status: STATUSES.SUCCESS } });
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.SUCCESS });
  } catch (error) {
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.ERROR });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_INITIAL_DATA and binds fetchAllInitialData saga to it
function * getAllInitialData () {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}

export default getAllInitialData;
