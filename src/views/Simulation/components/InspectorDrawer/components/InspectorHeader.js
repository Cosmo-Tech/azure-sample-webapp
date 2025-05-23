// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

export const InspectorHeader = ({ selectedElement, clearSelection }) => {
  // const type = selectedElement?.type;

  return (
    <div style={{ wordBreak: 'break-word' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'start' }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="fontWeightBold" sx={{ pt: '4px' }}>
            {selectedElement?.id}
          </Typography>
        </Stack>
        <div>
          <IconButton onClick={clearSelection}>
            <CloseIcon />
          </IconButton>
        </div>
      </Stack>
    </div>
  );
};

InspectorHeader.propTypes = {
  selectedElement: PropTypes.object,
  clearSelection: PropTypes.func.isRequired,
};
