// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Tooltip, IconButton, Divider, useTheme } from '@mui/material';
import { Icon } from '../Icon';

export const PageHeader = ({
  title,
  createdLabel,
  createdDate,
  runTypeLabel,
  runTypeValue,
  onInfoHoverText,
  actions,
}) => {
  const theme = useTheme();

  return (
    <Stack width="100%" spacing={2} sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
        <Stack width="100%" maxWidth="70%">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 26,
                color: theme.palette.secondary.main,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>

            {onInfoHoverText && (
              <Tooltip title={onInfoHoverText} arrow>
                <IconButton size="small" sx={{ p: 0.3 }}>
                  <Icon name="Info" size={18} color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: theme.palette.secondary.main,
              }}
            >
              {createdLabel}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.palette.secondary.main,
              }}
            >
              {createdDate}
            </Typography>

            <Divider
              orientation="vertical"
              sx={{
                borderColor: theme.palette.background.background02.main,
                borderWidth: 1,
                ml: 1,
                mr: 1,
                height: 14,
              }}
            />

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              {runTypeLabel}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              {runTypeValue}
            </Typography>
          </Stack>
        </Stack>

        {actions && (
          <Stack direction="row" alignItems="center" gap={1}>
            {actions.map((btn, i) => (
              <Box key={i}>{btn}</Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  createdLabel: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  runTypeLabel: PropTypes.string.isRequired,
  runTypeValue: PropTypes.string.isRequired,
  onInfoHoverText: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
};
