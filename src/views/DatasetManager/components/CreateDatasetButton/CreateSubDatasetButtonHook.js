// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { DATASET_REDUCER_STATUS } from '../../../../state/datasets/constants';
import { useSetDatasetReducerStatus } from '../../../../state/datasets/hooks';
import { useOrganizationData } from '../../../../state/organizations/hooks';
import { useCreateETLRunnerAndDataset } from '../../../../state/runner/hooks';
import { useSubDataSourceRunTemplates, useSolutionData } from '../../../../state/solutions/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';
import { ArrayDictUtils, SolutionsUtils } from '../../../../utils';

export const useSubDatasetCreationParameters = () => {
  const createETLRunnerAndDataset = useCreateETLRunnerAndDataset();
  const solutionData = useSolutionData();
  const workspace = useWorkspaceData();
  const customSubDataSourceRunTemplates = useSubDataSourceRunTemplates();
  const setDatasetReducerStatus = useSetDatasetReducerStatus();

  const userPermissionsInCurrentOrganization = useOrganizationData()?.security?.currentUserPermissions ?? [];

  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customSubDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));

    const subdatasourceFilter = workspace?.additionalData?.webapp?.datasetManager?.subdatasourceFilter;
    const runTemplates = {};
    dataSourcesWithParameters.forEach((runTemplate) => {
      if (subdatasourceFilter == null || subdatasourceFilter.indexOf(runTemplate.id) !== -1)
        runTemplates[runTemplate.id] = runTemplate;
    });

    return runTemplates;
  }, [
    customSubDataSourceRunTemplates,
    solutionData.parameters,
    solutionData.runTemplatesParametersIdsDict,
    workspace?.additionalData?.webapp?.datasetManager?.subdatasourceFilter,
  ]);

  const createSubDatasetRunner = useCallback(
    (parentDatasetId, values) => {
      setDatasetReducerStatus(DATASET_REDUCER_STATUS.CREATING);
      ArrayDictUtils.removeUndefinedValuesFromDict(values);

      const sourceType = values.sourceType;
      const runner = {
        name: values.name,
        tags: values.tags,
        description: values.description,
        runTemplateId: sourceType,
        datasetList: [parentDatasetId],
      };
      const escapedSourceType = SolutionsUtils.escapeRunTemplateId(sourceType);
      runner.parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[escapedSourceType]);
      createETLRunnerAndDataset(runner);
    },
    [createETLRunnerAndDataset, setDatasetReducerStatus, solutionData]
  );

  return {
    dataSourceRunTemplates,
    createSubDatasetRunner,
    userPermissionsInCurrentOrganization,
  };
};
