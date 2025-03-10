// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNERS_PAGE_COUNT } from '../../../../services/config/FunctionalConstants';
import { ApiUtils } from '../../../../utils';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getDatasets = (state) => state?.dataset.list?.data;
const getCurrentWorkspace = (state) => state?.workspace?.current?.data;

export function* getAllRunners(organizationId) {
  const datasets = yield select(getDatasets);
  const selectedWorkspace = yield select(getCurrentWorkspace);

  try {
    const { data: runnersList } = yield call(
      Api.Runners.listRunners,
      organizationId,
      selectedWorkspace?.id,
      0,
      RUNNERS_PAGE_COUNT
    );
    const etlAssociatedRunnersIds = datasets
      .filter(
        (dataset) =>
          dataset.main === true &&
          dataset.sourceType === 'ETL' &&
          selectedWorkspace?.linkedDatasetIdList?.includes(dataset.id)
      )
      .map((dataset) => dataset.source?.name);

    const etlAssociatedRunners = runnersList.filter((runner) => etlAssociatedRunnersIds.includes(runner.id));
    etlAssociatedRunners.forEach((runner) => {
      runner.parametersValues = ApiUtils.formatParametersFromApi(runner.parametersValues);
    });
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_ETL_RUNNERS,
      data: etlAssociatedRunners,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.getAllRunnersError', 'Unexpected error while loading runners')
      )
    );
  }
}

function* getAllRunnersData() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_GET_RUNNERS, getAllRunners);
}
export default getAllRunnersData;
