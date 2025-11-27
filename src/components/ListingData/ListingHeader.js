// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SquarePlus } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, useTheme } from '@mui/material';

export const ListingHeader = ({ title, subtitle, buttonLabel, onButtonClick }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.background01.main,
        px: 2,
        py: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: 26,
            fontWeight: 700,
            color: theme.palette.secondary.primary,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: theme.palette.secondary.primary }}>
          {subtitle}
        </Typography>
      </Box>

      <Button variant="highlighted" startIcon={<SquarePlus size={16} />} onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </Box>
  );
};

ListingHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
};
