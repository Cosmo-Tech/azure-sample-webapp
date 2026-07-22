// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceUtils } from '@cosmotech/core';
import { useHasUserPermissionOnScenario } from '../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useGetRunnerById, useRunners, useUpdateRunnerData } from '../../state/runner/hooks';
import { getScenarioEditionLabels } from './labels';

export const useEditScenarioButton = ({ scenarioToEdit }) => {
  const { t } = useTranslation();
  const getRunner = useGetRunnerById();
  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const updateRunnerData = useUpdateRunnerData();

  const scenarios = useRunners();
  const sortedScenarioList = useMemo(() => ResourceUtils.getResourceTree(scenarios), [scenarios]);
  const { disabled, dialogLabels } = useMemo(() => {
    const disabled = !hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.WRITE, scenarioToEdit);
    const dialogLabels = getScenarioEditionLabels(t, scenarioToEdit, disabled);
    return { disabled, dialogLabels };
  }, [t, hasUserPermissionOnScenario, scenarioToEdit]);

  const updateScenario = useCallback(
    (newScenarioMetadata) => {
      const runner = getRunner(newScenarioMetadata.id);
      if (!runner) {
        console.warn(`Cannot edit scenario: no scenario found with id ${newScenarioMetadata.id}`);
        return;
      }

      if (
        (runner.name ?? '') !== newScenarioMetadata.name ||
        (runner.description ?? '') !== newScenarioMetadata.description ||
        JSON.stringify(runner.tags ?? []) !== JSON.stringify(newScenarioMetadata.tags)
      ) {
        const { id, ...patchData } = newScenarioMetadata;
        updateRunnerData(id, patchData);
      }
    },
    [getRunner, updateRunnerData]
  );

  return {
    dialogLabels,
    disabled,
    updateScenario,
    sortedScenarioList,
  };
};
