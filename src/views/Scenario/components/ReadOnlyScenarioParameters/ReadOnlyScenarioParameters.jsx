// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Stack,
  Tab,
  styled,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useSolutionData } from '../../../../state/solutions/hooks';
import { ConfigUtils, ScenarioParametersUtils, TranslationUtils } from '../../../../utils';

const PlaceholderDiv = styled('div')(({ theme }) => ({
  margin: `0 ${theme.spacing(3)}`,
}));

const ReadOnlyScenarioParameters = ({ scenarioData, isAccordionExpanded, onToggleAccordion }) => {
  const { t } = useTranslation();
  const solutionData = useSolutionData();

  const parametersGroupsMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersGroupsMetadata(solutionData, scenarioData?.runTemplateId),
    [solutionData, scenarioData?.runTemplateId]
  );

  const visibleGroups = useMemo(
    () =>
      parametersGroupsMetadata.filter((group) => {
        const isHidden = ConfigUtils.getParametersGroupAttribute(group, 'hidden') === true;
        if (isHidden) return false;
        const hasVisibleParams = group.parameters.some(
          (param) => ConfigUtils.getParameterAttribute(param, 'hidden') !== true
        );
        return hasVisibleParams;
      }),
    [parametersGroupsMetadata]
  );

  const firstTabId = visibleGroups[0]?.id ?? '';
  const [selectedTab, setSelectedTab] = useState(firstTabId);

  const parameterValuesMap = useMemo(() => {
    const map = {};
    if (scenarioData?.parametersValues) {
      for (const pv of scenarioData.parametersValues) {
        map[pv.parameterId] = pv.value;
      }
    }
    return map;
  }, [scenarioData?.parametersValues]);

  const formatValue = (parameter, rawValue) => {
    if (rawValue == null || rawValue === '') {
      return t('views.scenario.comparison.parameters.noValue', '—');
    }
    if (parameter.varType === 'bool') {
      return rawValue === 'true' || rawValue === true ? t('commoncomponents.text.true', 'Yes') : t('commoncomponents.text.false', 'No');
    }
    if (parameter.varType === 'enum') {
      const enumValues = ConfigUtils.getParameterAttribute(parameter, 'enumValues');
      const match = enumValues?.find((e) => e.key === rawValue);
      if (match) return t(TranslationUtils.getParameterEnumValueTranslationKey(parameter.id, match.key), match.value);
    }
    if (parameter.varType === 'date') {
      try {
        return new Date(rawValue).toLocaleDateString();
      } catch {
        return String(rawValue);
      }
    }
    return String(rawValue);
  };

  return (
    <div>
      <Accordion data-cy="comparison-params-accordion" expanded={isAccordionExpanded}>
        <AccordionSummary
          data-cy="comparison-params-accordion-summary"
          sx={{ flexDirection: 'row-reverse' }}
          expandIcon={<ExpandMoreIcon />}
          onClick={onToggleAccordion}
          component="div"
          role="button"
        >
          <Grid
            container
            size="grow"
            sx={{ direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Grid sx={{ ml: '10px' }}>
              <Typography>{t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters')}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '100%' }}>
            {visibleGroups.length === 0 ? (
              <PlaceholderDiv data-cy="no-parameters-placeholder">
                {t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.')}
              </PlaceholderDiv>
            ) : (
              <TabContext value={selectedTab || firstTabId}>
                <TabList
                  value={selectedTab || firstTabId}
                  variant="scrollable"
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, newTab) => setSelectedTab(newTab)}
                  aria-label="comparison scenario parameters"
                >
                  {visibleGroups.map((group) => (
                    <Tab
                      key={group.id}
                      value={group.id}
                      data-cy={group.id + '_comparison_tab'}
                      label={t(TranslationUtils.getParametersGroupTranslationKey(group.id), group.id)}
                    />
                  ))}
                </TabList>
                {visibleGroups.map((group) => (
                  <TabPanel
                    key={group.id}
                    value={group.id}
                    sx={{ maxHeight: 450, overflow: 'auto' }}
                  >
                    <Stack spacing={2} direction="column" sx={{ alignItems: 'stretch' }}>
                      {group.parameters
                        .filter((param) => ConfigUtils.getParameterAttribute(param, 'hidden') !== true)
                        .map((param) => (
                          <TextField
                            key={param.id}
                            data-cy={`comparison-param-${param.id}`}
                            label={t(TranslationUtils.getParameterTranslationKey(param.id), param.id)}
                            value={formatValue(param, parameterValuesMap[param.id])}
                            slotProps={{ input: { readOnly: true } }}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        ))}
                    </Stack>
                  </TabPanel>
                ))}
              </TabContext>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

ReadOnlyScenarioParameters.propTypes = {
  scenarioData: PropTypes.object,
  isAccordionExpanded: PropTypes.bool.isRequired,
  onToggleAccordion: PropTypes.func.isRequired,
};

export default ReadOnlyScenarioParameters;
