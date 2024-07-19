// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAddDatasetToStore } from '../state/hooks/DatasetHooks';
import { useOrganizationId } from '../state/hooks/OrganizationHooks';
import { useCurrentScenarioData, useScenarios } from '../state/hooks/ScenarioHooks';
import { useSolution } from '../state/hooks/SolutionHooks';
import { useWorkspaceId } from '../state/hooks/WorkspaceHooks';
import { ScenarioParametersUtils } from '../utils';
import { FileManagementUtils } from '../utils/FileManagementUtils';

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
};

export const useUpdateParameters = () => {
  const solutionData = useSolution().data;
  const currentScenarioData = useCurrentScenarioData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const addDatasetToStore = useAddDatasetToStore();
  const scenarios = useScenarios();

  const { getValues, setValue } = useFormContext();
  const parametersValues = getValues();

  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData?.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId),
    [solutionData?.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId]
  );
  const parametersMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersMetadata(solutionData, runTemplateParametersIds),
    [solutionData, runTemplateParametersIds]
  );

  const processFilesToUpload = useCallback(() => {
    const updateParameterValue = (parameterId, keyToPatch, newValue) => {
      const currentValue = getValues(parameterId);
      setValue(parameterId, { ...currentValue, [keyToPatch]: newValue });
    };
    const parametersValues = getValues();
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
    parametersMetadata,
    solutionData,
    workspaceId,
    currentScenarioData,
  ]);

  const getParametersToUpdate = useCallback(() => {
    const parametersValues = getValues();
    return ScenarioParametersUtils.buildParametersForUpdate(
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
    parametersMetadata,
    processFilesToUpload,
    getParametersToUpdate,
    forceUpdate,
  };
};
