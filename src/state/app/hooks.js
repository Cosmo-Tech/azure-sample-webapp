// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchGetAllInitialData } from './dispatchers';
import {
  clearApplicationErrorMessage,
  setApplicationErrorMessage,
  setApplicationStatus,
  setApplicationTheme,
} from './reducers';

export const useApplicationStatus = () => {
  return useSelector((state) => state.application.status);
};

export const useIsDarkTheme = () => {
  return useSelector((state) => state.application.isDarkTheme);
};

export const useApplication = () => {
  return useSelector((state) => state.application);
};

export const useApplicationRoles = () => {
  return useSelector((state) => state.application.roles);
};

export const useApplicationPermissions = () => {
  return useSelector((state) => state.application.permissions);
};

export const useApplicationPermissionsMapping = () => {
  return useSelector((state) => state.application.permissionsMapping);
};

export const useGetAllInitialData = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchGetAllInitialData()), [dispatch]);
};

export const useSetApplicationStatus = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(setApplicationStatus(payload)), [dispatch]);
};

export const useApplicationError = () => {
  return useSelector((state) => state.application.error);
};

export const useSetApplicationErrorMessage = () => {
  const dispatch = useDispatch();
  return useCallback(
    (error, errorMessage) => dispatch(setApplicationErrorMessage({ error, errorMessage })),
    [dispatch]
  );
};

export const useClearApplicationErrorMessage = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(clearApplicationErrorMessage()), [dispatch]);
};

export const useSetApplicationTheme = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(setApplicationTheme(payload)), [dispatch]);
};
