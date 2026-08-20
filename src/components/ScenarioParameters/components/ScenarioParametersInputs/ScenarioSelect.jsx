// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { SingleSelect } from '@cosmotech/ui';
import { useSortedScenarioList } from '../../../../hooks/ScenarioListHooks';
import { useCurrentSimulationRunnerId } from '../../../../state/runner/hooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { PARAMETER_CONTEXT_WIDTH } from '../../../../utils/scenarioParameters/ParameterContext';

const GRID_ITEM_PROPS_MAPPING = {
  [PARAMETER_CONTEXT_WIDTH.SMALL]: { size: 12, sx: { pt: 2 } },
  [PARAMETER_CONTEXT_WIDTH.LARGE]: { size: 3 },
};

export const ScenarioSelect = ({ parameterData, context, parameterValue, setParameterValue, isDirty = false }) => {
  const { t } = useTranslation();
  const gridItemProps = GRID_ITEM_PROPS_MAPPING[context?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL];

  const scenarioList = useSortedScenarioList();
  const currentScenarioId = useCurrentSimulationRunnerId();
  const runTemplateFilter = ConfigUtils.getParameterAttribute(parameterData, 'runTemplateFilter');

  const mappedScenarioList = useMemo(() => {
    const filteredScenarioList =
      runTemplateFilter == null || runTemplateFilter?.length === 0
        ? scenarioList
        : scenarioList.filter((scenario) => {
            return runTemplateFilter.includes(scenario.runTemplateId) && scenario.id !== currentScenarioId;
          });

    return filteredScenarioList.map((scenario) => ({ key: scenario.id, label: scenario.name }));
  }, [runTemplateFilter, scenarioList, currentScenarioId]);

  const labels = useMemo(() => {
    return {
      label: t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id),
      noValue: t('genericcomponent.scenarioSelect.noValues', 'No scenario selected'),
      noOptions: t('genericcomponent.scenarioSelect.noOptions', 'No scenarios available'),
    };
  }, [t, parameterData.id]);

  return (
    <Grid {...gridItemProps}>
      <SingleSelect
        id={parameterData.id}
        labels={labels}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue}
        options={mappedScenarioList}
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
};

ScenarioSelect.useValidationRules = (parameterData) => {
  const { t } = useTranslation();
  const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required');

  return {
    required: {
      value: isRequired,
      message: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    },
  };
};
