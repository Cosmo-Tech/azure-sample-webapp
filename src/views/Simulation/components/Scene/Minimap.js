// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  CenterFocusStrong as CenterFocusStrongIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { Button, Paper, Stack } from '@mui/material';
import { MinimapContainer } from '../../utils/MinimapContainer';

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
        }}
      >
        <div
          ref={canvasMinimapRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: `${MinimapContainer.getMinimapSize().width}px`,
            height: `${MinimapContainer.getMinimapSize().height}px`,
          }}
        ></div>
      </Paper>
      <Stack direction="row" sx={{ marginTop: 0.5 }} justifyContent="space-between" alignItems="center">
        <Button size="small" variant="contained" onClick={() => sceneContainer.zoomOnPoint(1)} color="inherit">
          <ZoomInIcon />
        </Button>
        <Button size="small" variant="contained" onClick={() => sceneContainer.zoomOnPoint(-1)} color="inherit">
          <ZoomOutIcon />
        </Button>
        <Button size="small" variant="contained" onClick={() => sceneContainer.backToOrigin()} color="inherit">
          <CenterFocusStrongIcon />
        </Button>
      </Stack>
    </Stack>
  );
});

Minimap.propTypes = {
  sceneContainer: PropTypes.object,
};
