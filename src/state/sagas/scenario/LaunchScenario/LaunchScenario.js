// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();
const getScenarios = (state) => state.scenario?.list?.data;

export function* launchScenario(action) {
  try {
    appInsights.trackScenarioLaunch();
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const scenarioId = action.scenarioId;
    const runStartTime = new Date().getTime();

    const scenarios = yield select(getScenarios);
    const scenario = scenarios?.find((item) => item.id === scenarioId);
    if (scenario === undefined) console.warn(`Couldn't retrieve scenario with id "${scenarioId}"`);
    const previousScenarioState = scenario?.scenarioState;

    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING },
    });

    // Launch scenario if parameters update succeeded
    let response;
    try {
      response = yield call(Api.ScenarioRuns.runScenario, organizationId, workspaceId, scenarioId);
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t('commoncomponents.banner.run', 'A problem occurred when starting the scenario run.')
        )
      );
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
        status: STATUSES.ERROR,
        scenario: { state: previousScenarioState }, // Do not force scenario state to "Failed", restore previous state
      });
      return;
    }

    const newLastRun = {
      csmSimulationRun: response?.data?.csmSimulationRun,
      scenarioRunId: response?.data?.id,
      workflowId: response?.data?.workflowId,
      workflowName: response?.data?.workflowName,
    };

    yield put({
      type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
      data: { scenarioState: SCENARIO_RUN_STATE.RUNNING, scenarioId, lastRun: newLastRun },
    });

    // Start backend polling to update the scenario status
    yield put({
      type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
      organizationId,
      workspaceId,
      scenarioId,
      startTime: runStartTime,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.run', 'A problem occurred during the scenario run.')
      )
    );
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.ERROR,
      scenario: { state: SCENARIO_RUN_STATE.FAILED },
    });
  }
}

function* launchScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO, launchScenario);
}

export default launchScenarioSaga;
