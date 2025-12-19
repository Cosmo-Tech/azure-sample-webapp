// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export default function TabLabel({ icon: Icon, color, title, desc }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon style={{ fontSize: 24, marginBottom: 16, color }} />
      <Typography variant="subtitle1" fontWeight={600} sx={{ color, fontSize: 20 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color }}>
        {desc}
      </Typography>
    </Box>
  );
}

TabLabel.propTypes = {
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};
