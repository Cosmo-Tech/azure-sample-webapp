// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAddDatasetToStore } from '../state/datasets/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import { useCurrentSimulationRunnerData, useRunners } from '../state/runner/hooks';
import { useSolution } from '../state/solutions/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { ScenarioParametersUtils } from '../utils';
import { FileManagementUtils } from '../utils/FileManagementUtils';

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
};

export const useUpdateParameters = () => {
  const solutionData = useSolution().data;
  const currentScenarioData = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const addDatasetToStore = useAddDatasetToStore();
  const scenarios = useRunners();

  const { getValues, setValue } = useFormContext();
  const parametersValues = getValues();

  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData?.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId),
    [solutionData?.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId]
  );
  const processFilesToUpload = useCallback(async () => {
    const updateParameterValue = (parameterId, newValue) => {
      const currentValue = getValues(parameterId);
      setValue(parameterId, { ...currentValue, ...newValue });
    };
    const parametersValues = getValues();
    const parametersMetadata = ScenarioParametersUtils.generateParametersMetadata(
      solutionData,
      runTemplateParametersIds
    );

    return FileManagementUtils.applyPendingOperationsOnFileParameters(
      organizationId,
      workspaceId,
      solutionData,
      parametersMetadata,
      parametersValues,
      updateParameterValue,
      addDatasetToStore,
      currentScenarioData?.security
    );
  }, [
    addDatasetToStore,
    setValue,
    getValues,
    organizationId,
    solutionData,
    workspaceId,
    currentScenarioData,
    runTemplateParametersIds,
  ]);

  const getParametersToUpdate = useCallback(() => {
    const parametersValues = getValues();
    return ScenarioParametersUtils.buildParametersForUpdateRequest(
      solutionData,
      parametersValues,
      runTemplateParametersIds,
      currentScenarioData,
      scenarios
    );
  }, [currentScenarioData, getValues, runTemplateParametersIds, scenarios, solutionData]);

  const forceUpdate =
    ScenarioParametersUtils.shouldForceScenarioParametersUpdate(
      runTemplateParametersIds,
      parametersValues,
      solutionData
    ) ||
    !currentScenarioData?.parametersValues ||
    currentScenarioData?.parametersValues.length === 0;

  return {
    runTemplateParametersIds,
    processFilesToUpload,
    getParametersToUpdate,
    forceUpdate,
  };
};
