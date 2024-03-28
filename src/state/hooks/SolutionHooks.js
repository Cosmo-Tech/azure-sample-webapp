// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchResetCurrentSolution } from '../dispatchers/solution/SolutionDispatcher';

export const useSolution = () => {
  return useSelector((state) => state.solution.current);
};

export const useSolutionData = () => {
  return useSelector((state) => state?.solution?.current?.data);
};

export const useSolutionParameters = () => {
  return useSelector((state) => state?.solution?.current?.data?.parameters);
};

export const useRunTemplates = () => {
  return useSelector((state) => state?.solution?.current?.data?.runTemplates ?? []);
};

const isDataSource = (runTemplate) => runTemplate?.tags?.includes('datasource');

export const useScenarioRunTemplates = () => {
  const runTemplates = useRunTemplates();
  return useMemo(() => runTemplates.filter((runTemplate) => !isDataSource(runTemplate)), [runTemplates]);
};

export const useDataSourceRunTemplates = () => {
  const runTemplates = useRunTemplates();
  return useMemo(() => runTemplates.filter(isDataSource), [runTemplates]);
};

export const useResetCurrentSolution = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentSolution()), [dispatch]);
};
