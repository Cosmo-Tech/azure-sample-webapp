// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dispatchResetCurrentSolution } from '../dispatchers/solution/SolutionDispatcher';

export const useSolution = () => {
  return useSelector((state) => state.solution.current);
};

export const useSolutionData = () => {
  return useSelector((state) => state.solution.current?.data);
};

export const useResetCurrentSolution = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentSolution()), [dispatch]);
};
