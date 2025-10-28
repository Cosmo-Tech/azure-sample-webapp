// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';
import { DEFAULT_THEME_MODE } from '../../services/config/FunctionalConstants.js';
import { dispatchGetAllInitialData } from './dispatchers';
import {
  clearApplicationErrorMessage,
  setApplicationErrorMessage,
  setApplicationStatus,
  setApplicationTheme,
  setApplicationApiVersion,
} from './reducers';

export const useApplicationStatus = () => {
  return useSelector((state) => state.application.status);
};

export const useApplicationTheme = () => {
  const { mode, setMode, systemMode } = useColorScheme();

  const isDarkTheme = useMemo(() => {
    if ((mode ?? DEFAULT_THEME_MODE) === 'system') return systemMode === 'dark';
    return (mode ?? DEFAULT_THEME_MODE) === 'dark';
  }, [mode, systemMode]);

  const toggleTheme = useCallback(() => setMode(isDarkTheme ? 'light' : 'dark'), [isDarkTheme, setMode]);
  return { isDarkTheme, toggleTheme };
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

export const useApplicationApiVersion = () => {
  return useSelector((state) => state.application.apiVersion);
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

export const useSetApplicationApiVersion = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(setApplicationApiVersion(payload)), [dispatch]);
};
