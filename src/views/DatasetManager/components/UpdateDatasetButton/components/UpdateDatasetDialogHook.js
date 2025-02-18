// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useWorkspaceMainDatasets } from '../../../../../hooks/WorkspaceDatasetsHooks';
import { useDatasets } from '../../../../../state/datasets/hooks';
import { useGetETLRunners, useUpdateEtlRunner } from '../../../../../state/runner/hooks';
import {
  useDataSourceRunTemplates,
  useSolutionData,
  useSubDataSourceRunTemplates,
} from '../../../../../state/solutions/hooks';
import { useWorkspaceData } from '../../../../../state/workspaces/hooks';
import { ScenarioParametersUtils } from '../../../../../utils';
import { FileManagementUtils } from '../../../../../utils/FileManagementUtils';

export const useUpdateDatasetDialog = (dataset, selectedRunner) => {
  const solutionData = useSolutionData();
  const runners = useGetETLRunners();
  const customDataSourceRunTemplates = useDataSourceRunTemplates();
  const customSubDataSourceRunTemplates = useSubDataSourceRunTemplates();
  const workspace = useWorkspaceData();
  const updateRunner = useUpdateEtlRunner();
  const datasets = useDatasets();
  const mainDatasets = useWorkspaceMainDatasets();
  const parentDataset = useMemo(() => {
    return mainDatasets.find((mainDataset) => mainDataset.id === dataset.parentId);
  }, [mainDatasets, dataset.parentId]);
  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));
    const subDatasSourceWithParameters = customSubDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));
    const datasourceFilter = workspace?.webApp?.options?.datasetManager?.datasourceFilter;
    const runTemplates = {};
    [...dataSourcesWithParameters, ...subDatasSourceWithParameters].forEach((runTemplate) => {
      if (datasourceFilter == null || datasourceFilter.indexOf(runTemplate.id) !== -1)
        runTemplates[runTemplate.id] = runTemplate;
    });

    return runTemplates;
  }, [
    customDataSourceRunTemplates,
    customSubDataSourceRunTemplates,
    solutionData.parameters,
    solutionData.runTemplatesParametersIdsDict,
    workspace?.webApp?.options?.datasetManager?.datasourceFilter,
  ]);
  const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
    return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
  };
  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData?.runTemplatesParametersIdsDict, selectedRunner?.runTemplateId),
    [solutionData?.runTemplatesParametersIdsDict, selectedRunner?.runTemplateId]
  );
  const parametersMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersMetadata(solutionData, runTemplateParametersIds),
    [solutionData, runTemplateParametersIds]
  );
  const selectedRunnerParametersValues = useMemo(
    () =>
      ScenarioParametersUtils.getParametersValuesForReset(
        datasets,
        runTemplateParametersIds,
        {},
        selectedRunner?.parametersValues
      ),
    [datasets, runTemplateParametersIds, selectedRunner?.parametersValues]
  );
  const generateParametersValuesFromOriginalValues = useCallback(() => {
    return ScenarioParametersUtils.buildParametersValuesFromOriginalValues(
      selectedRunnerParametersValues,
      parametersMetadata,
      datasets,
      FileManagementUtils.buildClientFileDescriptorFromDataset
    );
  }, [datasets, parametersMetadata, selectedRunnerParametersValues]);

  const formattedParametersValues = useMemo(() => {
    return generateParametersValuesFromOriginalValues();
  }, [generateParametersValuesFromOriginalValues]);
  return {
    runners,
    dataSourceRunTemplates,
    updateRunner,
    solutionData,
    parentDataset,
    datasets,
    formattedParametersValues,
  };
};
