// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card, Grid2 as Grid, Skeleton, Typography } from '@mui/material';
import { KPI_STATE } from '../../../../../../services/config/kpiConstants';
import { TranslationUtils } from '../../../../../../utils';
import { KPIValue } from '../KPIValue';

const GraphIndicator = (props) => {
  const { t } = useTranslation();
  const { categoryId, id, kpi } = props;

  const graphIndicatorCard = useMemo(() => {
    return (
      <Card data-cy={`indicator-card-${kpi.id}`} elevation={4} sx={{ width: '250px' }}>
        <Grid
          container
          sx={{
            padding: 2,
            flexFlow: 'column wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <KPIValue kpi={kpi} valueTypographyProps={{ variant: 'h4' }} size="24px" />
          <Typography data-cy={'indicator-card-kpi-label'} variant="subtitle2">
            {categoryId
              ? t(TranslationUtils.getDatasetCategoryKpiNameTranslationKey(categoryId, id), id)
              : t(TranslationUtils.getDatasetGraphIndicatorNameTranslationKey(id), id)}
          </Typography>
        </Grid>
      </Card>
    );
  }, [categoryId, id, kpi, t]);

  return kpi.state === KPI_STATE.IDLE || kpi.state === KPI_STATE.LOADING ? (
    <Skeleton variant="rounded">{graphIndicatorCard}</Skeleton>
  ) : (
    graphIndicatorCard
  );
};

GraphIndicator.propTypes = {
  id: PropTypes.string,
  kpi: PropTypes.object,
  // categoryId is an optional prop of type string. When defined, the translation key isn't retrieved from the dynamic
  // graph indicator keys, but from the category KPIs instead
  categoryId: PropTypes.string,
};

GraphIndicator.defaultProps = {
  id: 'graph-indicator',
  kpi: {},
};

export default GraphIndicator;
