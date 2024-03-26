// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useDatasets } from '../../../../../../state/hooks/DatasetHooks';

export const useDatasetWizard = () => {
  const datasets = useDatasets();
  const getDatasetById = useCallback((datasetId) => datasets.find((dataset) => dataset.id === datasetId), [datasets]);

  return {
    getDatasetById,
  };
};
