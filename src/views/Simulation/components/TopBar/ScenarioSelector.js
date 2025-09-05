// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { t } from 'i18next';
import { HierarchicalComboBox } from '@cosmotech/ui';
import { useSimulationViewContext } from '../../SimulationViewContext';

// Note: this code has been duplicated from the ScenarioSelector component, to only show a list of fake scenarios
export const ScenarioSelector = () => {
  const { scenarios, currentScenario, setCurrentScenario } = useSimulationViewContext();

  const selector = useMemo(() => {
    const changeScenario = (event, newSelectedScenario) => {
      const selectedScenario = scenarios.find((scenario) => scenario.id === newSelectedScenario?.id);
      setCurrentScenario(selectedScenario);
    };

    const noScenario = currentScenario === null || scenarios.length === 0;

    const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');
    const scenarioValidationStatusLabels = {
      rejected: t('views.scenario.validation.rejected', 'Rejected'),
      validated: t('views.scenario.validation.validated', 'Validated'),
    };

    const hierarchicalComboBoxLabels = {
      label: scenarioListLabel,
      validationStatus: scenarioValidationStatusLabels,
    };

    return (
      <HierarchicalComboBox
        value={currentScenario}
        values={scenarios}
        labels={hierarchicalComboBoxLabels}
        renderInputToolType={''}
        disabled={false}
        handleChange={changeScenario}
      />
    );
  }, [scenarios, currentScenario, setCurrentScenario]);

  return selector;
};
