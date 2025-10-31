// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { DATASET_SOURCE_TYPE, DATASET_SOURCES } from '../../../../services/config/ApiConstants';
import { useCreateDataset } from '../../../../state/datasets/hooks';
import { useCreateRunner } from '../../../../state/runner/hooks';
import { useDataSourceRunTemplates, useSolutionData } from '../../../../state/solutions/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';
import { ArrayDictUtils, SolutionsUtils } from '../../../../utils';

export const useDatasetCreationParameters = () => {
  const createDataset = useCreateDataset();
  const createRunner = useCreateRunner();
  const solutionData = useSolutionData();
  const workspace = useWorkspaceData();
  const customDataSourceRunTemplates = useDataSourceRunTemplates();

  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));

    const datasourceFilter = workspace?.webApp?.options?.datasetManager?.datasourceFilter;
    const runTemplates = {};
    [...DATASET_SOURCES, ...dataSourcesWithParameters].forEach((runTemplate) => {
      if (datasourceFilter == null || datasourceFilter.indexOf(runTemplate.id) !== -1)
        runTemplates[runTemplate.id] = runTemplate;
    });

    return runTemplates;
  }, [
    customDataSourceRunTemplates,
    solutionData.parameters,
    solutionData.runTemplatesParametersIdsDict,
    workspace?.webApp?.options?.datasetManager?.datasourceFilter,
  ]);

  const createDatasetOrRunner = useCallback(
    (values) => {
      ArrayDictUtils.removeUndefinedValuesFromDict(values);
      const sourceType = values.sourceType;
      const dataset = { name: values.name, tags: values.tags, description: values.description, sourceType, parts: [] };

      if (Object.values(DATASET_SOURCE_TYPE).includes(sourceType)) {
        const files = [];
        if (values.sourceType === DATASET_SOURCE_TYPE.FILE_UPLOAD) {
          const fileToUpload = values[sourceType].file;
          files.push(fileToUpload.file);
          dataset.parts.push({ name: fileToUpload.name, sourceName: fileToUpload.name });
        } else if (values.sourceType === DATASET_SOURCE_TYPE.NONE) {
          dataset.source = null;
        } else {
          dataset.source = values[sourceType];
        }
        createDataset(dataset, files, true);
      } else {
        const runner = { ...dataset };
        const escapedSourceType = SolutionsUtils.escapeRunTemplateId(sourceType);
        runner.parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[escapedSourceType]);
        createRunner(runner);
      }
    },
    [createDataset, createRunner, solutionData]
  );

  return {
    dataSourceRunTemplates,
    createDatasetOrRunner,
  };
};
