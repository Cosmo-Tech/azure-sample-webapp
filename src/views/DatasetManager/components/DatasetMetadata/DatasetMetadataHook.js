// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentDataset, useUpdateDataset, useSelectedDatasetIndex } from '../../../../state/hooks/DatasetHooks';

export const useDatasetMetadata = () => {
  const dataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const updateDataset = useUpdateDataset();

  return { dataset, updateDataset, selectedDatasetIndex };
};
