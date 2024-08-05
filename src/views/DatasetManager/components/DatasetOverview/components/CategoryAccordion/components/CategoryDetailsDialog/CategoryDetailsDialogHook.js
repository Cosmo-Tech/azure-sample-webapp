// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentDataset, useCurrentDatasetId } from '../../../../../../../../state/hooks/DatasetHooks';

export const useCategoryDetailsDialogHook = () => {
  const currentDataset = useCurrentDataset();
  const currentDatasetId = useCurrentDatasetId();

  return {
    datasetName: currentDataset?.name,
    datasetId: currentDatasetId,
  };
};
