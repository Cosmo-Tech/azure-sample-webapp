// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SolutionsUtils } from '../../utils';
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

export const useScenarioRunTemplates = () => {
  const runTemplates = useRunTemplates();
  return useMemo(
    () =>
      runTemplates.filter(
        (runTemplate) => !SolutionsUtils.isDataSource(runTemplate) && !SolutionsUtils.isSubDataSource(runTemplate)
      ),
    [runTemplates]
  );
};

export const useDataSourceRunTemplates = () => {
  const runTemplates = useRunTemplates();
  return useMemo(() => runTemplates.filter(SolutionsUtils.isDataSource), [runTemplates]);
};

export const useSubDataSourceRunTemplates = () => {
  const runTemplates = useRunTemplates();
  return useMemo(() => runTemplates.filter(SolutionsUtils.isSubDataSource), [runTemplates]);
};

export const useResetCurrentSolution = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentSolution()), [dispatch]);
};
