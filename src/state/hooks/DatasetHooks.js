// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchAddDatasetToStore } from '../dispatchers/dataset/DatasetDispatcher';

export const useDatasetList = () => {
  return useSelector((state) => state.dataset.list);
};

export const useDatasetListData = () => {
  return useSelector((state) => state.dataset?.list?.data);
};

export const useAddDatasetToStore = () => {
  const dispatch = useDispatch();
  return useCallback((payLoad) => dispatch(dispatchAddDatasetToStore(payLoad)), [dispatch]);
};
