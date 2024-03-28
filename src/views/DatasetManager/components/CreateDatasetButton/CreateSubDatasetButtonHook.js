// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
// import { useCreateDataset } from '../../../../state/hooks/DatasetHooks';
// import { useCreateRunner } from '../../../../state/hooks/RunnerHooks';
import { useSubDataSourceRunTemplates, useSolutionData } from '../../../../state/hooks/SolutionHooks';
import { ArrayDictUtils, SolutionsUtils } from '../../../../utils';

export const useSubDatasetCreationParameters = () => {
  // const createDataset = useCreateDataset();
  // const createRunner = useCreateRunner();
  const solutionData = useSolutionData();
  const customSubDataSourceRunTemplates = useSubDataSourceRunTemplates();

  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customSubDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));

    const runTemplates = {};
    dataSourcesWithParameters.forEach((runTemplate) => (runTemplates[runTemplate.id] = runTemplate));
    return runTemplates;
  }, [customSubDataSourceRunTemplates, solutionData.parameters, solutionData.runTemplatesParametersIdsDict]);

  const createSubDatasetRunner = useCallback(
    (values) => {
      ArrayDictUtils.removeUndefinedValuesFromDict(values);
      console.log(values);

      const sourceType = values.sourceType;
      const runner = { name: values.name, tags: values.tags, description: values.description, sourceType };
      runner.parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[sourceType]);
      // TODO
      // createRunner(runner);
    },
    [
      // createDataset,
      // createRunner,
      solutionData,
    ]
  );

  return {
    dataSourceRunTemplates,
    createSubDatasetRunner,
  };
};
