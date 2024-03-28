// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { DATASET_SOURCE_TYPE } from '../../../../services/config/ApiConstants';
import { useCreateDataset } from '../../../../state/hooks/DatasetHooks';
import { useCreateRunner } from '../../../../state/hooks/RunnerHooks';
import { useSolutionData } from '../../../../state/hooks/SolutionHooks';
import { ArrayDictUtils, SolutionsUtils } from '../../../../utils';

export const useCreateDatasetOrRunner = () => {
  const createDataset = useCreateDataset();
  const createRunner = useCreateRunner();
  const solutionData = useSolutionData();

  return useCallback(
    (values) => {
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
        runner.parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[sourceType]);
        createRunner(runner);
      }
    },
    [createDataset, createRunner, solutionData]
  );
};
