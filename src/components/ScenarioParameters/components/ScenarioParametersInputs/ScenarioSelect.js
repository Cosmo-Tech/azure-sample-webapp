// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { SingleSelect } from '@cosmotech/ui';
import { useSortedScenarioList } from '../../../../hooks/ScenarioListHooks';
import { useCurrentScenarioId } from '../../../../state/hooks/ScenarioHooks';
import { TranslationUtils } from '../../../../utils';

export const ScenarioSelect = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const scenarioList = useSortedScenarioList();
  const currentScenarioId = useCurrentScenarioId();
  const runTemplateFilter = parameterData.options?.runTemplateFilter;

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
    <Grid item xs={3}>
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
  gridItemProps: PropTypes.object,
};

ScenarioSelect.defaultProps = {
  isDirty: false,
};
