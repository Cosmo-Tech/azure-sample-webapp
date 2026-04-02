// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Paper, Stack, Typography } from '@mui/material';
import { HierarchicalComboBox, FadingTooltip } from '@cosmotech/ui';
import { useSortedScenarioList } from '../../../../hooks/ScenarioListHooks';
import { TranslationUtils } from '../../../../utils';
import { ScenarioOverrideProvider } from '../../../../contexts/ScenarioOverrideContext';
import { ScenarioDashboardCard } from '..';
import ReadOnlyScenarioParameters from '../ReadOnlyScenarioParameters/ReadOnlyScenarioParameters';
import { useComparisonScenarioPanel } from './ComparisonScenarioPanelHook';

const STORAGE_COMPARISON_PARAMS_ACCORDION_EXPANDED_KEY = 'comparisonParamsAccordionExpanded';

const ComparisonScenarioPanel = () => {
  const { t } = useTranslation();
  const sortedScenarioList = useSortedScenarioList();
  const { comparisonScenarioData, comparisonDatasetName, selectComparisonScenario } = useComparisonScenarioPanel();

  const [isParamsExpanded, setIsParamsExpanded] = useState(
    localStorage.getItem(STORAGE_COMPARISON_PARAMS_ACCORDION_EXPANDED_KEY) === 'true'
  );

  const toggleParamsAccordion = useCallback(() => {
    const expanded = !isParamsExpanded;
    setIsParamsExpanded(expanded);
    localStorage.setItem(STORAGE_COMPARISON_PARAMS_ACCORDION_EXPANDED_KEY, expanded);
  }, [isParamsExpanded]);

  const scenarioValidationStatusLabels = {
    rejected: t('views.scenario.validation.rejected', 'Rejected'),
    validated: t('views.scenario.validation.validated', 'Validated'),
  };

  const hierarchicalComboBoxLabels = {
    label: t('views.scenario.comparison.selector.label', 'Compare with'),
    validationStatus: scenarioValidationStatusLabels,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Stack>
        <HierarchicalComboBox
          value={comparisonScenarioData}
          values={sortedScenarioList}
          labels={hierarchicalComboBoxLabels}
          handleChange={selectComparisonScenario}
        />
        {comparisonScenarioData && (
          <Stack direction="row" sx={{ justifyContent: 'center' }}>
            <FadingTooltip
              title={t(
                TranslationUtils.getRunTemplateTranslationKey(comparisonScenarioData.runTemplateId),
                comparisonScenarioData.runTemplateName
              )}
              useSpan
              spanProps={{ style: { overflow: 'hidden' } }}
            >
              <Typography data-cy="comparison-run-template-name" align="center" noWrap color="text.secondary">
                <Typography component="span" sx={{ fontWeight: '700' }}>
                  {t('views.scenario.text.scenariotype')}
                </Typography>
                :{' '}
                {t(
                  TranslationUtils.getRunTemplateTranslationKey(comparisonScenarioData.runTemplateId),
                  comparisonScenarioData.runTemplateName
                )}
              </Typography>
            </FadingTooltip>
            <FadingTooltip
              title={comparisonDatasetName}
              useSpan
              spanProps={{ style: { overflow: 'hidden' } }}
            >
              <Typography data-cy="comparison-dataset-name" align="center" noWrap color="text.secondary">
                &nbsp;|&nbsp;
                <Typography component="span" sx={{ fontWeight: '700' }}>
                  {t('commoncomponents.dialog.create.scenario.dropdown.dataset.label', 'Dataset')}:&nbsp;
                </Typography>
                {comparisonDatasetName}
              </Typography>
            </FadingTooltip>
          </Stack>
        )}
      </Stack>
      {comparisonScenarioData ? (
        <>
          <Card component={Paper}>
            <ReadOnlyScenarioParameters
              scenarioData={comparisonScenarioData}
              isAccordionExpanded={isParamsExpanded}
              onToggleAccordion={toggleParamsAccordion}
            />
          </Card>
          <ScenarioOverrideProvider scenarioData={comparisonScenarioData}>
            <ScenarioDashboardCard />
          </ScenarioOverrideProvider>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            minHeight: 200,
          }}
        >
          <Typography color="text.secondary">
            {t('views.scenario.comparison.placeholder', 'Select a scenario to compare')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ComparisonScenarioPanel;
