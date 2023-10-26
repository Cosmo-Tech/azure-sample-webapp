// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentDataset } from '../../../../state/hooks/DatasetHooks';

export const useDatasetMetadata = () => {
  const dataset = useCurrentDataset();
  return { dataset };
};
