// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import { HierarchicalComboBox } from '@cosmotech/ui';
import { useSortedScenarioList } from '../../hooks/ScenarioListHooks';
import { STATUSES } from '../../state/commons/Constants';
import {
  useCurrentSimulationRunnerData,
  useCurrentSimulationRunnerReducerStatus,
  useSelectRunner,
} from '../../state/hooks/RunnerHooks';

const CurrentScenarioSelector = ({ disabled, renderInputToolTip }) => {
  const sortedScenarioList = useSortedScenarioList();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const currentScenarioStatus = useCurrentSimulationRunnerReducerStatus();

  const changeScenario = useSelectRunner();

  const handleScenarioChange = useCallback(
    (event, scenario) => {
      changeScenario(scenario.id);
    },
    [changeScenario]
  );

  const noScenario = currentScenarioData === null || sortedScenarioList.length === 0;
  const isSwitchingScenario = currentScenarioStatus === STATUSES.LOADING;

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
      value={currentScenarioData}
      values={sortedScenarioList}
      labels={hierarchicalComboBoxLabels}
      renderInputToolType={renderInputToolTip}
      disabled={disabled || noScenario || isSwitchingScenario}
      handleChange={handleScenarioChange}
    />
  );
};

CurrentScenarioSelector.propTypes = {
  disabled: PropTypes.bool,
  renderInputToolTip: PropTypes.string,
};

CurrentScenarioSelector.defaultProps = {
  disabled: false,
  renderInputToolTip: '',
};

export default CurrentScenarioSelector;
