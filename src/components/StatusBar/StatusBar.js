// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { TriangleAlert, Lock, CircleHelp, CircleCheck, CircleX } from 'lucide-react';
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';

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
    bg: theme.palette.background.background02.main,
    text: theme.palette.neutral.neutral02.main,
    icon: <Lock size={16} color={theme.palette.neutral.neutral02.main} />,
  },
});

const SIZE_CONFIG = {
  small: { height: 36, padding: '0 8px', fontSize: '14px' },
  medium: { height: 36, padding: '0 8px', fontSize: '14px' },
  full: { height: 44, padding: '0 16px', fontSize: '14px' },
};

const StatusBar = ({ status, size, message, tooltip, onClose }) => {
  const sizeConfig = SIZE_CONFIG[size];
  const theme = useTheme();
  const statusConfig = STATUS_CONFIG(theme)[status];
  const [statusVisible, setStatusVisible] = useState(true);

  const onCloseClick = () => {
    setStatusVisible(false);
    onClose();
  };

  if (!statusConfig) return null;

  return (
    <Box
      sx={{
        display: statusVisible ? 'inline-flex' : 'none',
        alignItems: 'center',
        height: sizeConfig.height,
        padding: sizeConfig.padding,
        borderRadius: size === 'full' ? '0px' : '17px',
        backgroundColor: statusConfig.bg,
        border: `1px solid ${statusConfig.bg}`,
        width: size === 'full' ? '100%' : 'auto',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" alignItems="center">
        {statusConfig.icon}
        {size !== 'small' && (
          <Fragment>
            <Typography
              sx={{
                fontSize: sizeConfig.fontSize,
                color: statusConfig.text,
                lineHeight: 0,
                marginLeft: 0.5,
                marginRight: 2,
              }}
            >
              Status:
            </Typography>

            {size !== 'full' && (
              <Typography
                sx={{
                  fontSize: sizeConfig.fontSize,
                  fontWeight: 600,
                  marginRight: 0.5,
                  lineHeight: 0,
                  color: (theme) => theme.palette.secondary.main,
                }}
              >
                {statusConfig.label}
              </Typography>
            )}
          </Fragment>
        )}

        {size === 'full' && message && (
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
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
              },
            },
          }}
        >
          <span style={{ marginLeft: size === 'small' ? 8 : 0, display: 'flex', alignItems: 'center', width: 12 }}>
            <CircleHelp size={12} color={theme.palette.secondary.main} />
          </span>
        </Tooltip>
      </Stack>
      {onClose && (
        <Box onClick={onCloseClick} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <CircleX size={16} color={statusConfig.text} />
        </Box>
      )}
    </Box>
  );
};

StatusBar.propTypes = {
  status: PropTypes.oneOf(['valid', 'invalid', 'edited', 'prerun', 'locked']).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'full']),
  message: PropTypes.string,
  tooltip: PropTypes.string,
  onClose: PropTypes.func,
};

export default StatusBar;
