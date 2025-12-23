// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Icon } from '../Icon';

export const ListingEmpty = ({ title, subtitle, buttonLabel, onButtonClick }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
        textAlign: 'center',
        border: `16px solid ${theme.palette.neutral.neutral04.main}`,
        borderRadius: '8px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: 26,
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.secondary.main,
          mb: 3,
          maxWidth: '500px',
        }}
      >
        {subtitle}
      </Typography>

      <Button variant="highlighted" startIcon={<Icon name="SquarePlus" size={16} />} onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </Box>
  );
};

ListingEmpty.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
};
