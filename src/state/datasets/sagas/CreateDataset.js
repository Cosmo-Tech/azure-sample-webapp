// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { INGESTION_STATUS } from '../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../utils/DatasetsUtils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { linkToDataset } from '../../workspaces/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { addDataset, selectDataset, updateDataset } from '../reducers';

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
        setApplicationErrorMessage({
          error,
          errorMessage: t(
            'commoncomponents.banner.datasetNotLinked',
            'An error occurred when trying to link the created dataset ({{datasetId}}) to the workspace.' +
              'Please try to create a new dataset and contact your administrator if the problem persists.',
            {
              datasetId: data.id,
            }
          ),
        })
      );
    }

    yield put(
      addDataset({
        ...data,
        ownerName,
        ingestionStatus: dataset.sourceType !== 'None' ? INGESTION_STATUS.PENDING : INGESTION_STATUS.NONE,
      })
    );

    yield put(
      linkToDataset({
        datasetId: data.id,
        workspaceId,
      })
    );

    yield put(
      selectDataset({
        selectedDatasetId: data.id,
      })
    );

    if (!['None', 'File', 'ETL'].includes(dataset.sourceType)) {
      yield put({
        type: DATASET_ACTIONS_KEY.REFRESH_DATASET,
        organizationId,
        datasetId: data.id,
      });
    } else if (dataset.sourceType === 'File') {
      const response = yield call(DatasetsUtils.uploadZipWithFetchApi, organizationId, data.id, dataset.file.file);
      if (response?.ok) {
        yield put({
          type: DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING,
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
          setApplicationErrorMessage({
            error,
            errorMessage: t(
              'commoncomponents.banner.datasetCreationFileUploadFailed',
              'The file upload for dataset creation has failed'
            ),
          })
        );

        yield put(
          updateDataset({
            datasetId: data.id,
            datasetData: { ingestionStatus: INGESTION_STATUS.ERROR },
          })
        );
      }
    } else if (dataset.sourceType === 'ETL') return data.id;
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.datasetNotCreated', "Dataset hasn't been created"),
      })
    );
  }
}

function* createDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.CREATE_DATASET, createDataset);
}

export default createDatasetSaga;
