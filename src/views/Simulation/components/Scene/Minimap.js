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
import { useTheme } from '@mui/styles';
import { simulationTheme } from '../../theme';
import { MinimapContainer } from '../../utils/MinimapContainer';
import { ChartLegendCard } from '../ChartLegendCard';

export const Minimap = forwardRef(function Minimap({ sceneContainerRef }, canvasMinimapRef) {
  const theme = useTheme();
  const palette = simulationTheme[theme.palette.mode];

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
      {chartLegendIsOpen && <ChartLegendCard onClose={() => setChartLegendIsOpen(false)} />}
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
          color="inherit"
          onClick={() => sceneContainerRef?.current?.zoomOnPoint(1)}
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: palette.button.background, color: palette.button.color }}
        >
          <ZoomInIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => sceneContainerRef?.current?.zoomOnPoint(-1)}
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: palette.button.background, color: palette.button.color }}
        >
          <ZoomOutIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => sceneContainerRef?.current?.backToOrigin()}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{
            backgroundColor: palette.button.background,
            color: palette.button.color,
            hoverBackground: palette.button.hoverBackground,
          }}
        >
          <CenterFocusStrongIcon />
        </Button>
        <Button
          variant="contained"
          onClick={() => setChartLegendIsOpen(!chartLegendIsOpen)}
          color="inherit"
          sx={{ minHeight: 45, minWidth: 60 }}
          style={{ backgroundColor: palette.button.background, color: palette.button.color }}
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
