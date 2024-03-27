// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { DATASET_SOURCE_TYPE } from '../../../../services/config/ApiConstants';
import { useCreateDataset } from '../../../../state/hooks/DatasetHooks';
import { useCreateRunner } from '../../../../state/hooks/RunnerHooks';
import { useSolutionData } from '../../../../state/hooks/SolutionHooks';
import { ArrayDictUtils } from '../../../../utils';

export const useCreateDatasetOrRunner = () => {
  const createDataset = useCreateDataset();
  const createRunner = useCreateRunner();
  const solutionData = useSolutionData();

  return useCallback(
    (values) => {
      const getParametersForRunner = (values) => {
        if (values == null) return [];
        const solutionParameters = solutionData.parameters;

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
      };

      ArrayDictUtils.removeUndefinedValuesFromDict(values);

      const sourceType = values.sourceType;
      const dataset = { name: values.name, tags: values.tags, description: values.description, sourceType };

      if (Object.values(DATASET_SOURCE_TYPE).includes(sourceType)) {
        if (values.sourceType === DATASET_SOURCE_TYPE.LOCAL_FILE) {
          dataset.file = values[sourceType].file;
          dataset.source = null;
        } else if (values.sourceType === DATASET_SOURCE_TYPE.NONE) {
          dataset.source = null;
        } else {
          dataset.source = values[sourceType];
        }
        createDataset(dataset);
      } else {
        const runner = { ...dataset };
        runner.parametersValues = getParametersForRunner(values[sourceType]);
        createRunner(runner);
      }
    },
    [createDataset, createRunner, solutionData]
  );
};
