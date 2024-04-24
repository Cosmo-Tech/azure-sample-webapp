// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../../utils/DatasetsUtils';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

// TODO: replace by data from redux when dataset roles-permissions mapping is added in back-end /permissions endpoint
const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read', 'read_security'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};

const getUserName = (state) => state.auth.userName;
const getUserEmail = (state) => state.auth.userEmail;
const getWorkspaceId = (state) => state.workspace.current?.data?.id;

export function* createDataset(action) {
  const dataset = action.dataset;
  const organizationId = action.organizationId;
  const ownerName = yield select(getUserName);
  const userEmail = yield select(getUserEmail);
  const workspaceId = yield select(getWorkspaceId);

  try {
    const datasetWithAuthor = {
      ...dataset,
      ownerName,
      security: { default: 'none', accessControlList: [{ id: userEmail, role: 'admin' }] },
    };

    const { data } = yield call(Api.Datasets.createDataset, organizationId, datasetWithAuthor);
    DatasetsUtils.patchDatasetWithCurrentUserPermissions(data, userEmail, DATASET_PERMISSIONS_MAPPING);

    try {
      yield call(Api.Datasets.linkWorkspace, organizationId, data.id, workspaceId);
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t(
            'commoncomponents.banner.datasetNotLinked',
            'An error occurred when trying to link the created dataset ({{datasetId}}) to the workspace.' +
              'Please try to create a new dataset and contact your administrator if the problem persists.',
            { datasetId: data.id }
          )
        )
      );
    }

    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...data,
      ownerName,
      ingestionStatus: dataset.sourceType !== 'None' ? INGESTION_STATUS.PENDING : INGESTION_STATUS.NONE,
    });

    yield put({
      type: WORKSPACE_ACTIONS_KEY.LINK_TO_DATASET,
      datasetId: data.id,
      workspaceId,
    });

    yield put({
      type: DATASET_ACTIONS_KEY.SELECT_DATASET,
      selectedDatasetId: data.id,
    });

    if (!['None', 'File', 'ETL'].includes(dataset.sourceType)) {
      yield put({
        type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET,
        organizationId,
        datasetId: data.id,
      });
    } else if (dataset.sourceType === 'File') {
      const response = yield call(DatasetsUtils.uploadZipWithFetchApi, organizationId, data.id, dataset.file.file);
      if (response?.ok) {
        yield put({
          type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
          datasetId: data.id,
          organizationId,
        });
      } else {
        let error = null;
        if (response?.status === 400) {
          error = yield new Response(response.body).json();
          console.error(error);
        }

        yield put(
          dispatchSetApplicationErrorMessage(
            error,
            t(
              'commoncomponents.banner.datasetCreationFileUploadFailed',
              'The file upload for dataset creation has failed'
            )
          )
        );

        yield put({
          type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
          datasetId: data.id,
          datasetData: { ingestionStatus: INGESTION_STATUS.ERROR },
        });
      }
    } else if (dataset.sourceType === 'ETL') return data.id;
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotCreated', "Dataset hasn't been created")
      )
    );
  }
}

function* createDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.CREATE_DATASET, createDataset);
}

export default createDatasetSaga;
