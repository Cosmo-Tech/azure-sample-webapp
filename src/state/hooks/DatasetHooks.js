// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchAddDatasetToStore, dispatchSetCurrentDatasetIndex } from '../dispatchers/dataset/DatasetDispatcher';

export const useDatasetList = () => {
  return useSelector((state) => state.dataset.list);
};

export const useDatasetListData = () => {
  return useSelector((state) => state.dataset?.list?.data);
};

export const useSelectedDatasetIndex = () => {
  return useSelector((state) => state.dataset?.selectedDatasetIndex.data);
};

export const useAddDatasetToStore = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(dispatchAddDatasetToStore(payload)), [dispatch]);
};

export const useCurrentDataset = () => {
  const datasets = useDatasetListData();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  return datasets?.[selectedDatasetIndex] ?? null;
};

export const useSelectDataset = () => {
  const datasets = useDatasetListData();
  const dispatch = useDispatch();

  return useCallback(
    (datasetToSelect) => {
      const selectedDatasetIndex = datasets.findIndex((dataset) => dataset.id === datasetToSelect?.id);
      dispatch(dispatchSetCurrentDatasetIndex(selectedDatasetIndex));
    },
    [datasets, dispatch]
  );
};

export const useDeleteDataset = () => {
  // TODO implement the hook that deletes specific dataset and its children
};

export const useRefreshDataset = () => {
  // TODO implement the hook that refreshes dataset data
};
