// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import FactoryIcon from '@mui/icons-material/Factory';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Box, Typography } from '@mui/material';

export const IncidentChip = ({ position, data, visible }) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -120%)',
        backgroundColor: '#DF35371A',
        borderRadius: '999px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #DF353726',
        gap: '12px',
        color: 'white',
        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
        fontSize: '16px',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#DF3537',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <FactoryIcon sx={{ fontSize: 16 }} />
        <Typography>{data.bottlenecks}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <InventoryIcon sx={{ fontSize: 16 }} />
        <Typography>{data.shortages}</Typography>
      </Box>
    </Box>
  );
};

IncidentChip.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  data: PropTypes.shape({
    bottlenecks: PropTypes.number,
    shortages: PropTypes.number,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
};
