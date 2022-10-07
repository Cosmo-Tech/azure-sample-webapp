// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dispatchGetAllInitialData,
  dispatchSetApplicationStatus,
  dispatchSetApplicationErrorMessage,
  dispatchSetApplicationTheme,
  dispatchClearApplicationErrorMessage,
} from '../dispatchers/app/ApplicationDispatcher';

export const useApplicationStatus = () => {
  return useSelector((state) => state.application.status);
};

export const useIsDarkTheme = () => {
  return useSelector((state) => state.application.isDarkTheme);
};

export const useApplication = () => {
  return useSelector((state) => state.application);
};

export const useGetAllInitialData = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchGetAllInitialData()), [dispatch]);
};

export const useSetApplicationStatus = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(dispatchSetApplicationStatus(payload)), [dispatch]);
};

export const useApplicationError = () => {
  return useSelector((state) => state.application.error);
};

export const useSetApplicationErrorMessage = () => {
  const dispatch = useDispatch();
  return useCallback(
    (error, errorMessage) => dispatch(dispatchSetApplicationErrorMessage(error, errorMessage)),
    [dispatch]
  );
};

export const useClearApplicationErrorMessage = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchClearApplicationErrorMessage()), [dispatch]);
};

export const useSetApplicationTheme = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(dispatchSetApplicationTheme(payload)), [dispatch]);
};
