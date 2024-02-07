// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import { Skeleton, Typography } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { KPI_STATE } from '../../../../../../services/config/kpiConstants';

export const KPIValue = (props) => {
  const { t } = useTranslation();
  const { kpi, size, valueTypographyProps } = props;

  return useMemo(() => {
    if (kpi.state === KPI_STATE.IDLE || kpi.state === KPI_STATE.LOADING)
      return (
        <FadingTooltip
          title={t('commoncomponents.datasetmanager.overview.kpiState.loading', 'Loading')}
          disableInteractive={true}
        >
          <Skeleton width="24px" />
        </FadingTooltip>
      );

    if (kpi.state === KPI_STATE.READY)
      return (
        <Typography data-cy="kpi-value" variant="body1" {...valueTypographyProps}>
          {kpi.value}
        </Typography>
      );

    if (kpi.state === KPI_STATE.FAILED)
      return (
        <FadingTooltip
          title={t(
            'commoncomponents.datasetmanager.overview.kpiState.failed',
            'The query to fetch this indicator has failed'
          )}
          disableInteractive={true}
        >
          <ErrorIcon data-cy="kpi-error" sx={{ height: size, width: size }} />
        </FadingTooltip>
      );

    return (
      <FadingTooltip
        title={t('commoncomponents.datasetmanager.overview.kpiState.unknown', 'Unexpected state')}
        disableInteractive={true}
      >
        <HelpIcon data-cy="kpi-unknown-state" sx={{ height: size, width: size }} />
      </FadingTooltip>
    );
  }, [t, kpi.state, kpi.value, size, valueTypographyProps]);
};

KPIValue.propTypes = {
  kpi: PropTypes.object,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueTypographyProps: PropTypes.object,
};

KPIValue.defaultProps = {
  kpi: {},
  size: '16px',
  valueTypographyProps: {},
};
