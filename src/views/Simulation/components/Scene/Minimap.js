// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { IconButton, Paper, Stack } from '@mui/material';

export const Minimap = forwardRef(function Minimap(props, canvasMinimapRef) {
  const { sceneContainer } = props;

  return (
    <Stack
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 25,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          border: '2px solid #ccc',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          ref={canvasMinimapRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        ></div>
      </Paper>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={() => sceneContainer.backToOrigin()}>
          <CenterFocusStrongIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
});

Minimap.propTypes = {
  sceneContainer: PropTypes.object,
};
