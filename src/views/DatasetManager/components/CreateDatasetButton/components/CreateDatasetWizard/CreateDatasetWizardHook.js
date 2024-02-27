// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useCreateDataset } from '../../../../../../state/hooks/DatasetHooks';
import { useCreateRunner } from '../../../../../../state/hooks/RunnerHooks';
import { useSolutionData } from '../../../../../../state/hooks/SolutionHooks';

export const useCreateDatasetWizard = () => {
  const solutionData = useSolutionData();

  const getParametersForRunner = useCallback(
    (values) => {
      const solutionParameters = solutionData.parameters;

      console.log('values'); // NBO log to remove
      console.log(values); // NBO log to remove

      return Object.entries(values).map(([key, value]) => {
        const solutionParameter = solutionParameters.find((param) => param.id === key);
        const parameter = {
          parameterId: key,
          varType: solutionParameter?.varType,
          value,
        };
        if (solutionParameter?.varType === '%DATASETID%')
          parameter.connectorId = solutionParameter?.options?.connectorId;
        return parameter;
      });
    },
    [solutionData]
  );

  return {
    getParametersForRunner,
    useCreateDataset,
    useCreateRunner,
  };
};
