// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { Select } from '@cosmotech/ui';
import { useSortedScenarioList } from '../../../../hooks/ScenarioListHooks';
import { TranslationUtils } from '../../../../utils';

export const ScenarioSelect = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const scenarioList = useSortedScenarioList();
  const runTemplateWhiteList = parameterData.options?.runTemplateFilter;

  const filteredScenarioList = useMemo(() => {
    if (runTemplateWhiteList == null || runTemplateWhiteList?.length === 0) return scenarioList;
    const filteredScenarioTempList = [];
    scenarioList.forEach((scenario) => {
      const simulationRun = scenario?.lastRun?.csmSimulationRun;
      if (runTemplateWhiteList.includes(scenario.runTemplateId) && simulationRun != null)
        filteredScenarioTempList.push({ key: simulationRun, label: scenario.name });
    });
    return filteredScenarioTempList;
  }, [runTemplateWhiteList, scenarioList]);

  const labels = useMemo(() => {
    return {
      label: t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id),
      noValues: t('genericcomponent.scenarioSelect.noValues', 'No scenario selected'),
      noOptions: t('genericcomponent.scenarioSelect.noOptions', 'No scenarios available'),
    };
  }, [t, parameterData.id]);

  return (
    <Grid item xs={3}>
      <Select
        id={parameterData.id}
        labels={labels}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue}
        options={filteredScenarioList}
        onChange={(newValue) => setParameterValue(newValue ?? null)}
        disabled={!context.editMode}
        isDirty={isDirty}
      />
    </Grid>
  );
};

ScenarioSelect.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  gridItemProps: PropTypes.object,
};

ScenarioSelect.defaultProps = {
  isDirty: false,
};
