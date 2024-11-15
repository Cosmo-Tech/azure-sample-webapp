// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { INGESTION_STATUS } from '../../services/config/ApiConstants';
import { useWorkspaceData } from '../workspaces/hooks';
import { initializeQueriesResults, resetQueriesResults } from './reducers';

export const useDatasetTwingraphQueriesResults = () => {
  return useSelector((state) => state.datasetTwingraph);
};

export const useInitializeDatasetTwingraphQueriesResults = (dataset) => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  const queriesResults = useDatasetTwingraphQueriesResults();

  return useCallback(
    (dataset) => {
      if (dataset?.ingestionStatus === INGESTION_STATUS.SUCCESS && queriesResults[dataset?.id] === undefined)
        dispatch(initializeQueriesResults({ datasetId: dataset?.id, workspace }));
    },
    [dispatch, queriesResults, workspace]
  );
};

export const useResetDatasetTwingraphQueriesResults = () => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  return useCallback((datasetId) => dispatch(resetQueriesResults({ datasetId, workspace })), [dispatch, workspace]);
};
