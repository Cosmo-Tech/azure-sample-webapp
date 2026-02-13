// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { NATIVE_DATASOURCE_TYPES, DATASET_SOURCES } from '../../../../services/config/ApiConstants';
import { useUserName } from '../../../../state/auth/hooks';
import { DATASET_REDUCER_STATUS } from '../../../../state/datasets/constants';
import { useCreateDataset, useSetDatasetReducerStatus } from '../../../../state/datasets/hooks';
import { useCreateETLRunnerAndDataset } from '../../../../state/runner/hooks';
import { useDataSourceRunTemplates, useSolutionData } from '../../../../state/solutions/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';
import { ArrayDictUtils, SolutionsUtils } from '../../../../utils';

export const useDatasetCreationParameters = () => {
  const ownerName = useUserName();
  const createDataset = useCreateDataset();
  const createETLRunnerAndDataset = useCreateETLRunnerAndDataset();
  const solutionData = useSolutionData();
  const workspace = useWorkspaceData();
  const customDataSourceRunTemplates = useDataSourceRunTemplates();
  const setDatasetReducerStatus = useSetDatasetReducerStatus();

  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));

    const datasourceFilter = workspace?.additionalData?.webapp?.datasetManager?.datasourceFilter;
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
    workspace?.additionalData?.webapp?.datasetManager?.datasourceFilter,
  ]);

  const createDatasetOrRunner = useCallback(
    (values) => {
      setDatasetReducerStatus(DATASET_REDUCER_STATUS.CREATING);
      ArrayDictUtils.removeUndefinedValuesFromDict(values);
      const sourceType = values.sourceType;
      const dataset = {
        additionalData: {
          webapp: { sourceType, ownerName, visible: { datasetManager: true, scenarioCreation: true } },
        },
        name: values.name,
        tags: values.tags,
        description: values.description,
        parts: [],
      };

      if (Object.values(NATIVE_DATASOURCE_TYPES).includes(sourceType)) {
        const files = [];
        if (values.sourceType === NATIVE_DATASOURCE_TYPES.FILE_UPLOAD) {
          const fileToUpload = values[sourceType].file;
          files.push(fileToUpload.value);
          dataset.parts.push({ name: fileToUpload.name, sourceName: fileToUpload.name });
        } else if (values.sourceType === NATIVE_DATASOURCE_TYPES.NONE) {
          dataset.source = null;
        } else {
          dataset.source = values[sourceType];
        }
        createDataset(dataset, files, true);
      } else {
        const runner = { ...dataset, runTemplateId: sourceType };
        const escapedSourceType = SolutionsUtils.escapeRunTemplateId(sourceType);
        runner.parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[escapedSourceType]);
        createETLRunnerAndDataset(runner);
      }
    },
    [createDataset, createETLRunnerAndDataset, ownerName, setDatasetReducerStatus, solutionData]
  );

  return {
    dataSourceRunTemplates,
    createDatasetOrRunner,
  };
};
