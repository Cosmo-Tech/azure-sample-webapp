// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { DATASET_PERMISSIONS_MAPPING } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { loadDatasets, selectDataset, setAllDatasets } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const keepOnlyReadableDatasets = (datasets) =>
  datasets.filter(
    (dataset) =>
      dataset.security?.currentUserPermissions == null ||
      dataset.security.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.READ)
  );

export function* fetchAllDatasetsData(organizationId, workspaceId) {
  try {
    yield put(loadDatasets());
    const userEmail = yield select(getUserEmail);
    const page = 0;
    const pageSize = 99999;
    const { data } = yield call(Api.Datasets.listDatasets, organizationId, workspaceId, page, pageSize);

    data.forEach((dataset) =>
      DatasetsUtils.patchDatasetWithCurrentUserPermissions(dataset, userEmail, DATASET_PERMISSIONS_MAPPING)
    );
    const datasets = keepOnlyReadableDatasets(data);

    yield put(setAllDatasets({ list: datasets, status: STATUSES.SUCCESS }));

    if (datasets?.length > 0) {
      yield put(selectDataset({ selectedDatasetId: null }));
      // FIXME: should we update all dataset status when opening a workspace? Or wait for datasets to be selected?
      // If necessary, add a new saga and call it after all datasets and runners are stored in redux
      // const datasetsToUpdate = data.filter(
      //   (dataset) =>
      //     DatasetsUtils.isVisibleInDatasetManager(dataset) && dataset.ingestionStatus === RUNNER_RUN_STATE.RUNNING
      // );
      //
      // for (const dataset of datasetsToUpdate) {
      //   yield put(
      //   { type: DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING, datasetId: dataset.id, organizationId }
      // );
      // }
    }
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.updatePermissions', 'Unexpected error while loading the datasets.'),
      })
    );
  }
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
