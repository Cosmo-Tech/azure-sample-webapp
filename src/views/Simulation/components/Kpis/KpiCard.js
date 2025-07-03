// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Typography } from '@mui/material';
import KpiTrendChip from './KpiTrendChip';

const KpiCard = ({ kpi }) => {
  return (
    <Card sx={{ width: '100%', p: 2, borderRadius: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" columnSpacing={2}>
        <Grid item xs="auto">
          {kpi.prefix && (
            <Typography variant="h5" component="span" fontWeight="fontWeightBold">
              {kpi.prefix}
            </Typography>
          )}
          <Typography variant="h4" component="span" fontWeight="fontWeightBold">
            {typeof kpi.value === 'string' ? kpi.value : kpi.value.toFixed(2)}
          </Typography>
          {kpi.suffix && (
            <Typography variant="h5" component="span" fontWeight="fontWeightBold">
              {kpi.suffix}
            </Typography>
          )}
        </Grid>
        {kpi.difference && (
          <Grid item xs>
            <KpiTrendChip value={kpi.difference} isPositiveGreen={kpi.isPositiveGreen} />
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography color="textSecondary" variant="subtitle1" sx={{ py: 0.5, textAlign: 'start' }}>
            {kpi?.label}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

KpiCard.propTypes = {
  kpi: PropTypes.object.isRequired,
};

export default KpiCard;
