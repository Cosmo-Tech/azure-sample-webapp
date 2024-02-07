// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { INGESTION_STATUS } from '../../services/config/ApiConstants';
import {
  dispatchInitializeDatasetTwingraphQueriesResults,
  dispatchResetDatasetTwingraphQueriesResults,
} from '../dispatchers/datasetTwingraphQueriesResults/DatasetTwingraphQueryResultsDispatcher';
import { useWorkspaceData } from './WorkspaceHooks';

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
        dispatch(dispatchInitializeDatasetTwingraphQueriesResults(dataset?.id, workspace));
    },
    [dispatch, queriesResults, workspace]
  );
};

export const useResetDatasetTwingraphQueriesResults = () => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  return useCallback(
    (datasetId) => dispatch(dispatchResetDatasetTwingraphQueriesResults(datasetId, workspace)),
    [dispatch, workspace]
  );
};
