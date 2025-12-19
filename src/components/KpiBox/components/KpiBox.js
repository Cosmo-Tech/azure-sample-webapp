// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Stack } from '@mui/material';
import { ComparisonPill } from './ComparisonPill';

export const KPIBox = ({
  title,
  value,
  comparison,
  scenarioName,
  children,
  comparisonColor,
  background,
  border,
  currency,
  currencyPosition = 'after',
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 180,
        backgroundColor: background,
        borderRadius: '4px',
        border: border ? (theme) => `1px solid ${theme.palette.background.background02.main}` : 'none',
        padding: 1,
        overflow: 'hidden',
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: (theme) => theme.palette.secondary.main,
              fontSize: 12,
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction={currencyPosition === 'after' ? 'row-reverse' : 'row'} alignItems="center">
            <Typography
              component="span"
              sx={{
                fontSize: 24,
                fontWeight: 600,
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              {currency}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: 32,
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              {value}
            </Typography>
          </Stack>
          {comparison !== undefined && <ComparisonPill value={comparison} colorMode={comparisonColor} />}
        </Stack>
        {scenarioName && (
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: (theme) => theme.palette.secondary.main,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mt: 1,
            }}
          >
            {scenarioName}
          </Typography>
        )}

        {children}
      </Stack>
    </Box>
  );
};

KPIBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  comparison: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scenarioName: PropTypes.string,
  children: PropTypes.node,
  comparisonColor: PropTypes.oneOf(['positive', 'negative', 'neutral']),
  background: PropTypes.string,
  border: PropTypes.bool,

  currency: PropTypes.string,
  currencyPosition: PropTypes.oneOf(['before', 'after']),
};
