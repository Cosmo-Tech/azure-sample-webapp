// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import { Icon } from '../Icon';

export const ErrorPage = ({
  code,
  title,
  description,
  showBack = true,
  onBack,
  homeUrl = '/',
  children,
  backLabel,
  homeLabel,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
        border: (theme) => `1rem solid ${theme.palette.background.background01.main}`,
        p: 4,
      }}
    >
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          {code}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: 26,
            color: (theme) => theme.palette.secondary.main,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: 12,
              color: (theme) => theme.palette.neutral.neutral02.main,
            }}
          >
            {description}
          </Typography>
          {children}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {showBack && (
            <Button variant="outlined" state="enabled" onClick={onBack} startIcon={<Icon name="ArrowLeft" size={18} />}>
              {backLabel}
            </Button>
          )}

          {homeLabel && (
            <Button variant="highlighted" state="enabled" href={homeUrl} startIcon={<Icon name="Home" size={18} />}>
              {homeLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

ErrorPage.propTypes = {
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  homeUrl: PropTypes.string,
  children: PropTypes.node,
  backLabel: PropTypes.string,
  homeLabel: PropTypes.string,
};
