// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, select } from 'redux-saga/effects';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../../runner/constants';
import { DATASET_ACTIONS_KEY } from '../constants';

const getETLRunners = (state) => state.runner?.etlRunners?.list?.data;

export function* refreshDataset(action) {
  const dataset = action.dataset;

  try {
    const { organizationId, workspaceId } = dataset;
    const runners = yield select(getETLRunners);
    const runnerId = DatasetsUtils.getDatasetOption(dataset, 'runnerId');
    const runner = runners?.find((item) => item.id === runnerId);
    if (runner == null) throw new Error(`Cannot find ETL runner with id "${runnerId}"`);

    yield put({ type: RUNNER_ACTIONS_KEY.START_ETL_RUNNER, organizationId, workspaceId, runnerId });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.datasetRefreshError',
          'A problem occurred during refresh of the dataset {{datasetId}}',
          { datasetId: dataset?.id }
        ),
      })
    );
  }
}

function* refreshDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.REFRESH_DATASET, refreshDataset);
}

export default refreshDatasetSaga;
