// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { STATUSES } from '../services/config/StatusConstants';
import DatasetService from '../services/dataset/DatasetService';
import { useDeleteDatasetPartInRedux, useAddOrUpdateDatasetPartInRedux } from '../state/datasets/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import {
  useCurrentSimulationRunnerData,
  useRunners,
  useAsyncUpdateSimulationRunner,
  useUpdateSimulationRunnerInRedux,
} from '../state/runner/hooks';
import { useSolutionData } from '../state/solutions/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { ScenarioParametersUtils } from '../utils';
import { useFileParameters } from './FileParameterHooks';

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] ?? [];
};

export const useUpdateParameters = () => {
  const updateSimulationRunnerInRedux = useUpdateSimulationRunnerInRedux();
  const asyncSaveScenarioParameters = useAsyncUpdateSimulationRunner();
  const { processFilesToUpload, updateSavedFileParameters } = useFileParameters();
  const addOrUpdateDatasetPartInRedux = useAddOrUpdateDatasetPartInRedux();
  const deleteDatasetPartFromRedux = useDeleteDatasetPartInRedux();
  const solution = useSolutionData();
  const currentScenario = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const scenarios = useRunners();

  const { getValues } = useFormContext();
  const rhfParametersValues = getValues();

  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solution?.runTemplatesParametersIdsDict, currentScenario?.runTemplateId),
    [solution?.runTemplatesParametersIdsDict, currentScenario?.runTemplateId]
  );

  const forceUpdate = useMemo(() => {
    const forcedByConfig = ScenarioParametersUtils.shouldForceScenarioParametersUpdate(
      runTemplateParametersIds,
      rhfParametersValues,
      solution
    );

    const parameterValues = currentScenario?.parametersValues;
    const noParameters = runTemplateParametersIds.length === 0;

    if (noParameters) return false;

    // Force update when the scenario has inherited parametersValues from a parent with a different run template:
    // some (or all) of the current run template's parameters may be absent from the saved parametersValues.
    const hasMissingRunTemplateParameters =
      Array.isArray(parameterValues) &&
      parameterValues.length > 0 &&
      runTemplateParametersIds.some((id) => !parameterValues.some((pv) => pv.parameterId === id));

    return forcedByConfig || !parameterValues || parameterValues.length === 0 || hasMissingRunTemplateParameters;
  }, [currentScenario?.parametersValues, rhfParametersValues, runTemplateParametersIds, solution]);

  const saveParameterValues = useCallback(async () => {
    processFilesToUpload();

    const runnerParameterDatasetId = currentScenario.datasets?.parameter;
    const parametersValues = getValues(); // Make sure we get the latest values from RHF state, after files processing
    const parametersForUpdateRequest = ScenarioParametersUtils.buildParametersForUpdateRequest(
      solution,
      parametersValues,
      runTemplateParametersIds,
      currentScenario,
      scenarios
    );

    // Keep the SAVING status for the runner redux state after the save of parameters, because we still need to process
    // the datasets and prevent users from UI actions until it's done
    await asyncSaveScenarioParameters(currentScenario.id, parametersForUpdateRequest.nonDatasetParts, STATUSES.SAVING);

    try {
      const createdDatasetParts = [];
      for (const parameter of parametersForUpdateRequest.fileDatasetParts) {
        const createdDatasetPart = await DatasetService.createDatasetPart(
          organizationId,
          workspaceId,
          runnerParameterDatasetId,
          parameter.value.part,
          parameter.value.file
        );
        addOrUpdateDatasetPartInRedux(runnerParameterDatasetId, createdDatasetPart, undefined, currentScenario.id);
        createdDatasetParts.push(createdDatasetPart);
      }

      const deletedDatasetPartIds = [];
      for (const datasetPartId of parametersForUpdateRequest.idsOfDatasetPartsToDelete) {
        await DatasetService.deleteDatasetPart(organizationId, workspaceId, runnerParameterDatasetId, datasetPartId);
        deleteDatasetPartFromRedux(runnerParameterDatasetId, datasetPartId, currentScenario.id);
        deletedDatasetPartIds.push(datasetPartId);
      }

      updateSavedFileParameters(createdDatasetParts, deletedDatasetPartIds);

      // Clear the SAVING status and set it to success to close the saving backdrop
      updateSimulationRunnerInRedux({ runnerId: currentScenario.id, status: STATUSES.SUCCESS });
    } catch (e) {
      updateSimulationRunnerInRedux({ runnerId: currentScenario.id, status: STATUSES.ERROR });
    }
  }, [
    addOrUpdateDatasetPartInRedux,
    deleteDatasetPartFromRedux,
    asyncSaveScenarioParameters,
    processFilesToUpload,
    updateSavedFileParameters,
    updateSimulationRunnerInRedux,
    getValues,
    organizationId,
    workspaceId,
    currentScenario,
    runTemplateParametersIds,
    scenarios,
    solution,
  ]);

  return {
    runTemplateParametersIds,
    forceUpdate,
    saveParameterValues,
  };
};
