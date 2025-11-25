// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetDatasetRunnerStatus } from '../../hooks/DatasetRunnerHooks';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { useWorkspaceData } from '../workspaces/hooks';
import { initializeQueriesResults, resetQueriesResults } from './reducers';

export const useDatasetTwingraphQueriesResults = () => {
  return useSelector((state) => state.datasetTwingraph);
};

export const useInitializeDatasetTwingraphQueriesResults = (dataset) => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  const queriesResults = useDatasetTwingraphQueriesResults();
  // FIXME: add check that type of dataset part is "DB", when migrating query system
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();

  return useCallback(
    (dataset) => {
      const datasetRunnerStatus = getDatasetRunnerStatus(dataset);
      if (datasetRunnerStatus === RUNNER_RUN_STATE.SUCCESSFUL && queriesResults[dataset?.id] === undefined)
        dispatch(initializeQueriesResults({ datasetId: dataset?.id, workspace }));
    },
    [dispatch, getDatasetRunnerStatus, queriesResults, workspace]
  );
};

export const useResetDatasetTwingraphQueriesResults = () => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  return useCallback((datasetId) => dispatch(resetQueriesResults({ datasetId, workspace })), [dispatch, workspace]);
};
