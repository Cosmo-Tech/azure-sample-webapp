// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Card, Grid, Paper, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { ScenarioPowerBiReport } from '../index';
import { useScenarioDashboardCard } from './ScenarioDashboardCardHook';
import { useTranslation } from 'react-i18next';

const STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY = 'dashboardsAccordionExpanded';

const ScenarioDashboardCard = () => {
  const { t } = useTranslation();
  const { hasScenarioBeenRun, isDashboardSync } = useScenarioDashboardCard();

  const [isDashboardsAccordionExpanded, setIsDashboardsAccordionExpanded] = useState(
    localStorage.getItem(STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY) === 'true'
  );
  const toggleDashboardsAccordion = () => {
    const isExpanded = !isDashboardsAccordionExpanded;
    setIsDashboardsAccordionExpanded(isExpanded);
    localStorage.setItem(STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY, isExpanded);
  };

  return (
    <Card component={Paper} sx={{ p: 0 }}>
      <Accordion
        expanded={isDashboardsAccordionExpanded}
        data-cy="dashboards-accordion"
        data-unsynced={hasScenarioBeenRun && !isDashboardSync ? 'true' : 'false'}
        sx={{ pb: 1.5, pt: 1.5, bgcolor: hasScenarioBeenRun && !isDashboardSync ? 'dashboard.warning' : undefined }}
      >
        <AccordionSummary
          data-cy="dashboards-accordion-summary"
          expandIcon={<ExpandMoreIcon />}
          onClick={toggleDashboardsAccordion}
          sx={{ flexDirection: 'row-reverse', maxHeight: '48px' }}
        >
          <Grid
            container
            sx={{ direction: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}
          >
            <Grid sx={{ ml: '10px' }}>
              <Typography>{t('commoncomponents.iframe.title', 'Dashboard')}</Typography>
            </Grid>
            <Grid item sx={{ flexGrow: '1' }}>
              {!isDashboardSync && hasScenarioBeenRun && (
                <div>
                  <Typography sx={{ textAlign: 'center', width: '100%' }}>
                    <WarningAmberOutlinedIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                    {t('commoncomponents.iframe.scenario.results.warning.notSync')}
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails sx={{ pl: '0px', width: '100%' }}>
          <ScenarioPowerBiReport />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default ScenarioDashboardCard;
