// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetDatasetRunnerStatus } from '../../hooks/DatasetRunnerHooks';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { DatasetsUtils } from '../../utils';
import { useFindDatasetById } from '../datasets/hooks';
import { useWorkspaceData } from '../workspaces/hooks';
import { initializeQueriesResults, resetQueriesResults } from './reducers';

export const useDatasetTwingraphQueriesResults = () => {
  return useSelector((state) => state.datasetTwingraph);
};

export const useInitializeDatasetTwingraphQueriesResults = (dataset) => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  const queriesResults = useDatasetTwingraphQueriesResults();
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();

  return useCallback(
    (dataset) => {
      if (!DatasetsUtils.hasDBDatasetParts(dataset)) return;

      const datasetRunnerStatus = getDatasetRunnerStatus(dataset);
      if (datasetRunnerStatus === RUNNER_RUN_STATE.SUCCESSFUL && queriesResults[dataset?.id] === undefined)
        dispatch(initializeQueriesResults({ dataset, workspace }));
    },
    [dispatch, getDatasetRunnerStatus, queriesResults, workspace]
  );
};

export const useResetDatasetTwingraphQueriesResults = () => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  const findDatasetById = useFindDatasetById();

  return useCallback(
    (datasetId) => {
      const dataset = findDatasetById(datasetId);
      dispatch(resetQueriesResults({ dataset, workspace }));
    },
    [dispatch, findDatasetById, workspace]
  );
};
