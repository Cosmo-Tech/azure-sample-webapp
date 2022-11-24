// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call, select, fork, all, take } from 'redux-saga/effects';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { getAllWorkspaces } from '../../workspace/GetAllWorkspaces/GetAllWorkspaces';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchWorkspaceByIdData } from '../../workspace/FindWorkspaceById/FindWorkspaceByIdData';
import { fetchSolutionByIdData } from '../../solution/FindSolutionById/FindSolutionByIdData';
import { getPowerBIEmbedInfoSaga } from '../../powerbi/GetPowerBIEmbedInfo/GetPowerBIEmbedInfoData';
import { POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { getFirstScenarioMaster } from '../../../../utils/SortScenarioListUtils';
import { parseError } from '../../../../utils/ErrorsUtils';
import { Api } from '../../../../services/config/Api';

const selectSolutionIdFromCurrentWorkspace = (state) => state.workspace.current.data.solution.solutionId;
const selectScenarioList = (state) => state.scenario.list.data;

export function* fetchAllInitialData(action) {
  try {
    const { data: organizationPermissions } = yield call(Api.Organization.getAllPermissions);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_PERMISSIONS_MAPPING,
      organizationPermissions: organizationPermissions,
    });
  } catch (error) {
    console.error(error);
    const errorDetails = parseError(error);
    if (error?.response?.status === 404) {
      errorDetails.detail += '\nPlease make sure you are using at least v2 of Cosmo Tech API';
    }
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.ERROR,
      error: errorDetails,
    });
    return;
  }

  try {
    const workspaceId = action.workspaceId;
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.LOADING,
    });
    yield call(getAllWorkspaces, ORGANIZATION_ID);
    yield call(getAllScenariosData, workspaceId);
    yield call(fetchAllDatasetsData);
    yield call(fetchWorkspaceByIdData, workspaceId);
    const solutionId = yield select(selectSolutionIdFromCurrentWorkspace);
    yield call(fetchSolutionByIdData, workspaceId, solutionId);
    const scenarioList = yield select(selectScenarioList);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      scenario: getFirstScenarioMaster(scenarioList), // Function returns null if list is empty
      status: STATUSES.SUCCESS,
    });
    if (scenarioList.length !== 0) {
      // Start run status polling for running scenarios
      for (let i = 0; i < scenarioList.length; ++i) {
        if (scenarioList[i].state === SCENARIO_RUN_STATE.RUNNING) {
          yield put({
            type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
            workspaceId: workspaceId,
            scenarioId: scenarioList[i].id,
          });
        }
      }
    }

    yield fork(getPowerBIEmbedInfoSaga);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    const errorDetails = parseError(error);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.ERROR,
      error: errorDetails,
    });
  }
}

export function* watchNeededApplicationData() {
  const actions = yield all([
    take(POWER_BI_ACTIONS_KEY.SET_EMBED_INFO),
    take(SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS),
    take(DATASET_ACTIONS_KEY.SET_ALL_DATASETS),
    take(WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE),
    take(SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION),
    take(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO),
  ]);

  const unSuccessfulActions = actions.filter((action) => action.status !== STATUSES.SUCCESS);

  if (unSuccessfulActions.length !== 0) {
    const powerBIError = unSuccessfulActions.find(
      (action) => action.type === POWER_BI_ACTIONS_KEY.SET_EMBED_INFO && action.status === STATUSES.ERROR
    );
    // PowerBI Error should not block the web application
    if (unSuccessfulActions.length === 1 && powerBIError !== undefined) {
      yield put({
        type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
        status: STATUSES.SUCCESS,
      });
    } else {
      yield put({
        type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
        status: STATUSES.ERROR,
        error: {
          title: 'App initialization error',
          status: null,
          detail: 'Something went wrong during the initialization of the webapp',
        },
      });
    }
  } else {
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.SUCCESS,
    });
  }
}

export function* getAllInitialData() {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}
