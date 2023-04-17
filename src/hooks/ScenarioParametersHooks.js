// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useOrganizationId } from '../state/hooks/OrganizationHooks';
import { useWorkspaceId } from '../state/hooks/WorkspaceHooks';
import { useSolution } from '../state/hooks/SolutionHooks';
import { useCurrentScenarioData, useScenarioListData } from '../state/hooks/ScenarioHooks';
import { useAddDatasetToStore } from '../state/hooks/DatasetHooks';
import { useCallback, useMemo } from 'react';
import { FileManagementUtils, ScenarioParametersUtils } from '../utils';
import { useFormContext } from 'react-hook-form';

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
};

export const useUpdateParameters = () => {
  const solutionData = useSolution().data;
  const currentScenarioData = useCurrentScenarioData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const addDatasetToStore = useAddDatasetToStore();
  const scenariosListData = useScenarioListData();

  const { getValues, setValue } = useFormContext();

  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId),
    [solutionData.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId]
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
      addDatasetToStore
    );
  }, [addDatasetToStore, setValue, getValues, organizationId, parametersMetadata, solutionData, workspaceId]);
  const getParametersToUpdate = useCallback(() => {
    const parametersValues = getValues();
    return ScenarioParametersUtils.buildParametersForUpdate(
      solutionData,
      parametersValues,
      runTemplateParametersIds,
      currentScenarioData,
      scenariosListData
    );
  }, [currentScenarioData, getValues, runTemplateParametersIds, scenariosListData, solutionData]);
  const forceUpdate = () => {
    return (
      ScenarioParametersUtils.shouldForceScenarioParametersUpdate(runTemplateParametersIds) ||
      !currentScenarioData?.parametersValues ||
      currentScenarioData?.parametersValues.length === 0
    );
  };
  return {
    processFilesToUpload,
    getParametersToUpdate,
    forceUpdate,
  };
};
