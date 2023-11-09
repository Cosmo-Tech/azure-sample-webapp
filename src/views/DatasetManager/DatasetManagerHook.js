// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useDatasets, useDatasetsReducerStatus } from '../../state/hooks/DatasetHooks';

export const useDatasetManager = () => {
  const mainDatasets = useDatasets()?.filter((dataset) => dataset.main === true);
  const datasetsStatus = useDatasetsReducerStatus();

  return { mainDatasets, datasetsStatus };
};
