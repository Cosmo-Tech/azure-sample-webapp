// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { RUNNERS_PAGE_COUNT } from '../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { ApiUtils, RunnersUtils, SolutionsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import {
  addRun,
  setAllEtlRunners,
  setAllSimulationRunners,
  setReducerStatus,
  updateSimulationRunner,
} from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getRunnersPermissionsMapping = (state) => state.application.permissionsMapping.runner;
const getSolutionParameters = (state) => state.solution?.current?.data?.parameters;
const getSolutionRunTemplates = (state) => state.solution?.current?.data?.runTemplates;

const keepOnlyReadableRunners = (runners) =>
  runners.filter((runner) => runner.security.currentUserPermissions.includes(ACL_PERMISSIONS.RUNNER.READ));

function* getRunnerStatus(organizationId, workspaceId, runnerId, lastRunId) {
  try {
    const response = yield call(Api.RunnerRuns.getRunStatus, organizationId, workspaceId, runnerId, lastRunId);
    yield put(updateSimulationRunner({ runnerId, runner: { state: response.data.state } }));
    yield put(addRun({ data: response.data }));
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'views.scenario.scenarioRunStatusQueryError.comment',
          'Could not get status of scenario run with id "{{id}}".',
          {
            id: lastRunId,
          }
        ),
      })
    );
    yield put(updateSimulationRunner({ runnerId, runner: { state: RUNNER_RUN_STATE.UNKNOWN } }));
  }
}
export function* getAllRunners(organizationId, workspaceId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const runTemplates = yield select(getSolutionRunTemplates);
  const runnersPermissionsMapping = yield select(getRunnersPermissionsMapping);
  const solutionParameters = yield select(getSolutionParameters);
  yield put(setReducerStatus({ status: STATUSES.LOADING }));
  const { data } = yield call(Api.Runners.listRunners, organizationId, workspaceId, 0, RUNNERS_PAGE_COUNT);
  data.forEach((runner) =>
    RunnersUtils.patchRunnerWithCurrentUserPermissions(runner, userEmail, userId, runnersPermissionsMapping)
  );
  const readableRunners = keepOnlyReadableRunners(data);

  readableRunners.forEach(
    (runner) => (runner.parametersValues = ApiUtils.formatParametersFromApi(runner.parametersValues))
  );

  readableRunners.forEach((runner) =>
    RunnersUtils.patchRunnerParameterValues(solutionParameters, runner.parametersValues)
  );
  const simulationRunnersRunTemplatesIds = [];
  const eltRunnersRunTemplatesIds = [];
  runTemplates?.forEach((rt) => {
    if (!SolutionsUtils.isDataSource(rt) && !SolutionsUtils.isSubDataSource(rt))
      simulationRunnersRunTemplatesIds.push(rt.id);
    else eltRunnersRunTemplatesIds.push(rt.id);
  });
  const simulationRunners = readableRunners.filter((runner) =>
    simulationRunnersRunTemplatesIds?.includes(runner.runTemplateId)
  );
  simulationRunners.forEach((runner) => {
    if (RunnersUtils.getLastRunId(runner) == null) runner.state = RUNNER_RUN_STATE.CREATED;
  });
  yield put(
    setAllSimulationRunners({
      list: simulationRunners,
      status: STATUSES.SUCCESS,
    })
  );
  yield all(
    simulationRunners
      .filter((runner) => RunnersUtils.getLastRunId(runner) != null)
      .map((runner) => {
        return call(getRunnerStatus, organizationId, workspaceId, runner.id, RunnersUtils.getLastRunId(runner));
      })
  );
  const etlRunners = readableRunners.filter((runner) => eltRunnersRunTemplatesIds?.includes(runner.runTemplateId));
  yield put(
    setAllEtlRunners({
      list: etlRunners,
    })
  );
}

function* getAllSimulationRunnersSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.LIST_ALL_RUNNERS, getAllRunners);
}

export default getAllSimulationRunnersSaga;
