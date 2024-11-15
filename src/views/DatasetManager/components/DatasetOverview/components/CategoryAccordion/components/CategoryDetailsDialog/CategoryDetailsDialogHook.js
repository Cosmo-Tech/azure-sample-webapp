// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useIsDarkTheme } from '../../../../../../../../state/app/hooks';
import { useCurrentDataset, useCurrentDatasetId } from '../../../../../../../../state/datasets/hooks';
import { useWorkspaceData } from '../../../../../../../../state/workspaces/hooks';

export const useCategoryDetailsDialogHook = () => {
  const currentDataset = useCurrentDataset();
  const currentDatasetId = useCurrentDatasetId();
  const workspaceData = useWorkspaceData();
  const isDarkTheme = useIsDarkTheme();

  const getQuery = useCallback(
    (queryId) => {
      return workspaceData?.webApp?.options?.datasetManager?.queries?.find((query) => query.id === queryId);
    },
    [workspaceData?.webApp?.options?.datasetManager?.queries]
  );

  return {
    datasetName: currentDataset?.name,
    datasetId: currentDatasetId,
    getQuery,
    isDarkTheme,
  };
};
