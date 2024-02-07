// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { TranslationUtils } from '../../../../../../../../utils';
import { KPIValue } from '../../../KPIValue';

const KPI = (props) => {
  const { t } = useTranslation();
  const { id, categoryId, kpi, labelProps, valueProps } = props;

  const label = useMemo(() => {
    return (
      <Typography variant="body1" {...labelProps}>
        {t(TranslationUtils.getDatasetCategoryKpiNameTranslationKey(categoryId, kpi.id), kpi.id)}
      </Typography>
    );
  }, [t, categoryId, kpi, labelProps]);

  return kpi.id == null ? null : (
    <Grid
      id={id}
      container
      spacing={1}
      sx={{
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <Grid item>{label}</Grid>

      <Grid item>
        <KPIValue kpi={kpi} valueTypographyProps={{ ...valueProps }} />
      </Grid>
    </Grid>
  );
};

KPI.propTypes = {
  id: PropTypes.string,
  categoryId: PropTypes.string,
  kpi: PropTypes.object,
  labelProps: PropTypes.object,
  valueProps: PropTypes.object,
};

KPI.defaultProps = {
  id: 'kpi',
  categoryId: '',
  kpi: {},
  labelProps: {},
  valueProps: {},
};

export default KPI;
