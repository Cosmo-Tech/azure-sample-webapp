// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { DATASET_PERMISSIONS_MAPPING } from '../../../services/config/ApiConstants';
import DatasetService from '../../../services/dataset/DatasetService';
import { DatasetsUtils } from '../../../utils/DatasetsUtils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { addDataset, selectDataset } from '../reducers';

const getUserName = (state) => state.auth.userName;
const getUserEmail = (state) => state.auth.userEmail;
const getWorkspaceId = (state) => state.workspace.current?.data?.id;
const getOrganizationId = (state) => state.organization.current?.data?.id;

export function* postEmptyDataset(dataset) {
  const ownerName = yield select(getUserName);
  const organizationId = yield select(getOrganizationId);
  const workspaceId = yield select(getWorkspaceId);
  DatasetsUtils.setDatasetOptions({ ownerName });
  return yield call(DatasetService.createEmptyDataset, organizationId, workspaceId, dataset);
}

export function* postDatasetPart(datasetId, datasetPart, file) {
  const organizationId = yield select(getOrganizationId);
  const workspaceId = yield select(getWorkspaceId);
  return yield call(DatasetService.createDatasetPart, organizationId, workspaceId, datasetId, datasetPart, file);
}

export function* postDatasetParts(dataset, files = []) {
  if (files.length !== dataset.parts.length)
    throw new Error('The number of files does not match the number of expected dataset parts');

  const calls = dataset.parts.map((part, index) => call(postDatasetPart, dataset.id, part, files[index]));
  return yield all(calls);
}

export function* postDatasetAndDatasetParts(dataset, files) {
  if (!dataset.parts) dataset.parts = [];
  const emptyDataset = yield postEmptyDataset(dataset);
  const createdDataset = { ...emptyDataset, ...dataset };
  const createdParts = yield postDatasetParts(createdDataset, files);

  createdDataset.parts = createdDataset.parts
    .map((part) => createdParts.find((createdPart) => createdPart.name === part.name))
    .filter((part) => part !== undefined);

  // TODO: fetch dataset again after parts have been uploaded? (this might be necessary to have up-to-date metadata)

  return createdDataset;
}

export function* createDataset({ dataset, files, shouldSelectDataset }) {
  let createdDataset;
  try {
    createdDataset = yield postDatasetAndDatasetParts(dataset, files);

    const userEmail = yield select(getUserEmail);
    DatasetsUtils.patchDatasetWithCurrentUserPermissions(createdDataset, userEmail, DATASET_PERMISSIONS_MAPPING);
    yield put(addDataset(createdDataset));

    if (shouldSelectDataset) yield put(selectDataset({ selectedDatasetId: createdDataset.id }));
    return createdDataset;
  } catch (error) {
    console.error(error);
    const errorMessage = t(
      'commoncomponents.banner.errorDuringDatasetCreation',
      'Something went wrong during the dataset creation'
    );
    yield put(setApplicationErrorMessage({ error, errorMessage }));
  }
}

function* createDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.CREATE_DATASET, createDataset);
}

export default createDatasetSaga;
