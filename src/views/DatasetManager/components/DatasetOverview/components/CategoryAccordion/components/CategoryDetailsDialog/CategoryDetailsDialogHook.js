// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useApplicationTheme } from '../../../../../../../../state/app/hooks';
import { useCurrentDataset } from '../../../../../../../../state/datasets/hooks';
import { useWorkspaceData } from '../../../../../../../../state/workspaces/hooks';

export const useCategoryDetailsDialogHook = () => {
  const currentDataset = useCurrentDataset();
  const workspaceData = useWorkspaceData();
  const { isDarkTheme } = useApplicationTheme();

  const getQuery = useCallback(
    (queryId) => {
      return workspaceData?.additionalData?.webapp?.datasetManager?.queries?.find((query) => query.id === queryId);
    },
    [workspaceData?.additionalData?.webapp?.datasetManager?.queries]
  );

  return {
    dataset: currentDataset,
    getQuery,
    isDarkTheme,
  };
};
