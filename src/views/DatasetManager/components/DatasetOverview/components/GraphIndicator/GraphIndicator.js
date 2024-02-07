// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card, Grid, Skeleton, Typography } from '@mui/material';
import { KPI_STATE } from '../../../../../../services/config/kpiConstants';
import { TranslationUtils } from '../../../../../../utils';
import { KPIValue } from '../KPIValue';

const GraphIndicator = (props) => {
  const { t } = useTranslation();
  const { id, kpi } = props;

  const graphIndicatorCard = useMemo(() => {
    return (
      <Card data-cy={`indicator-card-${kpi.id}`} sx={{ backgroundColor: '#ffe26b1c' }}>
        <Grid
          container
          sx={{
            padding: 2,
            height: '100%',
            flexFlow: 'column wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <KPIValue kpi={kpi} valueTypographyProps={{ variant: 'h4' }} size="24px" />
          <Typography variant="subtitle2">
            {t(TranslationUtils.getDatasetGraphIndicatorNameTranslationKey(id), id)}
          </Typography>
        </Grid>
      </Card>
    );
  }, [id, kpi, t]);

  return kpi.state === KPI_STATE.IDLE || kpi.state === KPI_STATE.LOADING ? (
    <Skeleton variant="rounded">{graphIndicatorCard}</Skeleton>
  ) : (
    graphIndicatorCard
  );
};

GraphIndicator.propTypes = {
  id: PropTypes.string,
  kpi: PropTypes.object,
};

GraphIndicator.defaultProps = {
  id: 'graph-indicator',
  kpi: {},
};

export default GraphIndicator;
