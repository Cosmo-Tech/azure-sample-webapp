// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { TrendingUp, TrendingDown, TrendingUpDown } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Stack, useTheme } from '@mui/material';

const COLORS = (theme) => ({
  positive: { bg: theme.palette.status.success.background, text: theme.palette.status.success.main },
  negative: { bg: theme.palette.status.error.background, text: theme.palette.status.error.main },
  neutral: { bg: theme.palette.neutral.neutral04.main, text: theme.palette.neutral.neutral03.main },
});

export const ComparisonPill = ({ value, colorMode = 'neutral' }) => {
  const theme = useTheme();
  const cfg = COLORS(theme)[colorMode];

  const Icon = colorMode === 'positive' ? TrendingUp : colorMode === 'negative' ? TrendingDown : TrendingUpDown;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{
        height: '24px',
        px: '8px',
        background: cfg.bg,
        borderRadius: '12px',
        border: cfg.border || 'none',
      }}
    >
      <Icon size={16} color={cfg.text} />

      <Typography
        variant="caption"
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: cfg.text,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};

ComparisonPill.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  colorMode: PropTypes.oneOf(['positive', 'negative', 'neutral']),
};
