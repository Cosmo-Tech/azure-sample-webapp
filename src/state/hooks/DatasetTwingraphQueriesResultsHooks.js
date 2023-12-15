// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSelector, useDispatch } from 'react-redux';
import {
  dispatchInitializeDatasetTwingraphQueriesResults,
  dispatchResetDatasetTwingraphQueriesResults,
} from '../dispatchers/datasetTwingraphQueriesResults/DatasetTwingraphQueryResultsDispatcher';
import { useWorkspaceData } from './WorkspaceHooks';
import { INGESTION_STATUS } from '../../services/config/ApiConstants';

export const useDatasetTwingraphQueriesResults = () => {
  return useSelector((state) => state.datasetTwingraph);
};

export const useInitializeDatasetTwingraphQueriesResults = (dataset) => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  const queriesResults = useDatasetTwingraphQueriesResults();
  if (dataset?.ingestionStatus === INGESTION_STATUS.SUCCESS && queriesResults[dataset?.id] === undefined)
    dispatch(dispatchInitializeDatasetTwingraphQueriesResults(dataset?.id, workspace));
};

export const useResetDatasetTwingraphQueriesResults = (dataset) => {
  const dispatch = useDispatch();
  const workspace = useWorkspaceData();
  dispatch(dispatchResetDatasetTwingraphQueriesResults(dataset?.id, workspace));
};
