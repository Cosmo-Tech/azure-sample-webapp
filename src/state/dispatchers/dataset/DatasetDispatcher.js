// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';

export const dispatchGetAllDatasets = (payLoad) => ({
  type: DATASET_ACTIONS_KEY.GET_ALL_DATASETS,
  ...payLoad
});

export const dispatchAddDatasetToStore = (payLoad) => {
  return {
    type: DATASET_ACTIONS_KEY.ADD_DATASET,
    ...payLoad
  };
};
