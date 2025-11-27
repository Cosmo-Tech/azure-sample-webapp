// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { TriangleAlert, Lock, CircleHelp, CircleCheck } from 'lucide-react';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';

const STATUS_CONFIG = (theme) => ({
  valid: {
    label: 'Valid',
    bg: theme.palette.neutral.neutral08.main,
    text: theme.palette.status.success.main,
    icon: <CircleCheck size={16} color={theme.palette.status.success.main} />,
  },
  invalid: {
    label: 'Invalid',
    bg: theme.palette.status.error.background,
    text: theme.palette.status.error.main,
    icon: <TriangleAlert size={16} color={theme.palette.status.error.main} />,
  },
  edited: {
    label: 'Edited',
    bg: theme.palette.status.warning.background,
    text: theme.palette.status.warning.main,
    icon: <TriangleAlert size={16} color={theme.palette.status.warning.main} />,
  },
  prerun: {
    label: 'Pre-run',
    bg: theme.palette.status.information.background,
    text: theme.palette.status.information.main,
    icon: <TriangleAlert size={16} color={theme.palette.status.information.main} />,
  },
  locked: {
    label: 'Locked',
    bg: theme.palette.neutral.neutral03.main,
    text: theme.palette.neutral.neutral02.main,
    icon: <Lock size={16} color={theme.palette.neutral.neutral02.main} />,
  },
});

const SIZE_CONFIG = {
  small: { height: 36, padding: '0 8px', fontSize: '12px' },
  medium: { height: 36, padding: '0 8px', fontSize: '12px' },
  full: { height: 44, padding: '0 16px', fontSize: '12px' },
};

const StatusBar = ({ status, size, message, tooltip }) => {
  const sizeConfig = SIZE_CONFIG[size];
  const theme = useTheme();
  const statusConfig = STATUS_CONFIG(theme)[status];

  if (!statusConfig) return null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: sizeConfig.height,
        padding: sizeConfig.padding,
        borderRadius: size === 'full' ? '0px' : '17px',
        backgroundColor: statusConfig.bg,
        border: `1px solid ${statusConfig.bg}`,
        width: size === 'full' ? '100%' : 'fit-content',
      }}
    >
      {statusConfig.icon}

      {size !== 'small' && (
        <Fragment>
          <Typography
            sx={{
              fontSize: sizeConfig.fontSize,
              color: statusConfig.text,
              lineHeight: 0,
              marginLeft: 0.5,
            }}
          >
            Status:
          </Typography>

          <Typography
            sx={{
              fontSize: sizeConfig.fontSize,
              marginLeft: 2,
              fontWeight: 600,
              marginRight: 0.5,
              lineHeight: 0,
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            {statusConfig.label}
            {size === 'full' ? ':' : ''}
          </Typography>
        </Fragment>
      )}

      {size === 'full' && message && (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 0,
            marginRight: 0.5,
            color: (theme) => theme.palette.secondary.main,
          }}
        >
          {message}
        </Typography>
      )}
      <Tooltip
        title={tooltip}
        placement="bottom"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
              color: (theme) => theme.palette.secondary.main,
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: (theme) => theme.shadows[3],

              '& .MuiTooltip-arrow': {
                color: (theme) => theme.palette.neutral.neutral04.main,
              },
            },
          },
        }}
      >
        <Box sx={{ ml: size === 'small' ? 1 : 0, display: 'flex', alignItems: 'center', width: 12 }}>
          <CircleHelp size={12} color={theme.palette.secondary.main} />
        </Box>
      </Tooltip>
    </Box>
  );
};

StatusBar.propTypes = {
  status: PropTypes.oneOf(['valid', 'invalid', 'edited', 'prerun', 'locked']).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'full']),
  message: PropTypes.string,
  tooltip: PropTypes.string,
};

export default StatusBar;
