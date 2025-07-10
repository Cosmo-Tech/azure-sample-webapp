// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import { HierarchicalComboBox } from '@cosmotech/ui';
import { useSimulationViewContext } from '../../SimulationViewContext';

// Note: this code has been duplicated from the ScenarioSelector component, to only show a list of fake scenarios
export const ScenarioSelector = ({ disabled, renderInputToolTip }) => {
  const { scenarios, currentScenario, setCurrentScenario } = useSimulationViewContext();

  const changeScenario = useCallback(
    (event, newSelectedScenario) => {
      const selectedScenario = scenarios.find((scenario) => scenario.id === newSelectedScenario?.id);
      setCurrentScenario(selectedScenario);
    },
    [scenarios, setCurrentScenario]
  );

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
      renderInputToolType={renderInputToolTip}
      disabled={disabled || noScenario}
      handleChange={changeScenario}
    />
  );
};

ScenarioSelector.propTypes = {
  disabled: PropTypes.bool,
  renderInputToolTip: PropTypes.string,
};

ScenarioSelector.defaultProps = {
  disabled: false,
  renderInputToolTip: '',
};
