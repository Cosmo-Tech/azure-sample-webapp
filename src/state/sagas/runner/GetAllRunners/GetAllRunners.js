// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';

const getDatasets = (state) => state?.dataset.list?.data;
const getCurrentWorkspace = (state) => state?.workspace?.current?.data;

export function* getAllRunners(organizationId) {
  const datasets = yield select(getDatasets);
  const selectedWorkspace = yield select(getCurrentWorkspace);

  try {
    const { data: runnersList } = yield call(Api.Runners.listRunners, organizationId, selectedWorkspace.id);
    const etlAssociatedRunnersIds = datasets
      .filter(
        (dataset) =>
          dataset.main === true &&
          dataset.sourceType === 'ETL' &&
          selectedWorkspace.linkedDatasetIdList?.includes(dataset.id)
      )
      .map((dataset) => dataset.source.name);

    const etlAssociatedRunners = runnersList.filter((runner) => etlAssociatedRunnersIds.includes(runner.id));
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_ETL_RUNNERS,
      data: etlAssociatedRunners,
    });
  } catch (error) {
    console.warn('A problem occurred while fetching runners data');
    console.error(error);
  }
}

function* getAllRunnersData() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_GET_RUNNERS, getAllRunners);
}
export default getAllRunnersData;
