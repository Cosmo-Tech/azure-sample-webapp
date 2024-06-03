// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { RUNNERS_PAGE_COUNT } from '../../../../services/config/FunctionalConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { ApiUtils, RunnersUtils, SolutionsUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getRunnersPermissionsMapping = (state) => state.application.permissionsMapping.runner;
const getSolutionParameters = (state) => state.solution?.current?.data?.parameters;
const getSolutionRunTemplates = (state) => state.solution?.current?.data?.runTemplates;

const keepOnlyReadableRunners = (runners) =>
  runners.filter((runner) => runner.security.currentUserPermissions.includes(ACL_PERMISSIONS.RUNNER.READ));

function* getRunnerStatus(organizationId, workspaceId, runnerId, lastRunId) {
  const response = yield call(Api.RunnerRuns.getRunStatus, organizationId, workspaceId, runnerId, lastRunId);
  yield put({ type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER, data: { runnerState: response.data.state, runnerId } });
}
export function* getAllSimulationRunners(organizationId, workspaceId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const runTemplates = yield select(getSolutionRunTemplates);
  const runnersPermissionsMapping = yield select(getRunnersPermissionsMapping);
  const solutionParameters = yield select(getSolutionParameters);
  const { data } = yield call(Api.Runners.listRunners, organizationId, workspaceId, 0, RUNNERS_PAGE_COUNT);
  const simulationRunTemplatesIds = runTemplates
    ?.filter((rt) => !SolutionsUtils.isDataSource(rt) && !SolutionsUtils.isSubDataSource(rt))
    .map((rt) => rt.id);
  const simulationRunners = data.filter((runner) => simulationRunTemplatesIds?.includes(runner.runTemplateId));
  simulationRunners.forEach((runner) =>
    RunnersUtils.patchRunnerParameterValues(solutionParameters, runner.parametersValues)
  );
  simulationRunners.forEach(
    (runner) => (runner.parametersValues = ApiUtils.formatParametersFromApi(runner.parametersValues))
  );
  simulationRunners.forEach((runner) =>
    RunnersUtils.patchRunnerWithCurrentUserPermissions(runner, userEmail, userId, runnersPermissionsMapping)
  );
  simulationRunners.forEach((runner) => {
    if (runner.lastRunId == null) runner.state = RUNNER_RUN_STATE.CREATED;
  });
  const readableRunners = keepOnlyReadableRunners(simulationRunners);
  yield put({
    type: RUNNER_ACTIONS_KEY.SET_ALL_SIMULATION_RUNNERS,
    list: readableRunners,
    status: STATUSES.SUCCESS,
  });
  yield all(
    readableRunners
      .filter((runner) => runner.lastRunId)
      .map((runner) => {
        return call(getRunnerStatus, organizationId, workspaceId, runner.id, runner.lastRunId);
      })
  );
}

function* getAllSimulationRunnersSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_LIST_ALL_RUNNERS, getAllSimulationRunners);
}

export default getAllSimulationRunnersSaga;
