// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';

export const dispatchGetAllDatasets = (payLoad) => ({
  type: DATASET_ACTIONS_KEY.GET_ALL_DATASETS,
  ...payLoad,
});

export const dispatchAddDatasetToStore = (payLoad) => ({
  type: DATASET_ACTIONS_KEY.ADD_DATASET,
  ...payLoad,
});

export const dispatchSetCurrentDatasetIndex = (datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX,
  selectedDatasetIndex: datasetIndex,
});

export const dispatchDeleteDataset = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.DELETE_DATASET,
  organizationId,
  datasetId,
});

export const dispatchCreateDataset = (organizationId, dataset) => ({
  type: DATASET_ACTIONS_KEY.CREATE_DATASET,
  organizationId,
  dataset,
});

export const dispatchUpdateDataset = (organizationId, datasetId, datasetData, datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET,
  organizationId,
  datasetId,
  datasetData,
  datasetIndex,
});
