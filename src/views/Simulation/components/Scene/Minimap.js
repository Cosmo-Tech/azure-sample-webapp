// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CenterFocusStrong as CenterFocusStrongIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { Button, Paper, Stack } from '@mui/material';
import { MinimapContainer } from '../../utils/MinimapContainer';
import { ChartLegendCard } from '../ChartLegendCard';
import { BUTTON_BACKGROUND_COLOR } from './styleConstants';

export const Minimap = forwardRef(function Minimap({ sceneContainerRef }, canvasMinimapRef) {
  const [chartLegendIsOpen, setChartLegendIsOpen] = useState(false);

  return (
    <Stack
      direction="column"
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 25,
      }}
    >
      {chartLegendIsOpen && <ChartLegendCard onCLose={() => setChartLegendIsOpen(false)} />}
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
      <Stack direction="row" sx={{ mt: 1 }} justifyContent="space-between" alignItems="center">
        <Button
          size="medium"
          variant="contained"
          onClick={() => sceneContainerRef?.current?.zoomOnPoint(1)}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
        >
          <ZoomInIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => sceneContainerRef?.current?.zoomOnPoint(-1)}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
        >
          <ZoomOutIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => sceneContainerRef?.current?.backToOrigin()}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
        >
          <CenterFocusStrongIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => setChartLegendIsOpen(!chartLegendIsOpen)}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
        >
          <InfoOutlinedIcon />
        </Button>
      </Stack>
    </Stack>
  );
});

Minimap.propTypes = {
  sceneContainerRef: PropTypes.object,
};
