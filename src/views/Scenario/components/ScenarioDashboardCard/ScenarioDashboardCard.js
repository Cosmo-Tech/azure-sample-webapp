// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Accordion, AccordionSummary, AccordionDetails, Button, Card, Grid, Paper, Typography } from '@mui/material';
import ScenarioPowerBiReport from '../ScenarioPowerBiReport';
import { useScenarioDashboardCard } from './ScenarioDashboardCardHook';

const STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY = 'dashboardsAccordionExpanded';

const ScenarioDashboardCard = () => {
  const { t } = useTranslation();
  const { hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs } = useScenarioDashboardCard();

  const [isDashboardsAccordionExpanded, setIsDashboardsAccordionExpanded] = useState(
    localStorage.getItem(STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY) === 'true'
  );

  const toggleDashboardsAccordion = () => {
    const isExpanded = !isDashboardsAccordionExpanded;
    setIsDashboardsAccordionExpanded(isExpanded);
    localStorage.setItem(STORAGE_DASHBOARDS_ACCORDION_EXPANDED_KEY, isExpanded);
  };

  const downloadLogsButton = useMemo(() => {
    if (!hasRunBeenSuccessful) return null;

    const triggerLogsDownload = (event) => {
      event.stopPropagation();
      downloadCurrentScenarioRunLogs();
    };

    return (
      <Button
        data-cy={'successful-run-logs-download-button'}
        color={isDashboardSync ? 'primary' : 'inherit'}
        variant="outlined"
        startIcon={<InfoOutlinedIcon />}
        onClick={triggerLogsDownload}
      >
        {t('commoncomponents.iframe.scenario.results.button.logs', 'Logs')}
      </Button>
    );
  }, [hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs, t]);

  return (
    <Card component={Paper} sx={{ p: 0 }}>
      <Accordion
        expanded={isDashboardsAccordionExpanded}
        data-cy="dashboards-accordion"
        data-unsynced={hasRunBeenSuccessful && !isDashboardSync}
        sx={{ pb: 1.5, pt: 1.5 }}
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
              {!isDashboardSync && hasRunBeenSuccessful && (
                <div>
                  <Typography sx={{ textAlign: 'center', width: '100%' }}>
                    <WarningAmberOutlinedIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                    {t('commoncomponents.iframe.scenario.results.warning.notSync')}
                  </Typography>
                </div>
              )}
            </Grid>
            <Grid>{downloadLogsButton}</Grid>
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
