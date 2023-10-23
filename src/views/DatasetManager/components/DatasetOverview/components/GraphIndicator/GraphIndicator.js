// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card, Grid, Typography } from '@mui/material';
import { KPIValue } from '../KPIValue';
import { TranslationUtils } from '../../../../../../utils';

const GraphIndicator = (props) => {
  const { t } = useTranslation();
  const { id, kpi } = props;

  return (
    <Card sx={{ backgroundColor: '#ffe26b1c' }}>
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
