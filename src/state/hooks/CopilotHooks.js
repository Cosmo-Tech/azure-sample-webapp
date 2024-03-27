// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchGetToken } from '../dispatchers/copilot/CopilotDispatcher';

export const useGetCopilotToken = () => {
  return useSelector((state) => state.copilot.token);
};

export const useFetchToken = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchGetToken()), [dispatch]);
};
