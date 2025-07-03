// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';

const POSITIVE_BACKGROUND_COLOR = `rgba(81, 231, 151, 0.1)`;
const POSITIVE_COLOR = `rgba(81, 231, 151, 1)`;
const NEGATIVE_BACKGROUND_COLOR = `rgba(255, 85, 87, 0.1)`;
const NEGATIVE_COLOR = `rgba(255, 85, 87, 1)`;

const KpiTrendChip = ({ isPositiveGreen, value }) => {
  const chipData = useMemo(() => {
    const number = value.toFixed(1);
    const sign = value > 0 ? '+' : '';
    const label = `${sign}${number}%`;
    const icon = value > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
    const isTrendPositive = (value > 0) ^ !isPositiveGreen;
    const color = isTrendPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;
    const backgroundColor = isTrendPositive ? POSITIVE_BACKGROUND_COLOR : NEGATIVE_BACKGROUND_COLOR;
    return { backgroundColor, color, icon, label };
  }, [isPositiveGreen, value]);

  return (
    <Chip
      color="primary"
      sx={{
        backgroundColor: chipData.backgroundColor,
        borderColor: chipData.backgroundColor,
        color: chipData.color,
        fontWeight: 700,
      }}
      icon={chipData.icon}
      label={chipData.label}
      variant="outlined"
    />
  );
};

KpiTrendChip.propTypes = {
  isPositiveGreen: PropTypes.bool,
  value: PropTypes.number,
};

export default KpiTrendChip;
