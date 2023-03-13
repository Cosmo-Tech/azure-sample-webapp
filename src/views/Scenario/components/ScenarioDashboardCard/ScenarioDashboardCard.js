// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Card, CardContent, Paper, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { ScenarioPowerBiReport } from '../index';
import { useScenarioDashboardCard } from './ScenarioDashboardCardHook';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  dashboardTitle: {
    display: 'grid',
    alignItems: 'baseline',
    gridTemplateColumns: 'repeat(10, 1fr)',
    '& p:last-child': {
      gridColumn: '2 / span 8',
      justifySelf: 'center',
    },
    '& p:first-child': {
      justifySelf: 'left',
      gridColumn: 1,
    },
  },
}));
const ScenarioDashboardCard = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { hasScenarioBeenRun, isDashboardSync } = useScenarioDashboardCard();

  const dashboardCardStyle = useMemo(
    () =>
      hasScenarioBeenRun
        ? {
            px: 3,
            '&:last-child': { pb: 2 },
            bgcolor: !isDashboardSync ? 'dashboard.warning' : undefined,
          }
        : null,
    [hasScenarioBeenRun, isDashboardSync]
  );
  return (
    <Card component={Paper} sx={{ p: 0 }}>
      <CardContent sx={dashboardCardStyle}>
        {hasScenarioBeenRun && (
          <div className={classes.dashboardTitle}>
            <Typography sx={{ ml: 3, mb: 2 }}>{t('commoncomponents.iframe.title')}</Typography>
            {!isDashboardSync && (
              <Typography>
                <WarningAmberOutlinedIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                {t('commoncomponents.iframe.scenario.results.warning.notSync')}
              </Typography>
            )}
          </div>
        )}
        <ScenarioPowerBiReport />
      </CardContent>
    </Card>
  );
};

export default ScenarioDashboardCard;
