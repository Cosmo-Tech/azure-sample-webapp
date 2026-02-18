// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useWorkspaceMainDatasets } from '../../../../../hooks/WorkspaceDatasetsHooks';
import { useDatasets } from '../../../../../state/datasets/hooks';
import { useGetETLRunners, useUpdateEtlRunner } from '../../../../../state/runner/hooks';
import {
  useDataSourceRunTemplates,
  useSolutionData,
  useSubDataSourceRunTemplates,
} from '../../../../../state/solutions/hooks';
import { useWorkspaceData } from '../../../../../state/workspaces/hooks';
import { DatasetsUtils, ScenarioParametersUtils } from '../../../../../utils';

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
    return mainDatasets.find((mainDataset) => mainDataset.id === DatasetsUtils.getDatasetOption(dataset, 'parentId'));
  }, [mainDatasets, dataset]);
  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));
    const subDataSourceWithParameters = customSubDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));
    const datasourceFilter = workspace?.additionalData?.webapp?.datasetManager?.datasourceFilter;
    const runTemplates = {};
    [...dataSourcesWithParameters, ...subDataSourceWithParameters].forEach((runTemplate) => {
      if (datasourceFilter == null || datasourceFilter.indexOf(runTemplate.id) !== -1)
        runTemplates[runTemplate.id] = runTemplate;
    });

    return runTemplates;
  }, [
    customDataSourceRunTemplates,
    customSubDataSourceRunTemplates,
    solutionData.parameters,
    solutionData.runTemplatesParametersIdsDict,
    workspace?.additionalData?.webapp?.datasetManager?.datasourceFilter,
  ]);
  const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
    return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
  };
  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData?.runTemplatesParametersIdsDict, selectedRunner?.runTemplateId),
    [solutionData?.runTemplatesParametersIdsDict, selectedRunner?.runTemplateId]
  );
  const formattedParametersValues = useMemo(
    () =>
      ScenarioParametersUtils.getParametersValuesForReset(runTemplateParametersIds, {}, selectedRunner, solutionData),
    [runTemplateParametersIds, selectedRunner, solutionData]
  );

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
