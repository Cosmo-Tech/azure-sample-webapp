// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useDatasetList, useDatasetListData } from '../../state/hooks/DatasetHooks';

export const useDatasetManager = () => {
  const mainDatasetsList = useDatasetListData()?.filter((dataset) => dataset.main === true);
  const datasetsStatus = useDatasetList()?.status;

  return { mainDatasetsList, datasetsStatus };
};
