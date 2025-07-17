// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

export const InspectorHeader = ({ inspectedElement, handleCloseButtonClick }) => {
  // const type = inspectedElement?.type;

  return (
    <div style={{ wordBreak: 'break-word' }}>
      <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'start' }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="fontWeightBold" sx={{ pt: '4px' }}>
            {inspectedElement?.id}
          </Typography>
        </Stack>
        <div>
          <IconButton onClick={handleCloseButtonClick}>
            <CloseIcon />
          </IconButton>
        </div>
      </Stack>
    </div>
  );
};

InspectorHeader.propTypes = {
  inspectedElement: PropTypes.object,
  handleCloseButtonClick: PropTypes.func.isRequired,
};
