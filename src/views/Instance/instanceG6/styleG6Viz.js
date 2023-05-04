// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Nodes
const NODE_DEFAULT_COLOR = '#00502C';
const COMBO_DEFAULT_COLOR = '#466282';

// Edges
const EDGE_DEFAULT_COLOR = '#999999';
const EDGE_WIDTH = 2;

// Styles details
export const getDefaultEdgeStyle = (theme) => ({
  type: 'arc',
  style: {
    stroke: EDGE_DEFAULT_COLOR,
    width: EDGE_WIDTH,
    endArrow: true,
  },
});

export const getDefaultComboStyle = (theme) => ({
  type: 'rect',
  style: {
    lineWidth: 0,
    fill: COMBO_DEFAULT_COLOR,
    fillOpacity: 0.2,
  },
  labelCfg: {
    position: 'top-center',
    style: {
      fill: theme.palette.text.primary,
    },
  },
});

export const getDefaultNodeStyle = (theme) => ({
  type: 'circle',
  style: {
    lineWidth: 0,
    fill: NODE_DEFAULT_COLOR,
  },
  labelCfg: {
    position: 'top',
    style: {
      fill: theme.palette.text.primary,
    },
  },
});
